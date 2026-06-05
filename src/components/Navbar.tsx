'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ChevronDown, Phone, Menu, X, MapPin } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMoleculesOpen, setIsMoleculesOpen] = useState(false)
  const [catalogs, setCatalogs] = useState<any[]>([])

  useEffect(() => {
    const fetchCatalogs = async () => {
      const { data, error } = await supabase.from('catalogos').select('*').eq('empresa', 'farmatuya')
      if (error) {
        console.error('Error fetching catalogs:', error)
      } else {
        setCatalogs(data || [])
      }
    }
    fetchCatalogs()
  }, [])

  const getLinkHref = (hash: string) => {
    if (pathname === '/') {
      return hash
    }
    return `/${hash}`
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md text-brand-dark shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Tienda/Ubicación */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link href="/" className="flex-shrink-0 flex items-center justify-center h-12 w-32 relative">
              <Image 
                src="/logo_farmatuya.png" 
                alt="FarmaTuya Logo"
                fill
                sizes="128px"
                className="object-contain mix-blend-multiply"
                priority
              />
            </Link>
            
            {/* Ubicación / Tiendas */}
            <Link 
              href={getLinkHref('#tiendas')} 
              className="flex items-center gap-1 text-brand-dark/70 hover:text-brand-green transition-colors text-xs font-semibold"
              title="Ver Tiendas"
            >
              <MapPin className="h-4.5 w-4.5 text-brand-green" />
              <span className="hidden sm:inline">Tiendas</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8 text-sm font-medium items-center">
            <Link href={getLinkHref('#inicio')} className="text-brand-dark/70 hover:text-brand-green transition-colors">
              Inicio
            </Link>
            <Link href="/nosotros" className={`text-brand-dark/70 hover:text-brand-green transition-colors ${pathname === '/nosotros' ? 'text-brand-green font-semibold' : ''}`}>
              Nosotros
            </Link>
            
            {/* Productos Dropdown */}
            <div className="relative group">
              <Link 
                href={getLinkHref('#catalogos')} 
                className="flex items-center gap-1 text-brand-dark/70 hover:text-brand-green transition-colors py-2 cursor-pointer"
              >
                Productos <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </Link>
              <div className="absolute top-full left-0 mt-0 w-80 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left -translate-y-2 group-hover:translate-y-0">
                <div className="p-2 flex flex-col max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {catalogs.length === 0 ? (
                    <span className="px-4 py-3 text-sm text-gray-500">Cargando...</span>
                  ) : (
                    catalogs.map(catalog => (
                      <Link 
                        key={catalog.id} 
                        href={`/catalogs/${catalog.id}`}
                        className="block px-4 py-2.5 text-sm leading-normal text-brand-dark hover:bg-brand-green/10 hover:text-brand-green rounded-lg transition-colors whitespace-nowrap"
                      >
                        {catalog.nombre}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>

            <Link href={getLinkHref('#tiendas')} className="text-brand-dark/70 hover:text-brand-green transition-colors">
              Tiendas
            </Link>
            <Link href={getLinkHref('#blog')} className="text-brand-dark/70 hover:text-brand-green transition-colors">
              Blog
            </Link>
          </nav>

          {/* Desktop Right - Contact Button */}
          <div className="hidden md:flex items-center">
            <a 
              href="https://wa.me/584125040440" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-full text-white bg-brand-green hover:bg-brand-green/95 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <Phone className="h-4 w-4 mr-2" />
              WhatsApp Ventas
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-brand-dark hover:text-brand-green focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 max-h-[80vh] overflow-y-auto">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href={getLinkHref('#inicio')} 
              className="block px-3 py-2 text-base font-medium text-brand-dark/70 hover:text-brand-green" 
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link 
              href="/nosotros" 
              className={`block px-3 py-2 text-base font-medium ${pathname === '/nosotros' ? 'text-brand-green font-semibold' : 'text-brand-dark/70 hover:text-brand-green'}`} 
              onClick={() => setIsMenuOpen(false)}
            >
              Nosotros
            </Link>
            
            {/* Productos Dropdown Mobile */}
            <div>
              <button 
                onClick={() => setIsMoleculesOpen(!isMoleculesOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-brand-dark/70 hover:text-brand-green"
              >
                Productos <ChevronDown className={`h-5 w-5 transition-transform ${isMoleculesOpen ? 'rotate-180' : ''}`} />
              </button>
              {isMoleculesOpen && (
                <div className="pl-6 pr-3 py-2 space-y-1 bg-gray-50/50 rounded-lg mx-3 mb-2">
                  <Link 
                    href={getLinkHref('#catalogos')} 
                    className="block py-2 text-sm font-medium text-brand-dark hover:text-brand-green" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Ver todos
                  </Link>
                  {catalogs.map(catalog => (
                    <Link 
                      key={catalog.id} 
                      href={`/catalogs/${catalog.id}`}
                      className="block py-2 text-sm leading-normal text-brand-dark/70 hover:text-brand-green"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {catalog.nombre}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              href={getLinkHref('#tiendas')} 
              className="block px-3 py-2 text-base font-medium text-brand-dark/70 hover:text-brand-green" 
              onClick={() => setIsMenuOpen(false)}
            >
              Tiendas
            </Link>
            <Link 
              href={getLinkHref('#blog')} 
              className="block px-3 py-2 text-base font-medium text-brand-dark/70 hover:text-brand-green" 
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <a 
              href="https://wa.me/584125040440" 
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 text-base font-medium text-white bg-brand-green rounded-md text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              WhatsApp Ventas
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
