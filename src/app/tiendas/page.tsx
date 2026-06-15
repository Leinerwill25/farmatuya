'use client'

import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { MapPin, Clock, Search, ExternalLink, Navigation, X, Phone } from 'lucide-react'
import Navbar from '@/components/Navbar'

// Dynamic import to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/TiendasMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Cargando mapa...</p>
      </div>
    </div>
  )
})

interface Tienda {
  id: string
  nombre: string
  direccion: string
  horario?: string
  ubicacion_mapa?: string
  activo: boolean
  lat?: number
  lng?: number
}

// Extract lat/lng from Google Maps URL
function parseCoords(url: string): { lat: number; lng: number } | null {
  if (!url) return null
  // Match @lat,lng or q=lat,lng or ll=lat,lng
  const patterns = [
    /@(-?\d+\.?\d*),(-?\d+\.?\d*)/,
    /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
    /[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
    /maps\/place\/[^/]*\/@(-?\d+\.?\d*),(-?\d+\.?\d*)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) }
  }
  return null
}

// Geocode using OpenStreetMap Nominatim (free, no API key)
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const query = encodeURIComponent(`${address}, Venezuela`)
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'es' } }
    )
    const data = await res.json()
    if (data && data[0]) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    }
  } catch (e) {
    console.error('Geocode error:', e)
  }
  return null
}

export default function TiendasPage() {
  const [tiendas, setTiendas] = useState<Tienda[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchTiendas()
  }, [])

  const fetchTiendas = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('tiendas')
        .select('*')
        .eq('empresa', 'farmatuya')
        .eq('activo', true)
        .order('nombre', { ascending: true })

      if (error) throw error

      // Enrich with coordinates
      const enriched = await Promise.all(
        (data || []).map(async (t: Tienda) => {
          // Try to parse from maps URL first
          if (t.ubicacion_mapa) {
            const coords = parseCoords(t.ubicacion_mapa)
            if (coords) return { ...t, ...coords }
          }
          // Fallback: geocode the address
          if (t.direccion) {
            const coords = await geocodeAddress(t.direccion)
            if (coords) return { ...t, ...coords }
          }
          return t
        })
      )
      setTiendas(enriched)
    } catch (err) {
      console.error('Error fetching tiendas:', err)
      setTiendas([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = tiendas.filter(t =>
    t.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (t.direccion || '').toLowerCase().includes(search.toLowerCase())
  )

  const tiendasConCoordenadas = tiendas.filter(t => t.lat && t.lng)

  const handleSelect = (id: string) => {
    setSelectedId(id)
    // Scroll to card
    const el = document.getElementById(`tienda-${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 pt-16 flex flex-col">

        {/* ── Hero Header ── */}
        <div className="bg-white border-b border-slate-100 px-4 py-10 md:py-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-black text-brand-dark tracking-tight">
              Encuentra tu sede <span className="text-brand-green">FarmaTuya</span>
            </h1>
            <p className="text-slate-500 mt-2 text-sm md:text-base font-medium">
              {tiendas.length > 0
                ? `${tiendas.length} sede${tiendas.length !== 1 ? 's' : ''} disponible${tiendas.length !== 1 ? 's' : ''} en Venezuela`
                : 'Atención profesional en tu zona'}
            </p>

            {/* Search bar */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar por nombre o dirección..."
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white text-sm outline-none focus:border-brand-green/50 focus:ring-2 focus:ring-brand-green/10 transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Content: List + Map ── */}
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 flex flex-col lg:flex-row gap-6">

          {/* LEFT: Store list */}
          <div className="w-full lg:w-[380px] flex-shrink-0 flex flex-col">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
              {loading ? 'Cargando...' : `${filtered.length} sede${filtered.length !== 1 ? 's' : ''} encontrada${filtered.length !== 1 ? 's' : ''}`}
            </p>

            <div
              ref={listRef}
              className="flex flex-col gap-3 overflow-y-auto pr-1 lg:max-h-[calc(100vh-260px)] custom-scrollbar"
            >
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 animate-pulse">
                    <div className="h-5 bg-slate-200 rounded w-2/3 mb-3" />
                    <div className="h-4 bg-slate-100 rounded w-full mb-2" />
                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                  </div>
                ))
              ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center">
                  <MapPin className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                  <p className="font-bold text-slate-500">No se encontraron sedes</p>
                  <p className="text-sm text-slate-400 mt-1">Intenta con otro término de búsqueda</p>
                </div>
              ) : (
                filtered.map(tienda => (
                  <div
                    id={`tienda-${tienda.id}`}
                    key={tienda.id}
                    onClick={() => handleSelect(tienda.id)}
                    className={`bg-white rounded-2xl p-5 border cursor-pointer transition-all hover:shadow-md hover:border-brand-green/30 ${
                      selectedId === tienda.id
                        ? 'border-brand-green shadow-md ring-2 ring-brand-green/20'
                        : 'border-slate-100'
                    }`}
                  >
                    <h3 className="font-black text-brand-dark text-sm uppercase tracking-wide leading-tight">
                      {tienda.nombre}
                    </h3>

                    {tienda.direccion && (
                      <div className="flex items-start gap-2 mt-2.5">
                        <MapPin className="h-3.5 w-3.5 text-brand-green flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-500 leading-relaxed">{tienda.direccion}</p>
                      </div>
                    )}

                    {tienda.horario && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                        <p className="text-xs text-slate-400">{tienda.horario}</p>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2 mt-4">
                      {tienda.ubicacion_mapa && (
                        <a
                          href={tienda.ubicacion_mapa}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 transition-colors"
                        >
                          <Navigation className="h-3.5 w-3.5" />
                          Cómo llegar
                        </a>
                      )}
                      <a
                        href="https://wa.me/584125040440"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="flex items-center gap-1.5 px-3 py-2 bg-brand-green hover:bg-brand-green/90 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        Contactar
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT: Map */}
          <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[450px] lg:min-h-0">
            {!loading && (
              <MapComponent
                tiendas={tiendasConCoordenadas}
                selectedId={selectedId}
                onSelect={handleSelect}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
