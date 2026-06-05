'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function CatalogPage() {
  const params = useParams()
  const id = params?.id
  const [catalog, setCatalog] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchCatalogAndProducts()
    }
  }, [id])

  const fetchCatalogAndProducts = async () => {
    try {
      setLoading(true)
      
      // Fetch Catalog
      const { data: catalogData, error: catalogError } = await supabase
        .from('catalogos')
        .select('*')
        .eq('id', id)
        .eq('empresa', 'farmatuya')
        .single()
        
      if (catalogError) {
        console.error("Error fetching catalog:", catalogError)
      }
      
      setCatalog(catalogData)

      // Fetch Products
      const { data: productsData, error: productsError } = await supabase
        .from('productos')
        .select('*')
        .eq('catalogo_id', id)
        .eq('empresa', 'farmatuya')
        .order('nombre', { ascending: true })
        
      if (productsError) {
        console.error("Error fetching products:", productsError)
      }
      
      setProducts(productsData || [])
    } catch (err) {
      console.error("Unexpected error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-foreground/60">Cargando catálogo...</div>
      </div>
    )
  }

  if (!catalog) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="text-foreground/60">Catálogo no encontrado</div>
        <Link href="/" className="text-brand-blue hover:underline flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Volver al inicio
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-foreground font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden mb-12 p-8 md:p-12
          bg-gradient-to-br from-brand-blue-mid to-brand-blue
          shadow-[0_20px_60px_rgba(13,27,75,0.15)]">
          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-brand-green/10 
            rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 
            rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 
              text-brand-green font-semibold tracking-wider uppercase text-xs 
              px-4 py-2 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse"></span>
              Línea de Productos
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {catalog.nombre}
            </h1>
            <p className="text-white/70 max-w-3xl text-sm md:text-base leading-relaxed">
              {catalog.descripcion}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.length === 0 ? (
            <div className="col-span-4 text-center text-foreground/60 py-12">
              No hay productos registrados en esta línea.
            </div>
          ) : (
            products.map((product: any) => (
              <Link href={`/products/${product.id}`} key={product.id} className="bg-white rounded-2xl overflow-hidden card-glow border border-gray-100/80 flex flex-col group relative">
                
                {/* Image container */}
                <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  {product.imagen_url ? (
                    <Image src={product.imagen_url} alt={product.nombre} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-contain p-4 transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <ShoppingBag className="h-12 w-12 text-foreground/20 group-hover:text-brand-blue/30 transition-colors" />
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-foreground group-hover:text-brand-green transition-colors duration-300">
                      {product.nombre}
                    </h3>
                    {product.principio_activo && (
                      <p className="text-sm text-brand-blue font-medium mb-1 group-hover:text-brand-blue-mid transition-colors">
                        {product.principio_activo}
                      </p>
                    )}
                    {product.presentacion && (
                      <p className="text-sm text-foreground/60 mb-2">{product.presentacion}</p>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center w-full">
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                      product.stock > 0 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                        : "bg-red-50 text-red-700 border-red-100"
                    }`}>
                      {product.stock > 0 ? 'Disponible' : 'Agotado'}
                    </span>
                    <span className="text-xs font-black text-brand-blue group-hover:text-brand-green transition-colors flex items-center gap-0.5">
                      Ver Detalles →
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
