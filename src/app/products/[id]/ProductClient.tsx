'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, ShoppingBag, ArrowRight, Check, Info, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'

function getDeterministicRating(id: string) {
  let sum = 0
  for (let i = 0; i < id.length; i++) {
    sum += id.charCodeAt(i)
  }
  return 4.0 + (sum % 11) / 10
}

export default function ProductClient({ productData, relatedProductsData }: { productData: any, relatedProductsData: any[] }) {
  const params = useParams()
  const id = params?.id
  const [product, setProduct] = useState<any>(productData)
  const [relatedProducts, setRelatedProducts] = useState<any[]>(relatedProductsData)
  const [loading, setLoading] = useState(false)
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

  // Initial fetch handled by Server Component

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
                className="flex-1 bg-gradient-to-r from-brand-blue via-brand-blue-mid to-brand-green 
                  hover:from-brand-blue-mid hover:to-brand-blue text-white font-medium py-3.5 px-6 
                  rounded-full transition-all duration-300 flex items-center justify-center gap-2 
                  shadow-[0_4px_15px_rgba(15,61,147,0.3)] hover:shadow-[0_4px_20px_rgba(15,61,147,0.5)] group"
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
              {relatedProducts.map((relProduct: any) => {
                const isOutOfStock = relProduct.stock <= 0
                return (
                  <div 
                    key={relProduct.id} 
                    className="bg-white rounded-3xl border border-slate-100 p-5 flex flex-col justify-between h-[385px] transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.015)] hover:shadow-[0_16px_40px_rgba(15,61,147,0.065)] hover:-translate-y-1.5 group text-left relative"
                  >
                    <div>
                      {/* Card Image Container */}
                      <div className="h-32 w-full bg-white rounded-2xl flex items-center justify-center p-2 border border-slate-50 relative overflow-hidden group-hover:border-brand-green/10 transition-colors">
                        <div className="absolute w-32 h-32 rounded-full bg-white/60 blur-xl pointer-events-none" />
                        {relProduct.imagen_url ? (
                          <Image src={relProduct.imagen_url} alt={relProduct.nombre} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <ShoppingBag className="h-12 w-12 text-foreground/20 group-hover:text-brand-blue/30 transition-colors" />
                        )}
                        
                        {/* Badges Container */}
                        <div className="absolute top-2 left-2 z-20 flex flex-col gap-1 items-start">
                          {relProduct.descuento > 0 && (
                            <span className="bg-[#e53e3e] text-white text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wide">
                              -{relProduct.descuento}%
                            </span>
                          )}
                          {relProduct.en_tendencia && (
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
                          {product.catalogos?.nombre || relProduct.linea || "Medicamento"}
                        </span>
                        
                        {/* Bold Product Name */}
                        <h4 className="text-sm font-black text-brand-dark line-clamp-1 group-hover:text-brand-green transition-colors leading-tight">
                          {relProduct.nombre}
                        </h4>

                        {/* Presentation / Active details in Gray */}
                        <p className="text-[10px] text-gray-400 font-bold truncate">
                          {relProduct.principio_activo && `${relProduct.principio_activo} • `}{relProduct.presentacion || "1 Unidad"}
                        </p>

                        {/* Ratings */}
                        <div className="flex items-center gap-0.5 pt-1">
                          {(() => {
                            const rating = getDeterministicRating(relProduct.id)
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
                        href={`/products/${relProduct.id}`}
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
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

