'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  ArrowUp, 
  ArrowDown, 
  Monitor, 
  Laptop as LaptopIcon, 
  Tablet as TabletIcon, 
  Smartphone, 
  MessageCircle, 
  ShoppingBag,
  Sparkles,
  Palette,
  Eye
} from 'lucide-react'

// Pre-designed palettes for quick insert
const PRESETS = [
  {
    name: "Cortynase (Púrpura)",
    color_fondo: "#620075",
    color_texto: "#ffffff",
    color_boton: "#39a900",
    color_texto_boton: "#ffffff"
  },
  {
    name: "Sinmegas (Menta)",
    color_fondo: "#A2D9CE",
    color_texto: "#0F3D93",
    color_boton: "#E91E63",
    color_texto_boton: "#ffffff"
  },
  {
    name: "FarmaTuya Clásico (Azul)",
    color_fondo: "#0F3D93",
    color_texto: "#ffffff",
    color_boton: "#6EA83B",
    color_texto_boton: "#ffffff"
  },
  {
    name: "NOW Suplementos (Naranja)",
    color_fondo: "#F39C12",
    color_texto: "#ffffff",
    color_boton: "#0F3D93",
    color_texto_boton: "#ffffff"
  }
]

export default function BannersAdmin() {
  const [banners, setBanners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<any>(null)
  
  // Viewport simulator state: 'pc' | 'laptop' | 'tablet' | 'mobile'
  const [viewport, setViewport] = useState<'pc' | 'laptop' | 'tablet' | 'mobile'>('laptop')
  
  // Form values state
  const [titulo, setTitulo] = useState('')
  const [subtitulo, setSubtitulo] = useState('')
  const [textoDestacado, setTextoDestacado] = useState('')
  const [nombreProducto, setNombreProducto] = useState('')
  const [imagenProductoUrl, setImagenProductoUrl] = useState('')
  const [imagenDecorativaUrl, setImagenDecorativaUrl] = useState('')
  const [colorFondo, setColorFondo] = useState('#0F3D93')
  const [colorTexto, setColorTexto] = useState('#ffffff')
  const [textoBoton, setTextoBoton] = useState('Ver Precios')
  const [colorBoton, setColorBoton] = useState('#6EA83B')
  const [colorTextoBoton, setColorTextoBoton] = useState('#ffffff')
  const [textoWhatsapp, setTextoWhatsapp] = useState('')
  const [activo, setActivo] = useState(true)
  const [orderIndex, setOrderIndex] = useState(0)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('banners_promocionales')
        .select('*')
        .eq('empresa', 'farmatuya')
        .order('order_index', { ascending: true })
      if (error) throw error
      setBanners(data || [])
    } catch (err) {
      console.error('Error fetching banners:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCreate = () => {
    setEditingBanner(null)
    setTitulo('Ponle fin a la congestión')
    setSubtitulo('Furoato de Mometasona 50mcg')
    setTextoDestacado('Recupera el aire y la claridad')
    setNombreProducto('Cortynase')
    setImagenProductoUrl('/products/cortynase.png')
    setImagenDecorativaUrl('/decorations/mist.png')
    setColorFondo('#620075')
    setColorTexto('#ffffff')
    setTextoBoton('Ver Precios')
    setColorBoton('#39a900')
    setColorTextoBoton('#ffffff')
    setTextoWhatsapp('Hola, me interesa comprar Cortynase. Quisiera saber los precios.')
    setActivo(true)
    setOrderIndex(banners.length)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (banner: any) => {
    setEditingBanner(banner)
    setTitulo(banner.titulo || '')
    setSubtitulo(banner.subtitulo || '')
    setTextoDestacado(banner.texto_destacado || '')
    setNombreProducto(banner.nombre_producto || '')
    setImagenProductoUrl(banner.imagen_producto_url || '')
    setImagenDecorativaUrl(banner.imagen_decorativa_url || '')
    setColorFondo(banner.color_fondo || '#0F3D93')
    setColorTexto(banner.color_texto || '#ffffff')
    setTextoBoton(banner.texto_boton || 'Ver Precios')
    setColorBoton(banner.color_boton || '#6EA83B')
    setColorTextoBoton(banner.color_texto_boton || '#ffffff')
    setTextoWhatsapp(banner.texto_whatsapp || '')
    setActivo(banner.activo !== false)
    setOrderIndex(banner.order_index || 0)
    setIsFormOpen(true)
  }

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setColorFondo(preset.color_fondo)
    setColorTexto(preset.color_texto)
    setColorBoton(preset.color_boton)
    setColorTextoBoton(preset.color_texto_boton)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const bannerPayload = {
      empresa: 'farmatuya',
      titulo,
      subtitulo,
      texto_destacado: textoDestacado,
      nombre_producto: nombreProducto,
      imagen_producto_url: imagenProductoUrl,
      imagen_decorativa_url: imagenDecorativaUrl || null,
      color_fondo: colorFondo,
      color_texto: colorTexto,
      texto_boton: textoBoton,
      color_boton: colorBoton,
      color_texto_boton: colorTextoBoton,
      texto_whatsapp: textoWhatsapp,
      activo,
      order_index: orderIndex
    }

    try {
      if (editingBanner) {
        const { error } = await supabase
          .from('banners_promocionales')
          .update(bannerPayload)
          .eq('id', editingBanner.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('banners_promocionales')
          .insert([bannerPayload])
        if (error) throw error
      }
      setIsFormOpen(false)
      fetchBanners()
    } catch (err) {
      console.error('Error saving banner:', err)
      alert('Error al guardar el banner.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este banner?')) return
    try {
      const { error } = await supabase
        .from('banners_promocionales')
        .delete()
        .eq('id', id)
      if (error) throw error
      fetchBanners()
    } catch (err) {
      console.error('Error deleting banner:', err)
    }
  }

  const handleToggleActivo = async (banner: any) => {
    try {
      const { error } = await supabase
        .from('banners_promocionales')
        .update({ activo: !banner.activo })
        .eq('id', banner.id)
      if (error) throw error
      fetchBanners()
    } catch (err) {
      console.error('Error toggling banner status:', err)
    }
  }

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === banners.length - 1) return

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const currentBanner = banners[index]
    const targetBanner = banners[targetIndex]

    try {
      // Swap order indices
      const { error: err1 } = await supabase
        .from('banners_promocionales')
        .update({ order_index: targetBanner.order_index })
        .eq('id', currentBanner.id)
      
      const { error: err2 } = await supabase
        .from('banners_promocionales')
        .update({ order_index: currentBanner.order_index })
        .eq('id', targetBanner.id)

      if (err1 || err2) throw err1 || err2
      fetchBanners()
    } catch (err) {
      console.error('Error reordering banners:', err)
    }
  }

  // Get current width for viewport preview
  const getViewportWidth = () => {
    if (viewport === 'pc') return 'w-[1200px]'
    if (viewport === 'laptop') return 'w-[1024px]'
    if (viewport === 'tablet') return 'w-[768px]'
    return 'w-[360px]'
  }

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">Banners Promocionales Anchos</h1>
          <p className="text-sm text-slate-500 font-medium">Gestiona y personaliza las promociones con redirección directa a WhatsApp.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-hover text-white font-bold py-3 px-6 rounded-full shadow-md transition-all hover:-translate-y-0.5"
        >
          <Plus className="h-5 w-5" />
          Nuevo Banner
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative animate-fade-in">
          
          {/* Edit Form */}
          <form onSubmit={handleSave} className="lg:col-span-6 space-y-5">
            <h3 className="text-lg font-black text-slate-800 border-b pb-3 mb-2 flex items-center gap-2">
              <Palette className="h-5 w-5 text-brand-blue" />
              {editingBanner ? 'Editar Banner Promocional' : 'Agregar Nuevo Banner'}
            </h3>

            {/* Quick Palettes */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Paletas de Colores Rápidas</span>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset, idx) => (
                  <button 
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="text-xs font-extrabold bg-white border hover:border-brand-green px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: preset.color_fondo }} />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Título (Tag de Cabecera)</label>
                <input 
                  type="text" 
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-green/20 focus:bg-white rounded-xl p-3 text-sm outline-none font-medium transition-colors"
                  placeholder="ej. Ponle fin a la congestión"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Nombre del Producto</label>
                <input 
                  type="text" 
                  value={nombreProducto}
                  onChange={(e) => setNombreProducto(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-green/20 focus:bg-white rounded-xl p-3 text-sm outline-none font-medium transition-colors"
                  placeholder="ej. Cortynase"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Texto Destacado (Principal)</label>
              <textarea 
                value={textoDestacado}
                onChange={(e) => setTextoDestacado(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-green/20 focus:bg-white rounded-xl p-3 text-sm outline-none font-medium transition-colors h-20 resize-none"
                placeholder="ej. Recupera el aire y la claridad con el efecto prolongado de Cortynase"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Subtítulo (Especificación Médica)</label>
              <input 
                type="text" 
                value={subtitulo}
                onChange={(e) => setSubtitulo(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-green/20 focus:bg-white rounded-xl p-3 text-sm outline-none font-medium transition-colors"
                placeholder="ej. Furoato de Mometasona 50mcg/dosis"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Ruta Imagen Caja Producto (PNG)</label>
                <input 
                  type="text" 
                  value={imagenProductoUrl}
                  onChange={(e) => setImagenProductoUrl(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-green/20 focus:bg-white rounded-xl p-3 text-sm outline-none font-medium transition-colors"
                  placeholder="ej. /products/cortynase.png"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Ruta Imagen Decorativa (PNG)</label>
                <input 
                  type="text" 
                  value={imagenDecorativaUrl}
                  onChange={(e) => setImagenDecorativaUrl(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-green/20 focus:bg-white rounded-xl p-3 text-sm outline-none font-medium transition-colors"
                  placeholder="ej. /decorations/mist.png"
                />
              </div>
            </div>

            {/* Custom Color Pickers */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fondo</label>
                <div className="flex items-center gap-1.5">
                  <input type="color" value={colorFondo} onChange={(e) => setColorFondo(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-none" />
                  <span className="text-xs font-bold text-slate-500 uppercase">{colorFondo}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Texto</label>
                <div className="flex items-center gap-1.5">
                  <input type="color" value={colorTexto} onChange={(e) => setColorTexto(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-none" />
                  <span className="text-xs font-bold text-slate-500 uppercase">{colorTexto}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Botón</label>
                <div className="flex items-center gap-1.5">
                  <input type="color" value={colorBoton} onChange={(e) => setColorBoton(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-none" />
                  <span className="text-xs font-bold text-slate-500 uppercase">{colorBoton}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Text. Botón</label>
                <div className="flex items-center gap-1.5">
                  <input type="color" value={colorTextoBoton} onChange={(e) => setColorTextoBoton(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-none" />
                  <span className="text-xs font-bold text-slate-500 uppercase">{colorTextoBoton}</span>
                </div>
              </div>

              <div className="space-y-1 col-span-2 sm:col-span-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Texto Botón</label>
                <input 
                  type="text" 
                  value={textoBoton}
                  onChange={(e) => setTextoBoton(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-1.5 text-xs outline-none font-bold"
                  placeholder="Ver Precios"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Mensaje Personalizado de WhatsApp</label>
              <input 
                type="text" 
                value={textoWhatsapp}
                onChange={(e) => setTextoWhatsapp(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-green/20 focus:bg-white rounded-xl p-3 text-sm outline-none font-medium transition-colors"
                placeholder="ej. Hola, me interesa comprar Cortynase 0.05% y quisiera..."
                required
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                  className="w-5.5 h-5.5 text-brand-green border-slate-350 focus:ring-brand-green rounded-lg cursor-pointer"
                />
                Activo / Mostrar en Web
              </label>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span>Orden:</span>
                <input 
                  type="number" 
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)}
                  className="w-16 bg-slate-50 border rounded-lg p-1.5 text-center font-bold"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <button 
                type="submit" 
                className="flex-grow bg-brand-blue hover:bg-brand-blue-mid text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all active:scale-98"
              >
                Guardar Cambios
              </button>
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 px-6 rounded-xl transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>

          {/* VIEWPORT SIMULATOR */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-lg font-black text-slate-800 border-b pb-3 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-brand-green" />
                Previsualización Responsiva
              </span>
              <span className="text-xs bg-slate-100 text-slate-500 font-extrabold uppercase px-2.5 py-1 rounded-full">
                Vista Previa
              </span>
            </h3>

            {/* Viewport Selectors */}
            <div className="flex gap-1.5 bg-slate-100 p-1.5 rounded-2xl w-fit">
              <button 
                type="button"
                onClick={() => setViewport('pc')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewport === 'pc' ? 'bg-white text-brand-blue shadow-md' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Monitor className="h-4 w-4" />
                Desktop
              </button>
              <button 
                type="button"
                onClick={() => setViewport('laptop')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewport === 'laptop' ? 'bg-white text-brand-blue shadow-md' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LaptopIcon className="h-4 w-4" />
                Laptop
              </button>
              <button 
                type="button"
                onClick={() => setViewport('tablet')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewport === 'tablet' ? 'bg-white text-brand-blue shadow-md' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <TabletIcon className="h-4 w-4" />
                Tablet
              </button>
              <button 
                type="button"
                onClick={() => setViewport('mobile')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewport === 'mobile' ? 'bg-white text-brand-blue shadow-md' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Smartphone className="h-4 w-4" />
                Móvil
              </button>
            </div>

            {/* Simulated Frame */}
            <div className="w-full bg-[#0A1128]/5 border border-slate-200 rounded-3xl p-6 flex flex-col justify-center items-center overflow-x-auto min-h-[440px]">
              
              {/* Device Frame Window */}
              <div 
                className={`bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-500 ${getViewportWidth()} origin-center`}
              >
                {/* Browser bar */}
                <div className="bg-slate-100 px-4 py-2 flex items-center gap-1.5 border-b border-slate-200">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="flex-grow flex justify-center">
                    <span className="text-[10px] bg-slate-200/50 text-slate-500 font-semibold px-6 py-0.5 rounded-md">farmatuya.com/oferta</span>
                  </div>
                </div>

                {/* Banner Content Renders exactly like homepage */}
                <div 
                  className="relative overflow-hidden flex items-center transition-colors min-h-[220px]"
                  style={{ backgroundColor: colorFondo, color: colorTexto }}
                >
                  {/* Corporate Tech Grid Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:1rem_1rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-30" />

                  {/* Glowing radial ambient lights for depth */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute right-4 bottom-[-10%] w-36 h-36 bg-black/20 rounded-full blur-2xl pointer-events-none" />

                  <div className="w-full h-full flex items-center px-4 py-6 sm:px-10 z-20">
                    
                    {/* Grid wrapper responsive */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 w-full relative">
                      
                      {/* Left: Product box image inside Showcase Card */}
                      <div className="col-span-12 sm:col-span-3 flex items-center justify-center relative select-none">
                        <div className="absolute w-28 h-28 rounded-full bg-white/5 blur-md border border-white/5 pointer-events-none -z-10 animate-pulse" />
                        
                        <div 
                          className="relative w-24 h-36 bg-white/95 rounded-2xl p-2.5 flex flex-col justify-between items-center shadow-lg border border-white/20 overflow-hidden"
                        >
                          {/* Image container */}
                          <div className="w-full h-24 flex items-center justify-center relative">
                            {imagenProductoUrl ? (
                              <img 
                                src={imagenProductoUrl} 
                                alt={nombreProducto || 'Producto'} 
                                className="object-contain max-h-[85px] max-w-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
                                onError={(e) => {
                                  // Fallback image helper
                                  (e.target as HTMLImageElement).src = '/catalog_personal.png'
                                }}
                              />
                            ) : (
                              <ShoppingBag className="w-8 h-8 text-brand-green/30" />
                            )}
                          </div>
                          
                          {/* Bottom label */}
                          <div className="w-full text-center border-t border-slate-100 pt-1 flex flex-col items-center">
                            <span className="text-[8px] font-black text-brand-blue uppercase tracking-wider leading-none truncate max-w-full">
                              {nombreProducto || 'FarmaTuya'}
                            </span>
                            <span className="text-[6px] font-bold text-brand-green uppercase tracking-wider mt-0.5 leading-none">
                              Garantizado
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Center: Contents */}
                      <div className="col-span-12 sm:col-span-6 flex flex-col justify-center text-left space-y-2">
                        {titulo && (
                          <div className="inline-block bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full w-fit max-w-full">
                            <span 
                              className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider block truncate text-white"
                            >
                              ✨ {titulo}
                            </span>
                          </div>
                        )}
                        
                        {textoDestacado && (
                          <h3 
                            className="text-xs sm:text-sm md:text-base font-black leading-tight tracking-tight max-w-md drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
                            style={{ color: colorTexto }}
                          >
                            {textoDestacado}
                          </h3>
                        )}
                        
                        {subtitulo && (
                          <p 
                            className="text-[9px] sm:text-xs font-semibold opacity-90 bg-black/10 px-2 py-0.5 rounded border border-white/5 w-fit text-white/90"
                          >
                            🧬 {subtitulo}
                          </p>
                        )}
                        
                        <div className="pt-1">
                          <button 
                            type="button"
                            className="inline-flex items-center justify-center px-5 py-2 text-[9px] sm:text-[10px] font-black rounded-full shadow-md pointer-events-none"
                            style={{ 
                              backgroundColor: colorBoton, 
                              color: colorTextoBoton
                            }}
                          >
                            {textoBoton}
                            <MessageCircle className="w-3.5 h-3.5 ml-1.5" fill="currentColor" stroke="none" />
                          </button>
                        </div>
                      </div>

                      {/* Right: Decorative PNG */}
                      <div className="hidden sm:flex sm:col-span-3 items-center justify-center relative select-none">
                        {nombreProducto && (
                          <span 
                            className="absolute inset-0 flex items-center justify-center text-5xl font-black uppercase tracking-widest opacity-[0.04] select-none text-center transform scale-110 rotate-[-10deg]"
                            style={{ color: '#ffffff' }}
                          >
                            {nombreProducto}
                          </span>
                        )}
                        
                        {imagenDecorativaUrl && (
                          <div className="relative w-20 h-20 flex items-center justify-center z-10 text-white/15">
                            <img 
                              src={imagenDecorativaUrl} 
                              alt="Decoración" 
                              className="object-contain max-h-full max-w-full drop-shadow-[0_5px_10px_rgba(0,0,0,0.15)]"
                              onError={(e) => {
                                // Hide the broken image and let the sparkles icon show
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            {/* Visual fallback icon instead of basic card */}
                            <Sparkles className="w-12 h-12 opacity-30 stroke-[1.25] absolute inset-0 m-auto pointer-events-none" />
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      )}

      {/* List / Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-black text-slate-800">Listado de Banners</h3>
          <span className="text-xs bg-slate-200 text-slate-600 font-extrabold uppercase px-3 py-1 rounded-full">
            {banners.length} Registrados
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 font-bold">Cargando banners...</div>
        ) : banners.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-bold">No hay banners promocionales creados para FarmaTuya. ¡Crea uno nuevo!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-black text-slate-400 uppercase bg-slate-50/50">
                  <th className="p-4">Orden</th>
                  <th className="p-4">Producto</th>
                  <th className="p-4">Título / Mensaje</th>
                  <th className="p-4">Fondo</th>
                  <th className="p-4">Botón</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-600">
                {banners.map((banner, index) => (
                  <tr key={banner.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-brand-blue">{banner.order_index}</span>
                        <div className="flex flex-col gap-0.5">
                          <button 
                            onClick={() => handleMove(index, 'up')}
                            className="p-0.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                            disabled={index === 0}
                            title="Subir"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleMove(index, 'down')}
                            className="p-0.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                            disabled={index === banners.length - 1}
                            title="Bajar"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 p-1 flex items-center justify-center border relative overflow-hidden flex-shrink-0">
                          {banner.imagen_producto_url ? (
                            <img src={banner.imagen_producto_url} alt="" className="object-contain max-h-full max-w-full" onError={(e) => { (e.target as HTMLImageElement).src = '/catalog_personal.png' }} />
                          ) : (
                            <ShoppingBag className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block">{banner.nombre_producto || 'Sin Nombre'}</span>
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase">PNG Caja</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 max-w-[240px] truncate">
                      <div>
                        <span className="font-bold text-slate-800 block truncate">{banner.titulo}</span>
                        <span className="text-xs text-slate-400 truncate block">{banner.texto_destacado}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: banner.color_fondo }} />
                        <span className="text-xs font-mono font-bold text-slate-500 uppercase">{banner.color_fondo}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span 
                        className="px-2.5 py-1 rounded-full text-xs font-black shadow-sm"
                        style={{ backgroundColor: banner.color_boton, color: banner.color_texto_boton }}
                      >
                        {banner.texto_boton}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActivo(banner)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold cursor-pointer border transition-colors ${
                          banner.activo !== false
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                        }`}
                      >
                        {banner.activo !== false ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Activo
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5" />
                            Inactivo
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(banner)}
                          className="p-2 hover:bg-brand-blue/10 rounded-xl text-brand-blue hover:text-brand-blue-mid transition-all cursor-pointer border border-transparent hover:border-brand-blue/20"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(banner.id)}
                          className="p-2 hover:bg-red-50 rounded-xl text-red-500 hover:text-red-650 transition-all cursor-pointer border border-transparent hover:border-red-100"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
