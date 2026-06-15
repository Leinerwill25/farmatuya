'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Search, Package2, X } from 'lucide-react'
import Navbar from '@/components/Navbar'

interface Catalogo {
  id: string
  nombre: string
  descripcion?: string
  imagen_url?: string
  emoji?: string
  destacado?: boolean
}

export default function CatalogsPage() {
  const [catalogs, setCatalogs] = useState<Catalogo[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('catalogos')
        .select('*')
        .eq('empresa', 'farmatuya')
        .eq('activo', true)
        .order('nombre', { ascending: true })
      setCatalogs(data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  const filtered = catalogs.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (c.descripcion || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 pt-16">

        {/* Header */}
        <div className="bg-white border-b border-slate-100 px-4 py-10 md:py-14">
          <div className="max-w-7xl mx-auto">
            <span className="text-xs font-black text-brand-green uppercase tracking-widest">Nuestros Productos</span>
            <h1 className="text-3xl md:text-4xl font-black text-brand-dark mt-2 tracking-tight">
              Líneas y Catálogos
            </h1>
            <p className="text-slate-500 mt-2 text-sm md:text-base font-medium max-w-xl">
              Explora todas nuestras líneas terapéuticas. Haz clic en una categoría para ver los productos disponibles.
            </p>

            {/* Search */}
            <div className="mt-6 relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar categoría..."
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white text-sm outline-none focus:border-brand-green/50 focus:ring-2 focus:ring-brand-green/10 transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 py-10">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 animate-pulse h-40" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Package2 className="h-14 w-14 text-slate-200 mb-4" />
              <p className="font-bold text-slate-500 text-lg">No se encontraron catálogos</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map(catalog => (
                <Link
                  key={catalog.id}
                  href={`/catalogs/${catalog.id}`}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-brand-green/30 transition-all overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-36 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
                    {catalog.imagen_url ? (
                      <Image
                        src={catalog.imagen_url}
                        alt={catalog.nombre}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl">{catalog.emoji || '💊'}</span>
                      </div>
                    )}
                    {catalog.destacado && (
                      <span className="absolute top-2 right-2 bg-brand-green text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                        Destacado
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{catalog.emoji || '💊'}</span>
                      <h3 className="font-black text-brand-dark text-sm leading-tight group-hover:text-brand-green transition-colors">
                        {catalog.nombre}
                      </h3>
                    </div>
                    {catalog.descripcion && (
                      <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 flex-1">{catalog.descripcion}</p>
                    )}
                    <span className="mt-3 text-[11px] font-bold text-brand-green flex items-center gap-1">
                      Ver productos →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
