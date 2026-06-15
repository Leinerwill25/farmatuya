'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, ShoppingBag, Star, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'

function getDeterministicRating(id: string) {
  let sum = 0
  for (let i = 0; i < id.length; i++) {
    sum += id.charCodeAt(i)
  }
  return 4.0 + (sum % 11) / 10
}

export default function CatalogClient({ catalogData, productsData }: { catalogData: any, productsData: any[] }) {
  const params = useParams()
  const id = params?.id
  const [catalog, setCatalog] = useState<any>(catalogData)
  const [products, setProducts] = useState<any[]>(productsData)
  const [loading, setLoading] = useState(false)

  // Initial fetch handled by Server Component

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
          bg-gradient-to-br from-brand-blue-mid via-brand-blue to-brand-green/30
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
            products.map((product: any) => {
              const isOutOfStock = product.stock <= 0
              return (
                <div 
                  key={product.id} 
                  className="bg-white rounded-3xl border border-slate-100 p-5 flex flex-col justify-between h-[385px] transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.015)] hover:shadow-[0_16px_40px_rgba(15,61,147,0.065)] hover:-translate-y-1.5 group text-left relative"
                >
                  <div>
                    {/* Card Image Container */}
                    <div className="h-32 w-full bg-white rounded-2xl flex items-center justify-center p-2 border border-slate-50 relative overflow-hidden group-hover:border-brand-green/10 transition-colors">
                      <div className="absolute w-32 h-32 rounded-full bg-white/60 blur-xl pointer-events-none" />
                      {product.imagen_url ? (
                        <Image src={product.imagen_url} alt={product.nombre} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <ShoppingBag className="h-12 w-12 text-foreground/20 group-hover:text-brand-blue/30 transition-colors" />
                      )}
                      
                      {/* Badges Container */}
                      <div className="absolute top-2 left-2 z-20 flex flex-col gap-1 items-start">
                        {product.descuento > 0 && (
                          <span className="bg-[#e53e3e] text-white text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wide">
                            -{product.descuento}%
                          </span>
                        )}
                        {product.en_tendencia && (
                          <span className="bg-[#ff8a00] text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm">
                            Destacado
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product Text details */}
                    <div className="mt-3.5 space-y-1">
                      {/* Category Name in Blue */}
                      <span className="text-[10px] font-extrabold text-brand-blue uppercase tracking-wider block">
                        {catalog.nombre || "Medicamento"}
                      </span>
                      
                      {/* Bold Product Name */}
                      <h4 className="text-sm font-black text-brand-dark line-clamp-1 group-hover:text-brand-green transition-colors leading-tight">
                        {product.nombre}
                      </h4>

                      {/* Presentation / Active details in Gray */}
                      <p className="text-[10px] text-gray-400 font-bold truncate">
                        {product.principio_activo && `${product.principio_activo} • `}{product.presentacion || "1 Unidad"}
                      </p>

                      {/* Ratings */}
                      <div className="flex items-center gap-0.5 pt-1">
                        {(() => {
                          const rating = getDeterministicRating(product.id)
                          const isFive = rating >= 4.5
                          return (
                            <>
                              {Array.from({ length: 4 }).map((_, i) => (
                                <Star key={`f-${i}`} className="w-3 h-3 fill-amber-400 text-amber-400" />
                              ))}
                              {isFive ? (
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              ) : (
                                <Star className="w-3 h-3 text-slate-200 fill-slate-100" />
                              )}
                              <span className="text-[9px] text-gray-400 font-extrabold ml-1">1</span>
                            </>
                          )
                        })()}
                      </div>
                    </div>

                    {/* Stock status indicator bar */}
                    <div className="mt-3.5 w-full">
                      <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 mb-1">
                        <span>Stock</span>
                        <span className={!isOutOfStock ? "text-emerald-600 font-extrabold" : "text-red-500 font-extrabold"}>
                          {!isOutOfStock ? "Disponible" : "Agotado"}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${!isOutOfStock ? 'bg-[#0F3D93] w-full' : 'bg-red-200 w-0'}`} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="mt-3">
                    <Link 
                      href={`/products/${product.id}`}
                      className="w-full py-2.5 px-4 rounded-full bg-[#0F3D93] hover:bg-[#144CBA] text-white transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] group"
                    >
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="6" cy="18" r="2" />
                        <circle cx="18" cy="18" r="2" />
                        <path d="M6 18h4l2-5h6v3" />
                        <path d="M12 13l-1-4h-3V7" />
                        <rect x="5" y="8" width="5" height="5" rx="1" />
                        <path d="M2 9h2M2 12h1" />
                      </svg>
                      <div className="flex flex-col items-start leading-none text-left">
                        <span className="text-[8px] font-medium opacity-85">Comprar con</span>
                        <span className="text-[10px] font-black uppercase tracking-wider">FarmaTuya Express</span>
                      </div>
                    </Link>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}

