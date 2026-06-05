'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, ShoppingBag, ArrowRight, Check, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'

export default function ProductPage() {
  const params = useParams()
  const id = params?.id
  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('description')

  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transformOrigin: 'center center',
    transform: 'scale(1)'
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2.2)'
    })
  }

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)'
    })
  }

  useEffect(() => {
    if (id) {
      fetchProductAndRelated()
    }
  }, [id])

  const fetchProductAndRelated = async () => {
    try {
      setLoading(true)
      
      // Fetch Product
      const { data: productData, error: productError } = await supabase
        .from('productos')
        .select('*, catalogos(nombre)')
        .eq('id', id)
        .eq('empresa', 'farmatuya')
        .single()
        
      if (productError) {
        console.error("Error fetching product:", productError)
      }
      
      setProduct(productData)

      if (productData) {
        // Fetch Related Products (same catalog)
        const { data: relatedData, error: relatedError } = await supabase
          .from('productos')
          .select('*')
          .eq('catalogo_id', productData.catalogo_id)
          .eq('empresa', 'farmatuya')
          .neq('id', id)
          .limit(4)
          
        if (relatedError) {
          console.error("Error fetching related products:", relatedError)
        }
        
        setRelatedProducts(relatedData || [])
      }
    } catch (err) {
      console.error("Unexpected error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="text-foreground/60 text-lg">Producto no encontrado</div>
        <Link href="/" className="text-brand-blue hover:underline flex items-center gap-2 font-medium">
          <ArrowLeft className="h-4 w-4" /> Volver al inicio
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-foreground font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-foreground/60 mb-8 gap-2 items-center bg-muted/50 rounded-full px-4 py-2 w-fit print:hidden">
          <Link href="/" className="hover:text-brand-green transition-colors">Inicio</Link>
          <span>/</span>
          <Link href={`/catalogs/${product.catalogo_id}`} className="hover:text-brand-green transition-colors">
            {product.catalogos?.nombre || 'Catálogo'}
          </Link>
          <span>/</span>
          <span className="text-brand-dark font-medium">{product.nombre}</span>
        </nav>

        {/* Product Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Image */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-[400px] lg:h-[500px] bg-gradient-to-br from-muted via-muted/80 to-brand-blue/5 rounded-3xl overflow-hidden flex items-center justify-center border border-brand-blue/10 cursor-zoom-in shadow-[0_20px_60px_rgba(26,58,143,0.08)]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {product.imagen_url ? (
              <Image 
                src={product.imagen_url} 
                alt={product.nombre} 
                fill 
                sizes="(max-width: 1024px) 100vw, 50vw" 
                className="object-contain p-6 transition-transform duration-100 ease-out"
                style={zoomStyle}
                priority
              />
            ) : (
              <div className="flex flex-col items-center gap-4 text-foreground/30">
                <ShoppingBag className="h-20 w-20" />
                <span className="text-sm font-medium">Imagen no disponible</span>
              </div>
            )}
            
            {/* Status Badge */}
            <div className={`absolute top-4 left-4 backdrop-blur-sm px-3 py-1.5 rounded-full 
              text-xs font-semibold flex items-center gap-1.5 shadow-sm
              ${product.stock > 0 
                ? 'bg-green-500/10 border border-green-500/30 text-green-700' 
                : 'bg-red-500/10 border border-red-500/30 text-red-700'}`}>
              <div className={`w-2 h-2 rounded-full relative
                ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                {product.stock > 0 && (
                  <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                )}
              </div>
              {product.stock > 0 ? 'En Stock' : 'Agotado'}
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col justify-between py-2"
          >
            <div>
              <span className="text-brand-green font-semibold tracking-wider uppercase text-xs mb-2 block">
                {product.linea || 'Línea de Salud'}
              </span>
              <h1 className="text-4xl font-bold text-brand-dark mb-2">{product.nombre}</h1>
              
              {product.principio_activo && (
                <p className="text-xl text-brand-blue font-medium mb-4">{product.principio_activo}</p>
              )}
 

 
              <p className="text-gray-600 leading-relaxed mb-6">
                {product.descripcion || 'Sin descripción detallada disponible para este producto.'}
              </p>
 
              {/* Key Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-b border-gray-100 py-6 mb-6">
                <div className="bg-muted/50 rounded-xl p-4">
                  <span className="text-xs text-foreground/50 uppercase font-medium block mb-1">
                    Presentación
                  </span>
                  <span className="text-brand-dark font-semibold text-sm">
                    {product.presentacion || 'No especificada'}
                  </span>
                </div>
                <div className="bg-muted/50 rounded-xl p-4">
                  <span className="text-xs text-foreground/50 uppercase font-medium block mb-1">
                    Principio Activo
                  </span>
                  <span className="text-brand-dark font-semibold text-sm">
                    {product.principio_activo || 'No especificado'}
                  </span>
                </div>
                <div className="bg-muted/50 rounded-xl p-4">
                  <span className="text-xs text-foreground/50 uppercase font-medium block mb-1">
                    Disponibilidad
                  </span>
                  <span className={`font-semibold text-sm ${product.stock > 0 ? 'text-emerald-600' : 'text-red-650'}`}>
                    {product.stock > 0 ? 'Disponible' : 'Agotado'}
                  </span>
                </div>
              </div>
            </div>
 
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 print:hidden">
              <a 
                href={`https://wa.me/584125040440?text=Hola,%20estoy%20interesado%20en%20el%20producto%20${encodeURIComponent(product.nombre)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-brand-green to-brand-green/90 
                  hover:from-brand-dark hover:to-brand-blue text-white font-medium py-3.5 px-6 
                  rounded-full transition-all duration-300 flex items-center justify-center gap-2 
                  shadow-[0_4px_15px_rgba(110,168,59,0.3)] hover:shadow-[0_4px_20px_rgba(13,27,75,0.4)] group"
              >
                Consultar por WhatsApp
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <button 
                onClick={() => window.print()}
                className="flex-1 border-2 border-brand-dark text-brand-dark 
                  hover:bg-brand-dark hover:text-white font-medium py-3.5 px-6 rounded-full 
                  transition-all duration-300 flex items-center justify-center gap-2
                  hover:shadow-[0_4px_20px_rgba(13,27,75,0.3)]"
              >
                Descargar Ficha
              </button>
            </div>
          </motion.div>
        </div>
 
        {/* Tabs Section (Description, Additional Info) */}
        <div className="mb-16 print:hidden">
          <div className="border-b border-gray-100 flex gap-8 mb-6">
            <button 
              onClick={() => setActiveTab('description')}
              className={`pb-4 text-sm font-semibold transition-colors relative ${activeTab === 'description' ? 'text-brand-green' : 'text-foreground/60 hover:text-foreground'}`}
            >
              Descripción
              {activeTab === 'description' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-green"></div>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('info')}
              className={`pb-4 text-sm font-semibold transition-colors relative ${activeTab === 'info' ? 'text-brand-green' : 'text-foreground/60 hover:text-foreground'}`}
            >
              Información Adicional
              {activeTab === 'info' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-green"></div>
              )}
            </button>
          </div>
 
          <div className="py-2">
            {activeTab === 'description' ? (
              <div className="prose max-w-none text-gray-600">
                <p>{product.descripcion || 'No hay descripción detallada disponible.'}</p>
                <p className="mt-4">Este producto cumple con todas las normativas sanitarias vigentes en el territorio venezolano.</p>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden border border-brand-blue/10 shadow-sm">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      ['Principio Activo', product.principio_activo || 'N/A'],
                      ['Presentación', product.presentacion || 'N/A'],
                      ['Línea Terapéutica', product.linea || 'N/A'],
                      ['Disponibilidad', product.stock > 0 ? 'Disponible' : 'Agotado'],
                      ['Contenido por Empaque', `${product.unidades_por_bulto || 1} unidades`],
                    ].map(([label, value], index) => (
                      <tr key={index} className={`border-b border-brand-blue/5 last:border-0
                        ${index % 2 === 0 ? 'bg-white' : 'bg-muted/30'}`}>
                        <td className="px-6 py-4 font-medium text-brand-dark w-1/3 
                          border-r border-brand-blue/5">{label}</td>
                        <td className="px-6 py-4 text-gray-600">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
 
        {/* Print Only Section */}
        <div className="hidden print:block mt-8 border-t pt-8">
          <h2 className="text-2xl font-bold mb-4 text-brand-dark">Ficha Técnica de Producto</h2>
          <div className="space-y-4 text-gray-600">
            <p><span className="font-semibold text-brand-dark">Producto:</span> {product.nombre}</p>
            {product.principio_activo && <p><span className="font-semibold text-brand-dark">Principio Activo:</span> {product.principio_activo}</p>}
            <p><span className="font-semibold text-brand-dark">Descripción:</span> {product.descripcion || 'No hay descripción disponible.'}</p>
            <p><span className="font-semibold text-brand-dark">Presentación:</span> {product.presentacion || 'N/A'}</p>
            <p><span className="font-semibold text-brand-dark">Línea de Salud:</span> {product.linea || 'N/A'}</p>
            <p><span className="font-semibold text-brand-dark">Contenido por Empaque:</span> {product.unidades_por_bulto || 1} unidades</p>
            <p><span className="font-semibold text-brand-dark">Disponibilidad:</span> {product.stock > 0 ? 'Disponible' : 'Agotado'}</p>
          </div>
          <p className="mt-8 text-xs text-foreground/60 text-center">Este documento es una ficha referencial generada desde el portal de FarmaTuya.</p>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="print:hidden">
            <div className="text-center mb-10">
              <span className="text-brand-green font-semibold tracking-wider uppercase text-xs mb-2 block">Sugerencias</span>
              <h2 className="text-3xl font-bold text-brand-dark mb-2">Productos Relacionados</h2>
              <p className="text-gray-600 text-sm">Otros productos disponibles en este mismo catálogo</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relProduct: any) => (
                <Link 
                  href={`/products/${relProduct.id}`} 
                  key={relProduct.id} 
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col group"
                >
                  <div className="relative h-48 bg-muted flex items-center justify-center">
                    {relProduct.imagen_url ? (
                      <Image src={relProduct.imagen_url} alt={relProduct.nombre} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <ShoppingBag className="h-12 w-12 text-foreground/20" />
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1 text-foreground group-hover:text-brand-green transition-colors">{relProduct.nombre}</h3>
                      {relProduct.principio_activo && (
                        <p className="text-sm text-brand-blue font-medium mb-1">{relProduct.principio_activo}</p>
                      )}
                      <p className="text-xs text-foreground/60 line-clamp-2">{relProduct.descripcion}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center text-sm w-full">
                      <span className={`text-[11px] font-black px-2.5 py-1 rounded-full border ${
                        relProduct.stock > 0 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                          : "bg-red-50 text-red-700 border-red-100"
                      }`}>
                        {relProduct.stock > 0 ? 'Disponible' : 'Agotado'}
                      </span>
                      <span className="text-xs font-black text-brand-blue group-hover:text-brand-green transition-colors">
                        Ver Detalles →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
