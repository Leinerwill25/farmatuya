'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  ChevronDown, Phone, Menu, X, MapPin,
  Search, Loader2, Package, ArrowRight, Pill
} from 'lucide-react'

interface SearchResult {
  id: string
  nombre: string
  descripcion?: string
  principio_activo?: string
  presentacion?: string
  imagen_url?: string
  stock: number
  catalogo_id?: string
  catalogos?: { nombre: string }
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMoleculesOpen, setIsMoleculesOpen] = useState(false)
  const [catalogs, setCatalogs] = useState<any[]>([])

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  const searchContainerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const mobileSearchRef = useRef<HTMLInputElement>(null)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  // Fetch catalogs
  useEffect(() => {
    const fetchCatalogs = async () => {
      const { data, error } = await supabase
        .from('catalogos')
        .select('*')
        .eq('empresa', 'farmatuya')
        .eq('activo', true)
      if (!error) setCatalogs(data || [])
    }
    fetchCatalogs()
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value)
    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    if (value.trim().length < 2) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    debounceTimer.current = setTimeout(async () => {
      setIsSearching(true)
      try {
        const { data, error } = await supabase
          .from('productos')
          .select('id, nombre, descripcion, principio_activo, presentacion, imagen_url, stock, catalogo_id, catalogos(nombre)')
          .eq('empresa', 'farmatuya')
          .eq('activo', true)
          .or(`nombre.ilike.%${value.trim()}%,principio_activo.ilike.%${value.trim()}%,descripcion.ilike.%${value.trim()}%`)
          .order('stock', { ascending: false })
          .limit(6)

        if (!error && data) {
          const results: SearchResult[] = data.map((item: any) => ({
            ...item,
            catalogos: Array.isArray(item.catalogos) ? item.catalogos[0] : item.catalogos
          }))
          setSearchResults(results)
          setShowDropdown(true)
        }
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setIsSearching(false)
      }
    }, 320)
  }, [])

  const handleSelectResult = (result: SearchResult) => {
    setShowDropdown(false)
    setSearchQuery('')
    setSearchResults([])
    setIsMobileSearchOpen(false)
    router.push(`/products/${result.id}`)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim().length < 2) return
    setShowDropdown(false)
    router.push(`/?buscar=${encodeURIComponent(searchQuery.trim())}#productos`)
  }

  const getLinkHref = (hash: string) => {
    return pathname === '/' ? hash : `/${hash}`
  }

  const openMobileSearch = () => {
    setIsMobileSearchOpen(true)
    setIsMenuOpen(false)
    setTimeout(() => mobileSearchRef.current?.focus(), 100)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md text-brand-dark shadow-sm border-b border-gray-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-18 gap-3 py-3">

          {/* ── Logo ── */}
          <Link href="/" className="flex-shrink-0 flex items-center justify-center h-11 w-32 relative">
            <Image
              src="/IMG_2070.PNG"
              alt="FarmaTuya Logo"
              fill
              sizes="128px"
              className="object-contain mix-blend-multiply"
              priority
            />
          </Link>

          {/* ── Tiendas pill (desktop) ── */}
          <Link
            href="/tiendas"
            className="hidden sm:flex items-center gap-1 text-brand-dark/60 hover:text-brand-green transition-colors text-xs font-semibold flex-shrink-0"
            title="Ver Tiendas"
          >
            <MapPin className="h-4 w-4 text-brand-green" />
            <span>Tiendas</span>
          </Link>

          {/* ── Search Bar (desktop) ── */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 mx-4 relative">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative flex items-center">
                {/* Search Icon */}
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 text-brand-green animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 text-slate-400" />
                  )}
                </div>

                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                  placeholder="Buscar medicamentos, principios activos..."
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-full outline-none focus:bg-white focus:border-brand-green/50 focus:ring-2 focus:ring-brand-green/10 transition-all placeholder:text-slate-400 text-brand-dark"
                  autoComplete="off"
                />

                {/* Clear button */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setSearchResults([]); setShowDropdown(false); searchInputRef.current?.focus() }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </form>

            {/* ── Search Dropdown ── */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fade-in">
                {searchResults.length === 0 && !isSearching ? (
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                    <Pill className="h-8 w-8 text-slate-200 mb-2" />
                    <p className="text-sm font-semibold text-slate-500">Sin resultados para &quot;{searchQuery}&quot;</p>
                    <p className="text-xs text-slate-400 mt-1">Intenta con el nombre genérico o principio activo</p>
                  </div>
                ) : (
                  <>
                    <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {isSearching ? 'Buscando...' : `${searchResults.length} resultado${searchResults.length !== 1 ? 's' : ''}`}
                      </span>
                    </div>
                    <ul className="divide-y divide-slate-50">
                      {searchResults.map((result) => (
                        <li key={result.id}>
                          <button
                            onClick={() => handleSelectResult(result)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-brand-green/5 transition-colors text-left group"
                          >
                            {/* Product image */}
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                              {result.imagen_url ? (
                                <img
                                  src={result.imagen_url}
                                  alt={result.nombre}
                                  className="w-full h-full object-contain p-1"
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                                />
                              ) : (
                                <Package className="h-5 w-5 text-slate-300" />
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-brand-dark truncate group-hover:text-brand-green transition-colors">
                                {result.nombre}
                              </p>
                              {result.principio_activo && (
                                <p className="text-xs text-slate-400 truncate">
                                  {result.principio_activo}
                                  {result.presentacion && <span className="ml-1 text-slate-300">· {result.presentacion}</span>}
                                </p>
                              )}
                              {!result.principio_activo && result.descripcion && (
                                <p className="text-xs text-slate-400 truncate">{result.descripcion}</p>
                              )}
                            </div>

                            {/* Stock badge + arrow */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide ${
                                result.stock > 0
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : 'bg-red-50 text-red-500'
                              }`}>
                                {result.stock > 0 ? 'Disponible' : 'Agotado'}
                              </span>
                              <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-brand-green group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>

                    {/* Footer CTA */}
                    <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100">
                      <button
                        onClick={handleSearchSubmit as any}
                        className="w-full text-xs font-bold text-brand-green hover:text-brand-green/80 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Search className="h-3 w-3" />
                        Ver todos los resultados de &quot;{searchQuery}&quot;
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ── Desktop Nav Links ── */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium flex-shrink-0">
            <Link href="/" className={`hover:text-brand-green transition-colors ${pathname === '/' ? 'text-brand-green font-semibold' : 'text-brand-dark/70'}`}>
              Inicio
            </Link>
            <Link
              href="/nosotros"
              className={`hover:text-brand-green transition-colors ${pathname === '/nosotros' ? 'text-brand-green font-semibold' : 'text-brand-dark/70'}`}
            >
              Nosotros
            </Link>

            {/* Productos Dropdown */}
            <div className="relative group">
              <Link
                href="/catalogs"
                className={`flex items-center gap-1 hover:text-brand-green transition-colors py-2 ${pathname.startsWith('/catalogs') ? 'text-brand-green font-semibold' : 'text-brand-dark/70'}`}
              >
                Productos <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </Link>
              <div className="absolute top-full left-0 mt-0 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-left -translate-y-2 group-hover:translate-y-0">
                <div className="p-2 flex flex-col max-h-[60vh] overflow-y-auto">
                  {catalogs.length === 0 ? (
                    <span className="px-4 py-3 text-sm text-gray-400 flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
                    </span>
                  ) : (
                    catalogs.map(catalog => (
                      <Link
                        key={catalog.id}
                        href={`/catalogs/${catalog.id}`}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-brand-dark hover:bg-brand-green/8 hover:text-brand-green rounded-xl transition-colors"
                      >
                        <span className="text-base">{catalog.emoji || '💊'}</span>
                        <span className="truncate">{catalog.nombre}</span>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Venezuela Flag */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-full" title="Venezuela">
              <img src="/Flag_of_Venezuela.svg.png" alt="Venezuela" className="h-3.5 w-5 object-cover rounded-sm shadow-sm" />
              <span className="text-[11px] font-bold text-slate-500">VE</span>
            </div>
          </nav>

          {/* ── Desktop Right: WhatsApp + Mobile Search Icon ── */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Mobile search icon */}
            <button
              onClick={openMobileSearch}
              className="md:hidden p-2 rounded-full text-brand-dark/70 hover:text-brand-green hover:bg-brand-green/8 transition-colors"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* WhatsApp button */}
            <a
              href="https://wa.me/584125040440"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center px-4 py-2.5 text-sm font-semibold rounded-full text-white bg-brand-green hover:bg-brand-green/90 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 transform"
            >
              <Phone className="h-4 w-4 mr-2" />
              WhatsApp
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-full text-brand-dark hover:text-brand-green hover:bg-slate-100 focus:outline-none transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Full-Screen Search ── */}
      {isMobileSearchOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-[60] flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100">
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                {isSearching
                  ? <Loader2 className="h-4 w-4 text-brand-green animate-spin" />
                  : <Search className="h-4 w-4 text-slate-400" />
                }
              </div>
              <input
                ref={mobileSearchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar medicamentos..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-full outline-none focus:border-brand-green/50 focus:ring-2 focus:ring-brand-green/10 transition-all"
                autoComplete="off"
                autoFocus
              />
            </form>
            <button
              onClick={() => { setIsMobileSearchOpen(false); setSearchQuery(''); setSearchResults([]) }}
              className="flex-shrink-0 text-sm font-semibold text-brand-dark/60 hover:text-brand-green transition-colors"
            >
              Cancelar
            </button>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto">
            {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <Pill className="h-12 w-12 text-slate-200 mb-3" />
                <p className="text-base font-bold text-slate-500">Sin resultados</p>
                <p className="text-sm text-slate-400 mt-1">Intenta con el nombre genérico o principio activo</p>
              </div>
            )}

            {searchQuery.length < 2 && (
              <div className="px-4 pt-6">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Nuestras Líneas</p>
                <div className="flex flex-wrap gap-2">
                  {catalogs.map(cat => (
                    <Link
                      key={cat.id}
                      href={`/catalogs/${cat.id}`}
                      onClick={() => setIsMobileSearchOpen(false)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:border-brand-green/40 hover:text-brand-green transition-colors"
                    >
                      <span>{cat.emoji || '💊'}</span>
                      <span>{cat.nombre}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {searchResults.length > 0 && (
              <ul className="divide-y divide-slate-50 pt-2">
                {searchResults.map(result => (
                  <li key={result.id}>
                    <button
                      onClick={() => handleSelectResult(result)}
                      className="w-full flex items-center gap-4 px-4 py-4 hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                        {result.imagen_url ? (
                          <img
                            src={result.imagen_url}
                            alt={result.nombre}
                            className="w-full h-full object-contain p-1.5"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                        ) : (
                          <Package className="h-6 w-6 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-brand-dark truncate">{result.nombre}</p>
                        {result.principio_activo && (
                          <p className="text-xs text-slate-400 truncate mt-0.5">{result.principio_activo}</p>
                        )}
                        <span className={`inline-block mt-1 text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                          result.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                        }`}>
                          {result.stock > 0 ? 'Disponible' : 'Agotado'}
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300 flex-shrink-0" />
                    </button>
                  </li>
                ))}

                {/* Footer CTA */}
                <li className="px-4 py-4 bg-slate-50">
                  <button
                    onClick={handleSearchSubmit as any}
                    className="w-full text-sm font-bold text-brand-green flex items-center justify-center gap-2"
                  >
                    <Search className="h-4 w-4" />
                    Ver todos los resultados
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      )}

      {/* ── Mobile Menu ── */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 max-h-[80vh] overflow-y-auto shadow-lg">
          <div className="px-3 pt-3 pb-4 space-y-1">
            {/* Mobile search shortcut */}
            <button
              onClick={openMobileSearch}
              className="w-full flex items-center gap-3 px-3 py-3 mb-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 hover:border-brand-green/40 transition-colors"
            >
              <Search className="h-4 w-4 text-slate-400" />
              <span>Buscar medicamentos...</span>
            </button>

            <Link
              href="/"
              className={`block px-3 py-2.5 text-sm font-medium hover:bg-slate-50 rounded-xl transition-colors ${pathname === '/' ? 'text-brand-green font-semibold' : 'text-brand-dark/70 hover:text-brand-green'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/nosotros"
              className={`block px-3 py-2.5 text-sm font-medium hover:bg-slate-50 rounded-xl transition-colors ${pathname === '/nosotros' ? 'text-brand-green font-semibold' : 'text-brand-dark/70 hover:text-brand-green'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Nosotros
            </Link>

            {/* Productos Dropdown Mobile */}
            <div>
              <button
                onClick={() => setIsMoleculesOpen(!isMoleculesOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-brand-dark/70 hover:text-brand-green hover:bg-slate-50 rounded-xl transition-colors"
              >
                Productos <ChevronDown className={`h-4 w-4 transition-transform ${isMoleculesOpen ? 'rotate-180' : ''}`} />
              </button>
              {isMoleculesOpen && (
                <div className="pl-4 pr-2 py-2 mt-1 space-y-0.5 bg-slate-50 rounded-xl mx-1">
                  <Link
                    href="/catalogs"
                    className="block py-2 px-3 text-sm font-semibold text-brand-green"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Ver todos los catálogos →
                  </Link>
                  {catalogs.map(catalog => (
                    <Link
                      key={catalog.id}
                      href={`/catalogs/${catalog.id}`}
                      className="flex items-center gap-2 py-2 px-3 text-sm text-brand-dark/70 hover:text-brand-green rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>{catalog.emoji || '💊'}</span>
                      <span>{catalog.nombre}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Venezuela indicator mobile */}
            <div className="flex items-center gap-2 px-3 py-2">
              <img src="/Flag_of_Venezuela.svg.png" alt="Venezuela" className="h-4 w-6 object-cover rounded shadow-sm" />
              <span className="text-xs font-bold text-slate-400">Venezuela</span>
            </div>
            <Link
              href={getLinkHref('#blog')}
              className="block px-3 py-2.5 text-sm font-medium text-brand-dark/70 hover:text-brand-green hover:bg-slate-50 rounded-xl transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>

            <a
              href="https://wa.me/584125040440"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-3 mt-2 text-sm font-bold text-white bg-brand-green rounded-xl text-center transition-colors hover:bg-brand-green/90"
              onClick={() => setIsMenuOpen(false)}
            >
              <Phone className="h-4 w-4" />
              WhatsApp Ventas
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
