'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, ShoppingBag, Users, LogOut, Package, Menu, X, Video, Layers, MapPin } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        setLoading(false)
      }
    }
    checkUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  return (
    <div className="flex min-h-screen bg-muted/30 flex-col md:flex-row">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 bg-[#0F172A] text-white p-6 flex flex-col justify-between transform transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isSidebarCollapsed ? 'w-20' : 'w-64'}
        md:relative md:translate-x-0 md:flex
      `}>
        <div>
          <div className={`flex ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} items-center mb-8`}>
            {!isSidebarCollapsed && (
              <div className="mb-2">
                <div className="bg-white p-2 rounded-xl inline-block shadow-sm">
                  <div className="h-8 w-24 relative flex items-center justify-center">
                    <Image
                      src="/logo_farmatuya.png"
                      alt="FarmaTuya Logo"
                      fill
                      sizes="96px"
                      className="object-contain"
                    />
                  </div>
                </div>
                <span className="text-xs text-brand-green block font-medium mt-1">Panel Admin</span>
              </div>
            )}
            <div className="flex gap-2">
              {/* Botón colapsar para desktop */}
              <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden md:block text-white/60 hover:text-white transition-colors"
                title={isSidebarCollapsed ? "Expandir" : "Colapsar"}
              >
                <Menu className="h-6 w-6" />
              </button>
              {/* Botón cerrar para móvil */}
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden text-white/60 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <nav className="space-y-1">
            <Link href="/admin" 
                  className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-lg transition-all duration-200 ${
                    pathname === '/admin' ? 'bg-primary/20 text-white font-medium border-l-4 border-primary' : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`} 
                  onClick={() => setIsSidebarOpen(false)}>
              <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Dashboard</span>}
            </Link>
            <Link href="/admin/products" 
                  className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-lg transition-all duration-200 ${
                    pathname === '/admin/products' ? 'bg-primary/20 text-white font-medium border-l-4 border-primary' : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`} 
                  onClick={() => setIsSidebarOpen(false)}>
              <ShoppingBag className="h-5 w-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Productos</span>}
            </Link>
            <Link href="/admin/catalogs" 
                  className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-lg transition-all duration-200 ${
                    pathname === '/admin/catalogs' ? 'bg-primary/20 text-white font-medium border-l-4 border-primary' : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`} 
                  onClick={() => setIsSidebarOpen(false)}>
              <Package className="h-5 w-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Catálogos</span>}
            </Link>
            <Link href="/admin/users" 
                  className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-lg transition-all duration-200 ${
                    pathname === '/admin/users' ? 'bg-primary/20 text-white font-medium border-l-4 border-primary' : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`} 
                  onClick={() => setIsSidebarOpen(false)}>
              <Users className="h-5 w-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Usuarios</span>}
            </Link>
            <Link href="/admin/videos" 
                  className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-lg transition-all duration-200 ${
                    pathname === '/admin/videos' ? 'bg-primary/20 text-white font-medium border-l-4 border-primary' : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`} 
                  onClick={() => setIsSidebarOpen(false)}>
              <Video className="h-5 w-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Videos Promocionales</span>}
            </Link>
            <Link href="/admin/banners" 
                  className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-lg transition-all duration-200 ${
                    pathname === '/admin/banners' ? 'bg-primary/20 text-white font-medium border-l-4 border-primary' : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`} 
                  onClick={() => setIsSidebarOpen(false)}>
              <Layers className="h-5 w-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Banners Promocionales</span>}
            </Link>
            <Link href="/admin/tiendas" 
                  className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-lg transition-all duration-200 ${
                    pathname === '/admin/tiendas' ? 'bg-primary/20 text-white font-medium border-l-4 border-primary' : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`} 
                  onClick={() => setIsSidebarOpen(false)}>
              <MapPin className="h-5 w-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Sedes / Tiendas</span>}
            </Link>
          </nav>
        </div>

        <div>
          {/* Espacio reservado si se desea agregar algo al fondo del sidebar en el futuro */}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-h-screen">
        {/* Unified Top Bar */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100 shadow-sm sticky top-0 z-30">
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="mr-3 p-2 text-foreground hover:bg-muted rounded-lg -ml-2"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <div className="h-10 w-24 relative flex items-center justify-center">
                <Image
                  src="/logo_farmatuya.png"
                  alt="FarmaTuya Logo"
                  fill
                  sizes="96px"
                  className="object-contain"
                />
              </div>
              <span className="text-[10px] text-foreground/60 block">Panel Admin</span>
            </div>
          </div>
          
          <div className="hidden md:block">
            {/* Espacio vacío en desktop para alinear a la derecha */}
          </div>
          
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-foreground/60 font-medium">{user?.email}</span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium px-4 py-2 rounded-full hover:bg-red-50 transition-colors border border-red-100 shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow p-4 md:p-8 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
