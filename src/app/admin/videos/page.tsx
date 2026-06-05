'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  ArrowUpDown, 
  ExternalLink,
  FileVideo,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Tag,
  Upload,
  Image as ImageIcon,
  Edit
} from 'lucide-react'

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
)

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

interface VideoPromo {
  id: string
  titulo: string
  url: string
  tipo: 'youtube' | 'drive' | 'instagram'
  activo: boolean
  order_index: number
  created_at?: string
}

interface DescuentoVisual {
  id: string
  titulo: string
  porcentaje: number
  imagen_url: string
  catalogo_id: string | null
  activo: boolean
  order_index: number
  created_at?: string
}

export default function AdminPromocionesPage() {
  const [activeTab, setActiveTab] = useState<'videos' | 'discounts'>('videos')
  
  // Catalogs State
  const [catalogs, setCatalogs] = useState<any[]>([])

  // Video State
  const [videos, setVideos] = useState<VideoPromo[]>([])
  const [loadingVideos, setLoadingVideos] = useState(true)
  const [dbVideoError, setDbVideoError] = useState(false)
  const [submittingVideo, setSubmittingVideo] = useState(false)
  const [isUsingVideoMock, setIsUsingVideoMock] = useState(false)

  // Video Form State
  const [videoTitulo, setVideoTitulo] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [videoOrderIndex, setVideoOrderIndex] = useState(1)
  const [videoActivo, setVideoActivo] = useState(true)

  // Discount State
  const [discounts, setDiscounts] = useState<DescuentoVisual[]>([])
  const [loadingDiscounts, setLoadingDiscounts] = useState(true)
  const [dbDiscountError, setDbDiscountError] = useState(false)
  const [submittingDiscount, setSubmittingDiscount] = useState(false)
  const [isUsingDiscountMock, setIsUsingDiscountMock] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState<DescuentoVisual | null>(null)

  // Discount Form State
  const [discountTitulo, setDiscountTitulo] = useState('')
  const [discountPorcentaje, setDiscountPorcentaje] = useState(30)
  const [discountCatalogoId, setDiscountCatalogoId] = useState('')
  const [discountOrderIndex, setDiscountOrderIndex] = useState(1)
  const [discountActivo, setDiscountActivo] = useState(true)
  const [discountFile, setDiscountFile] = useState<File | null>(null)

  // Mock fallbacks
  const mockVideos: VideoPromo[] = [
    {
      id: 'mock-1',
      titulo: 'Promoción Salud Pediátrica',
      url: 'https://www.youtube.com/shorts/pUuM9e_dI0s',
      tipo: 'youtube',
      activo: true,
      order_index: 1
    },
    {
      id: 'mock-2',
      titulo: 'Nueva Línea Dermatológica',
      url: 'https://www.instagram.com/reel/C7Xy2fOg_Xm/',
      tipo: 'instagram',
      activo: true,
      order_index: 2
    }
  ]

  const mockDiscounts: DescuentoVisual[] = [
    {
      id: 'mock-d1',
      titulo: 'Hasta 30% Dcto. en Cuidado Bucal',
      porcentaje: 30,
      imagen_url: 'https://images.unsplash.com/photo-1593009805482-a5d2a9844577?auto=format&fit=crop&q=80&w=400',
      catalogo_id: null,
      activo: true,
      order_index: 1
    },
    {
      id: 'mock-d2',
      titulo: '20% Dcto. en Helados',
      porcentaje: 20,
      imagen_url: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&q=80&w=400',
      catalogo_id: null,
      activo: true,
      order_index: 2
    }
  ]

  useEffect(() => {
    fetchCatalogs()
    fetchVideos()
    fetchDiscounts()
  }, [])

  // General Fetch Catalogs
  const fetchCatalogs = async () => {
    try {
      const { data } = await supabase.from('catalogos').select('id, nombre').eq('empresa', 'farmatuya')
      setCatalogs(data || [])
    } catch (err) {
      console.error("Error fetching catalogs:", err)
    }
  }

  // --- VIDEO CONTROLLERS ---
  const detectVideoType = (videoUrl: string): 'youtube' | 'drive' | 'instagram' => {
    const cleanUrl = videoUrl.toLowerCase()
    if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
      return 'youtube'
    }
    if (cleanUrl.includes('instagram.com')) {
      return 'instagram'
    }
    return 'drive'
  }

  const fetchVideos = async () => {
    try {
      setLoadingVideos(true)
      setDbVideoError(false)
      const { data, error } = await supabase
        .from('videos_promocionales')
        .select('*')
        .eq('empresa', 'farmatuya')
        .order('order_index', { ascending: true })
      if (error) throw error
      setVideos(data || [])
      setIsUsingVideoMock(false)
    } catch (err: any) {
      console.error("Error fetching videos:", err)
      if (err.code === '42P01' || err.message?.includes('does not exist')) {
        setDbVideoError(true)
        setIsUsingVideoMock(true)
        setVideos(mockVideos)
      }
    } finally {
      setLoadingVideos(false)
    }
  }

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoTitulo || !videoUrl) return

    const tipo = detectVideoType(videoUrl)
    const newVideo = {
      titulo: videoTitulo,
      url: videoUrl,
      tipo,
      activo: videoActivo,
      order_index: Number(videoOrderIndex)
    }

    try {
      setSubmittingVideo(true)
      if (isUsingVideoMock) {
        const mockItem: VideoPromo = {
          id: `mock-${Date.now()}`,
          ...newVideo
        }
        setVideos(prev => [...prev, mockItem].sort((a, b) => a.order_index - b.order_index))
        resetVideoForm()
      } else {
        const { error } = await supabase.from('videos_promocionales').insert([{ ...newVideo, empresa: 'farmatuya' }])
        if (error) throw error
        await fetchVideos()
        resetVideoForm()
      }
    } catch (err) {
      console.error("Error saving video:", err)
      alert("No se pudo guardar el video.")
    } finally {
      setSubmittingVideo(false)
    }
  }

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este video promocional?')) return
    try {
      if (isUsingVideoMock) {
        setVideos(prev => prev.filter(v => v.id !== id))
      } else {
        const { error } = await supabase.from('videos_promocionales').delete().eq('id', id)
        if (error) throw error
        await fetchVideos()
      }
    } catch (err) {
      console.error("Error deleting video:", err)
      alert("No se pudo eliminar el video.")
    }
  }

  const handleToggleVideoStatus = async (id: string, currentStatus: boolean) => {
    try {
      if (isUsingVideoMock) {
        setVideos(prev => prev.map(v => v.id === id ? { ...v, activo: !currentStatus } : v))
      } else {
        const { error } = await supabase
          .from('videos_promocionales')
          .update({ activo: !currentStatus })
          .eq('id', id)
        if (error) throw error
        await fetchVideos()
      }
    } catch (err) {
      console.error("Error updating video status:", err)
      alert("No se pudo actualizar el estado del video.")
    }
  }

  const resetVideoForm = () => {
    setVideoTitulo('')
    setVideoUrl('')
    setVideoOrderIndex(videos.length + 1)
    setVideoActivo(true)
  }

  const getEmbedUrl = (video: VideoPromo) => {
    const videoUrl = video.url
    if (video.tipo === 'youtube') {
      let id = ''
      if (videoUrl.includes('shorts/')) {
        id = videoUrl.split('shorts/')[1]?.split('?')[0] || ''
      } else if (videoUrl.includes('watch?v=')) {
        id = videoUrl.split('watch?v=')[1]?.split('&')[0] || ''
      } else if (videoUrl.includes('youtu.be/')) {
        id = videoUrl.split('youtu.be/')[1]?.split('?')[0] || ''
      }
      return id ? `https://www.youtube.com/embed/${id}` : videoUrl
    }
    if (video.tipo === 'instagram') {
      const cleanUrl = videoUrl.split('?')[0]
      const suffix = cleanUrl.endsWith('/') ? 'embed/' : '/embed/'
      return `${cleanUrl}${suffix}`
    }
    if (video.tipo === 'drive') {
      const parts = videoUrl.split('/d/')
      if (parts.length > 1) {
        const fileId = parts[1].split('/')[0]
        return `https://drive.google.com/file/d/${fileId}/preview`
      }
    }
    return videoUrl
  }

  const getVideoIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return <YoutubeIcon className="h-5 w-5 text-red-500" />
      case 'instagram':
        return <InstagramIcon className="h-5 w-5 text-pink-500" />
      default:
        return <FileVideo className="h-5 w-5 text-blue-500" />
    }
  }

  // --- DISCOUNT CONTROLLERS ---
  const fetchDiscounts = async () => {
    try {
      setLoadingDiscounts(true)
      setDbDiscountError(false)
      const { data, error } = await supabase
        .from('descuentos_visuales')
        .select('*')
        .eq('empresa', 'farmatuya')
        .order('order_index', { ascending: true })
      if (error) throw error
      setDiscounts(data || [])
      setIsUsingDiscountMock(false)
    } catch (err: any) {
      console.error("Error fetching visual discounts:", err)
      if (err.code === '42P01' || err.message?.includes('does not exist')) {
        setDbDiscountError(true)
        setIsUsingDiscountMock(true)
        setDiscounts(mockDiscounts)
      }
    } finally {
      setLoadingDiscounts(false)
    }
  }

  const handleSaveDiscount = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!discountTitulo || (!discountFile && !editingDiscount && isUsingDiscountMock === false)) {
      alert("Por favor introduce un título y selecciona una imagen.")
      return
    }

    try {
      setSubmittingDiscount(true)
      let imagen_url = editingDiscount 
        ? editingDiscount.imagen_url 
        : "https://images.unsplash.com/photo-1593009805482-a5d2a9844577?auto=format&fit=crop&q=80&w=400"

      if (discountFile) {
        const fileExt = discountFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, discountFile)

        if (uploadError) {
          throw uploadError
        }

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)

        imagen_url = publicUrlData.publicUrl
      }

      const discountData = {
        titulo: discountTitulo,
        porcentaje: Number(discountPorcentaje),
        imagen_url,
        catalogo_id: discountCatalogoId || null,
        activo: discountActivo,
        order_index: Number(discountOrderIndex)
      }

      if (isUsingDiscountMock) {
        if (editingDiscount) {
          setDiscounts(prev => prev.map(d => d.id === editingDiscount.id ? { ...d, ...discountData } : d).sort((a, b) => a.order_index - b.order_index))
        } else {
          const mockItem: DescuentoVisual = {
            id: `mock-d-${Date.now()}`,
            ...discountData
          }
          setDiscounts(prev => [...prev, mockItem].sort((a, b) => a.order_index - b.order_index))
        }
        resetDiscountForm()
      } else {
        if (editingDiscount) {
          const { error } = await supabase
            .from('descuentos_visuales')
            .update(discountData)
            .eq('id', editingDiscount.id)
          if (error) throw error
        } else {
          const { error } = await supabase.from('descuentos_visuales').insert([{ ...discountData, empresa: 'farmatuya' }])
          if (error) throw error
        }
        await fetchDiscounts()
        resetDiscountForm()
      }
    } catch (err: any) {
      console.error("Error saving visual discount:", err)
      alert("No se pudo guardar la tarjeta de descuento: " + err.message)
    } finally {
      setSubmittingDiscount(false)
    }
  }

  const handleEditDiscount = (discount: DescuentoVisual) => {
    setEditingDiscount(discount)
    setDiscountTitulo(discount.titulo)
    setDiscountPorcentaje(discount.porcentaje)
    setDiscountCatalogoId(discount.catalogo_id || '')
    setDiscountOrderIndex(discount.order_index)
    setDiscountActivo(discount.activo)
    setDiscountFile(null)
    
    // Scroll smoothly to form container
    document.getElementById('discount-form-container')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleDeleteDiscount = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este descuento visual?')) return
    try {
      if (isUsingDiscountMock) {
        setDiscounts(prev => prev.filter(d => d.id !== id))
      } else {
        const { error } = await supabase.from('descuentos_visuales').delete().eq('id', id)
        if (error) throw error
        await fetchDiscounts()
      }
      if (editingDiscount?.id === id) {
        resetDiscountForm()
      }
    } catch (err) {
      console.error("Error deleting visual discount:", err)
      alert("No se pudo eliminar el descuento.")
    }
  }

  const handleToggleDiscountStatus = async (id: string, currentStatus: boolean) => {
    try {
      if (isUsingDiscountMock) {
        setDiscounts(prev => prev.map(d => d.id === id ? { ...d, activo: !currentStatus } : d))
      } else {
        const { error } = await supabase
          .from('descuentos_visuales')
          .update({ activo: !currentStatus })
          .eq('id', id)
        if (error) throw error
        await fetchDiscounts()
      }
    } catch (err) {
      console.error("Error updating visual discount status:", err)
      alert("No se pudo actualizar el estado del descuento.")
    }
  }

  const resetDiscountForm = () => {
    setDiscountTitulo('')
    setDiscountPorcentaje(30)
    setDiscountCatalogoId('')
    setDiscountOrderIndex(discounts.length + 1)
    setDiscountActivo(true)
    setDiscountFile(null)
    setEditingDiscount(null)
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Title / Premium Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-brand-blue-mid to-brand-blue p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-brand-orange">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wider">Módulo Promocional</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Nuestras Promociones</h1>
          <p className="text-white/70 max-w-xl">
            Administra los videos interactivos y las tarjetas visuales de descuentos asociados a tus líneas terapéuticas.
          </p>
        </div>
        <button 
          onClick={activeTab === 'videos' ? fetchVideos : fetchDiscounts}
          className="relative z-10 self-start md:self-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all flex items-center gap-2 text-sm font-medium"
        >
          <RefreshCw className={`h-4 w-4 ${(activeTab === 'videos' ? loadingVideos : loadingDiscounts) ? 'animate-spin' : ''}`} />
          Recargar
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setActiveTab('videos')}
          className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all relative ${
            activeTab === 'videos' 
              ? 'text-brand-orange border-b-2 border-brand-orange' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileVideo className="h-4.5 w-4.5" />
          Videos Promocionales
        </button>
        <button
          onClick={() => setActiveTab('discounts')}
          className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all relative ${
            activeTab === 'discounts' 
              ? 'text-brand-orange border-b-2 border-brand-orange' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Tag className="h-4.5 w-4.5" />
          Descuentos Visuales
        </button>
      </div>

      {/* SQL Migration Alert for Active Tab */}
      {((activeTab === 'videos' && dbVideoError) || (activeTab === 'discounts' && dbDiscountError)) && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-3 items-start">
            <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-semibold text-amber-800">Base de datos desactualizada</h3>
              <p className="text-sm text-amber-700/90 leading-relaxed max-w-2xl">
                La tabla correspondiente no existe en la base de datos de Supabase.
                {activeTab === 'videos' ? (
                  <span> Por favor, ejecuta el script <code className="bg-amber-500/15 px-1.5 py-0.5 rounded font-mono text-xs">create_videos_promocionales.sql</code> en el editor SQL.</span>
                ) : (
                  <span> Por favor, ejecuta el script <code className="bg-amber-500/15 px-1.5 py-0.5 rounded font-mono text-xs">create_descuentos_visuales.sql</code> en el editor SQL.</span>
                )}
              </p>
            </div>
          </div>
          <span className="bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap self-end md:self-center">
            Modo Local / Simulación
          </span>
        </div>
      )}

      {/* TAB 1: VIDEOS */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Container */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 h-fit">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Plus className="h-5 w-5 text-brand-orange" />
              Nuevo Video Promocional
            </h2>
            
            <form onSubmit={handleAddVideo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título del Video</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Descuentos en Pediatría"
                  value={videoTitulo}
                  onChange={(e) => setVideoTitulo(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enlace del Video</label>
                <input
                  type="url"
                  required
                  placeholder="YouTube Shorts, Instagram Reel o Drive Link"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all text-sm"
                />
                <span className="text-[11px] text-gray-400 mt-1 block leading-normal">
                  Soporta Youtube (Shorts/Videos), Instagram Reels, y archivos compartidos de Google Drive.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                  <input
                    type="number"
                    min="0"
                    value={videoOrderIndex}
                    onChange={(e) => setVideoOrderIndex(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all text-sm"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 px-2 py-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={videoActivo}
                      onChange={(e) => setVideoActivo(e.target.checked)}
                      className="w-4.5 h-4.5 text-brand-blue border-gray-300 rounded focus:ring-brand-blue"
                    />
                    <span className="text-sm font-medium text-gray-700">Activo</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingVideo}
                className="w-full py-3 bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {submittingVideo ? 'Guardando...' : 'Agregar Video'}
              </button>
            </form>
          </div>

          {/* List Container */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5 text-brand-orange" />
                Videos Activos ({videos.length})
              </h2>
              {isUsingVideoMock && (
                <span className="text-xs text-gray-400 font-medium italic">Simulación Local</span>
              )}
            </div>

            {loadingVideos ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-orange mb-3"></div>
                <span className="text-sm text-gray-500 font-medium">Cargando...</span>
              </div>
            ) : videos.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center max-w-lg mx-auto">
                <FileVideo className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No hay videos promocionales</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Usa el formulario para subir el primer video.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((video) => (
                  <div 
                    key={video.id} 
                    className={`bg-white rounded-3xl border transition-all overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md ${
                      video.activo ? 'border-gray-100' : 'border-dashed border-gray-300 opacity-70'
                    }`}
                  >
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                      <div className="flex items-center gap-2 min-w-0">
                        {getVideoIcon(video.tipo)}
                        <span className="font-bold text-sm text-gray-800 truncate" title={video.titulo}>
                          {video.titulo}
                        </span>
                      </div>
                      <span className="bg-white border border-gray-200 text-[10px] px-2 py-0.5 rounded-full font-mono text-gray-500">
                        Orden: {video.order_index}
                      </span>
                    </div>

                    <div className="p-4 flex justify-center bg-gray-950">
                      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border-4 border-gray-800 shadow-2xl bg-black">
                        <iframe 
                          src={getEmbedUrl(video)}
                          className="absolute inset-0 w-full h-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        ></iframe>
                      </div>
                    </div>

                    <div className="p-4 border-t border-gray-50 flex items-center justify-between bg-white">
                      <button
                        onClick={() => handleToggleVideoStatus(video.id, video.activo)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          video.activo 
                            ? 'bg-green-500/10 text-green-700 hover:bg-green-500/20' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {video.activo ? (
                          <>
                            <Eye className="h-4 w-4" />
                            <span>Visible</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-4 w-4" />
                            <span>Oculto</span>
                          </>
                        )}
                      </button>

                      <div className="flex gap-2">
                        <a 
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteVideo(video.id)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DISCOUNTS */}
      {activeTab === 'discounts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Container */}
          <div id="discount-form-container" className="lg:col-span-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 h-fit">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {editingDiscount ? (
                <Edit className="h-5 w-5 text-brand-blue" />
              ) : (
                <Plus className="h-5 w-5 text-brand-orange" />
              )}
              {editingDiscount ? 'Editar Descuento' : 'Nuevo Descuento Visual'}
            </h2>
            
            <form onSubmit={handleSaveDiscount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título de la Tarjeta</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Hasta 30% Dcto. en Cuidado Bucal"
                  value={discountTitulo}
                  onChange={(e) => setDiscountTitulo(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all text-sm"
                >
                </input>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dcto (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={discountPorcentaje}
                    onChange={(e) => setDiscountPorcentaje(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                  <input
                    type="number"
                    min="0"
                    value={discountOrderIndex}
                    onChange={(e) => setDiscountOrderIndex(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Línea/Catálogo Asociado</label>
                <select
                  value={discountCatalogoId}
                  onChange={(e) => setDiscountCatalogoId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all text-sm text-gray-700"
                >
                  <option value="">Ninguno (Sin Enlace)</option>
                  {catalogs.map((catalog) => (
                    <option key={catalog.id} value={catalog.id}>
                      {catalog.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen del Descuento</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-2xl hover:border-brand-orange/40 transition-colors cursor-pointer bg-gray-50"
                     onClick={() => document.getElementById('discount-file-input')?.click()}>
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-10 w-10 text-gray-400" />
                    <div className="flex text-xs text-gray-600 justify-center">
                      <span className="relative cursor-pointer rounded-md font-bold text-brand-orange hover:text-brand-orange/80">
                        {editingDiscount ? 'Cambiar imagen' : 'Subir un archivo'}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">PNG, JPG de productos</p>
                    {discountFile ? (
                      <p className="text-xs text-green-600 font-semibold mt-2 truncate max-w-[200px]">
                        {discountFile.name}
                      </p>
                    ) : editingDiscount ? (
                      <p className="text-[10px] text-brand-blue font-semibold mt-2 truncate max-w-[200px]">
                        Usando imagen actual
                      </p>
                    ) : null}
                  </div>
                  <input
                    id="discount-file-input"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => setDiscountFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="discount-activo"
                  checked={discountActivo}
                  onChange={(e) => setDiscountActivo(e.target.checked)}
                  className="w-4.5 h-4.5 text-brand-blue border-gray-300 rounded focus:ring-brand-blue"
                />
                <label htmlFor="discount-activo" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                  Activo / Visible en Web
                </label>
              </div>

              <div className="flex gap-3">
                {editingDiscount && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDiscount(null)
                      resetDiscountForm()
                    }}
                    className="w-1/3 py-3 bg-gray-150 hover:bg-gray-250 text-gray-700 font-semibold rounded-xl transition-all text-sm cursor-pointer"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submittingDiscount}
                  className={`py-3 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer ${
                    editingDiscount ? 'w-2/3 bg-brand-blue hover:bg-brand-blue/90' : 'w-full bg-brand-orange hover:bg-brand-orange/90'
                  }`}
                >
                  {submittingDiscount ? 'Guardando...' : editingDiscount ? 'Guardar Cambios' : 'Crear Descuento'}
                </button>
              </div>
            </form>
          </div>

          {/* List Container */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5 text-brand-orange" />
                Descuentos Registrados ({discounts.length})
              </h2>
              {isUsingDiscountMock && (
                <span className="text-xs text-gray-400 font-medium italic">Simulación Local</span>
              )}
            </div>

            {loadingDiscounts ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-orange mb-3"></div>
                <span className="text-sm text-gray-500 font-medium">Cargando...</span>
              </div>
            ) : discounts.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center max-w-lg mx-auto">
                <Tag className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No hay descuentos visuales</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Usa el formulario para registrar el primer banner de descuento.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {discounts.map((discount) => {
                  const linkedCatalog = catalogs.find(c => c.id === discount.catalogo_id)
                  return (
                    <div 
                      key={discount.id} 
                      className={`bg-white rounded-3xl border transition-all overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md ${
                        discount.activo ? 'border-gray-100' : 'border-dashed border-gray-300 opacity-70'
                      }`}
                    >
                      {/* Top status */}
                      <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-2 min-w-0">
                          <Tag className="h-4.5 w-4.5 text-brand-orange" />
                          <span className="font-bold text-sm text-gray-800 truncate" title={discount.titulo}>
                            {discount.titulo}
                          </span>
                        </div>
                        <span className="bg-white border border-gray-200 text-[10px] px-2 py-0.5 rounded-full font-mono text-gray-500">
                          Orden: {discount.order_index}
                        </span>
                      </div>

                      {/* Content Preview */}
                      <div className="p-4 flex gap-4 items-center">
                        <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                          <img 
                            src={discount.imagen_url} 
                            alt={discount.titulo} 
                            className="h-full w-full object-cover" 
                          />
                          <div className="absolute top-1 left-1 bg-yellow-400 text-brand-dark text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                            {discount.porcentaje}%
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="font-bold text-sm text-gray-800 line-clamp-1">{discount.titulo}</div>
                          <div className="text-xs text-gray-500">
                            Porcentaje: <span className="font-bold text-gray-800">{discount.porcentaje}% Dcto.</span>
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            Enlace: <span className="font-semibold text-brand-blue">{linkedCatalog ? linkedCatalog.nombre : 'Sin redirección'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer actions */}
                      <div className="p-4 border-t border-gray-50 flex items-center justify-between bg-white">
                        <button
                          onClick={() => handleToggleDiscountStatus(discount.id, discount.activo)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            discount.activo 
                              ? 'bg-green-500/10 text-green-700 hover:bg-green-500/20' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {discount.activo ? (
                            <>
                              <Eye className="h-4 w-4" />
                              <span>Visible</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-4 w-4" />
                              <span>Oculto</span>
                            </>
                          )}
                        </button>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditDiscount(discount)}
                            className="p-2 bg-blue-50 hover:bg-blue-100 text-brand-blue rounded-xl transition-colors cursor-pointer"
                            title="Editar Descuento"
                          >
                            <Edit className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteDiscount(discount.id)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors cursor-pointer"
                            title="Eliminar Descuento"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
