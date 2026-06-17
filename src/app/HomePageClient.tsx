'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { getLatestRate } from '@/lib/rates-client'
import Navbar from '@/components/Navbar'
import { 
  Heart, 
  Shield, 
  Clock, 
  Truck, 
  ShoppingBag, 
  Phone, 
  MapPin, 
  ArrowRight, 
  MessageCircle,
  ShieldCheck,
  ClipboardCheck,
  Building2,
  Target,
  Eye,
  Zap,
  Users,
  Star,
  Leaf,
  ChevronLeft,
  ChevronRight,
  Mail,
  Sparkles,
  Search,
  CheckCircle,
  HelpCircle,
  ArrowUpRight
} from 'lucide-react'

// Static Allies data with RIFs (retained for marquees)
const aliadosA = [
  { nombre: "Wells of Life, C.A.", rif: "J-305882201" },
  { nombre: "Dropharma D&M, C.A.", rif: "J-411589188" },
  { nombre: "Droguería DHM, C.A.", rif: "J-500351763" },
  { nombre: "Droguería Real, C.A.", rif: "J-501981528" },
  { nombre: "Droguería Mundo Médico, C.A.", rif: "J-401568909" },
  { nombre: "Insuaminca, C.A.", rif: "J-412413740" },
  { nombre: "Droguería Surdelago, C.A.", rif: "J-500690798" },
  { nombre: "Droguería Melmax2018, C.A.", rif: "J-411259918" },
  { nombre: "Droguería El Arcángel, C.A.", rif: "J-409672840" },
  { nombre: "Droguería Santo Cristo, C.A.", rif: "J-500828586" }
]

const aliadosB = [
  { nombre: "Droguería Droca, C.A.", rif: "J-500445219" },
  { nombre: "Dromedalca, C.A.", rif: "J-409796000" },
  { nombre: "Casa de Representación Nibiru Pharma, C.A.", rif: "J-500013396" },
  { nombre: "Droguería 4J, C.A.", rif: "J-505081890" },
  { nombre: "Distriroshi, C.A.", rif: "J-503775530" },
  { nombre: "Distribuidora Médica Export-Medex, C.A.", rif: "J-305895906" },
  { nombre: "Casa de Representación Laboratorios Verma, C.A.", rif: "J-500972309" }
]

// Mock retail products for fallback or secondary display
const defaultMockProducts = [
  {
    id: "vitamina-c",
    nombre: "Vitamina C 1000mg Suplemento",
    principio_activo: "Ácido Ascórbico",
    presentacion: "Frasco 100 Cápsulas",
    precio: 12.50,
    moneda: "USD",
    stock: 45,
    imagen_url: "/catalog_personal.png",
    descripcion: "Apoya el sistema inmunológico y proporciona protección antioxidante diaria.",
    descuento: 15
  },
  {
    id: "pedialyte",
    nombre: "Pedialyte Suero Hidratante",
    principio_activo: "Electrólitos Orales",
    presentacion: "Botella 500ml",
    precio: 3.80,
    moneda: "USD",
    stock: 120,
    imagen_url: "/catalog_infantil.png",
    descripcion: "Ayuda a prevenir la deshidratación al restablecer rápidamente los líquidos.",
    descuento: 10
  },
  {
    id: "ibuprofeno-400",
    nombre: "Ibuprofeno 400mg Analgésico",
    principio_activo: "Ibuprofeno",
    presentacion: "Caja 10 Tabletas",
    precio: 1.95,
    moneda: "USD",
    stock: 250,
    imagen_url: "/catalog_hipertension.png",
    descripcion: "Efectivo alivio de dolores musculares, fiebre e inflamaciones corporales.",
    descuento: 20
  }
]

// Premium bulletproof image wrapper that falls back gracefully if URL is broken or template string
const SafeImage = ({ 
  src, 
  alt, 
  className, 
  fallbackIcon: Icon, 
  isDecoration = false 
}: { 
  src?: string, 
  alt: string, 
  className?: string, 
  fallbackIcon?: any, 
  isDecoration?: boolean 
}) => {
  const [error, setError] = useState(false)
  
  const isInvalidUrl = !src || src.trim() === '' || src.includes('via.placeholder.com') || src.startsWith('[') || (src.includes('%') && !src.startsWith('http') && !src.startsWith('/'))
  
  if (isInvalidUrl || error) {
    if (isDecoration) {
      return (
        <div className="w-full h-full flex items-center justify-center text-white/10 animate-pulse">
          {Icon ? <Icon className="w-20 h-20 stroke-[1.25]" /> : <Sparkles className="w-20 h-20 stroke-[1.25]" />}
        </div>
      )
    }
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-brand-blue/8 via-brand-blue/4 to-brand-green/2 text-brand-blue/20 rounded-2xl p-4 min-h-[120px]">
        {Icon ? <Icon className="w-8 h-8 text-brand-green mb-1.5 animate-pulse" /> : <ShoppingBag className="w-8 h-8 text-brand-green mb-1.5" />}
        <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest text-center">FarmaTuya</span>
      </div>
    )
  }
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={() => setError(true)} 
    />
  )
}

function getDeterministicRating(id: string) {
  let sum = 0
  for (let i = 0; i < id.length; i++) {
    sum += id.charCodeAt(i)
  }
  return 4.0 + (sum % 11) / 10
}

export default function HomePageClient({ initialData }: { initialData: any }) {
  const [products, setProducts] = useState<any[]>(initialData.products)
  const [catalogs, setCatalogs] = useState<any[]>(initialData.catalogs)
  const [descuentos, setDescuentos] = useState<any[]>(initialData.descuentos)
  const [rates, setRates] = useState(initialData.rates)
  const [selectedCategory, setSelectedCategory] = useState<string>("todos")
  
  // Hero Carousel State
  const [heroIndex, setHeroIndex] = useState(0)
  
  // Promotional Banners State
  const [promoBanners, setPromoBanners] = useState<any[]>(initialData.promoBanners)
  const [promoIndex, setPromoIndex] = useState(0)

  // Tiendas / Sedes State
  const [tiendas, setTiendas] = useState<any[]>(initialData.tiendas)
  
  // Secondary Carousel State
  const secSliderRef = useRef<HTMLDivElement>(null)
  
  // Search state for main page search portal
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Initial fetch removed in favor of Server Components

  // Auto-play Promo Banners Carousel
  useEffect(() => {
    if (promoBanners.length <= 1) return
    const timer = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promoBanners.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [promoBanners])

  // Auto-play Hero Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounce search query
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true)
        try {
          const { data, error } = await supabase
            .from('productos')
            .select('id, nombre, principio_activo, presentacion, precio, moneda, stock, imagen_url')
            .or(`nombre.ilike.%${searchQuery}%,principio_activo.ilike.%${searchQuery}%`)
            .eq('activo', true)
            .eq('empresa', 'farmatuya')
            .limit(5)
          if (error) throw error
          setSearchResults(data || [])
        } catch (err) {
          console.error('Error searching products:', err)
          setSearchResults([])
        } finally {
          setIsSearching(false)
          setShowSearchDropdown(true)
        }
      } else {
        setSearchResults([])
        setShowSearchDropdown(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*, catalogos(nombre)')
        .eq('activo', true)
        .eq('empresa', 'farmatuya')
        .limit(9)
      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      console.error('Error fetching products:', err)
      setProducts([])
    }
  }

  const fetchCatalogs = async () => {
    try {
      const { data, error } = await supabase
        .from('catalogos')
        .select('*')
        .eq('activo', true)
        .eq('empresa', 'farmatuya')
      if (error) throw error
      setCatalogs(data || [])
    } catch (err) {
      console.error('Error fetching catalogs:', err)
      setCatalogs([])
    }
  }

  const fetchDescuentos = async () => {
    try {
      const { data, error } = await supabase
        .from('descuentos_visuales')
        .select('*')
        .eq('activo', true)
        .eq('empresa', 'farmatuya')
        .order('order_index', { ascending: true })
      if (error) throw error
      setDescuentos(data || [])
    } catch (err) {
      console.error('Error fetching discounts:', err)
      setDescuentos([])
    }
  }

  const fetchPromoBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners_promocionales')
        .select('*')
        .eq('activo', true)
        .eq('empresa', 'farmatuya')
        .order('order_index', { ascending: true })
      if (error) throw error
      setPromoBanners(data || [])
    } catch (err) {
      console.error('Error fetching promo banners:', err)
      setPromoBanners([])
    }
  }

  const fetchTiendas = async () => {
    try {
      const { data, error } = await supabase
        .from('tiendas')
        .select('*')
        .eq('activo', true)
        .eq('empresa', 'farmatuya')
        .order('nombre', { ascending: true })
      if (error) {
        // Table may not exist yet — silently skip
        setTiendas([])
        return
      }
      setTiendas(data || [])
    } catch {
      setTiendas([])
    }
  }

  const fetchRates = async () => {
    try {
      const usdRate = await getLatestRate('USD')
      const eurRate = await getLatestRate('EUR')
      setRates({
        usd: usdRate?.rate || 36.5,
        eur: eurRate?.rate || 40.0,
      })
    } catch (err) {
      console.error('Error fetching rates:', err)
    }
  }

  const calculateEquivalents = (price: number, currency: string) => {
    let bs = 0
    let usd = 0
    let eur = 0

    if (currency === 'BS') {
      bs = price
      usd = price / rates.usd
      eur = price / rates.eur
    } else if (currency === 'USD') {
      usd = price
      bs = price * rates.usd
      eur = (price * rates.usd) / rates.eur
    } else if (currency === 'EUR') {
      eur = price
      bs = price * rates.eur
      usd = (price * rates.eur) / rates.usd
    }

    return { usd, eur, bs }
  }

  const scrollSecondarySlider = (direction: 'left' | 'right') => {
    if (secSliderRef.current) {
      const { scrollLeft, clientWidth } = secSliderRef.current
      const scrollAmount = clientWidth * 0.8
      secSliderRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Hero slides config (Premium pharmaceutical brands/promotions layout)
  const heroSlides = [
    {
      title: "Tu Salud en Equilibrio Natural",
      subtitle: "Línea Especializada NOW",
      desc: "Suplementos y vitaminas de la más alta calidad para fortalecer tu vitalidad física y mental todos los días.",
      cta: "Explorar Suplementos",
      brand: "NOW VENEZUELA",
      link: "#catalogos",
      gradient: "from-[#0A1A3F] via-[#0F3D93] via-[#144CBA] to-[#6EA83B]",
      image: "/catalog_personal.png"
    },
    {
      title: "Alivio y Confianza Familiar",
      subtitle: "Medicamentos de Calidad",
      desc: "Variedad de tratamientos farmacéuticos certificados y de venta directa en los que tu familia puede confiar.",
      cta: "Ver Medicamentos",
      brand: "COFASA & LABS",
      link: "#catalogos",
      gradient: "from-[#0A1A3F] via-[#0F3D93] to-[#1D4ED8]",
      image: "/catalog_hipertension.png"
    },
    {
      title: "Cuidado Pediátrico Especial",
      subtitle: "Línea Infantil Completa",
      desc: "Fórmulas, higiene suave y suplementación pediátrica para que tus niños crezcan sanos y felices.",
      cta: "Línea Infantil",
      brand: "BIENESTAR BEBÉS",
      link: "#catalogos",
      gradient: "from-[#6EA83B] via-[#144CBA] via-[#0F3D93] to-[#0A1A3F]",
      image: "/catalog_infantil.png"
    },
    {
      title: "Protección Solar Dermatológica",
      subtitle: "Salud y Cuidado Corporal",
      desc: "Protectores SPF 50+ y cremas regeneradoras de las principales marcas para la prevención diaria de tu piel.",
      cta: "Cuidado Dérmico",
      brand: "COSMÉTICA Y SALUD",
      link: "#catalogos",
      gradient: "from-[#0F3D93] via-[#144CBA] to-[#6EA83B]",
      image: "/catalog_personal.png"
    }
  ]

  // Dynamic list of featured categories from database catalogs (fallback to static categories)
  const staticCategories = [
    { id: "medicamentos", label: "Medicamentos", emoji: "💊" },
    { id: "cuidado-personal", label: "Cuidado Personal", emoji: "🧴" },
    { id: "bebes", label: "Bebés", emoji: "👶" },
    { id: "salud-bienestar", label: "Salud y Bienestar", emoji: "🍏" },
    { id: "belleza", label: "Belleza", emoji: "💄" },
    { id: "hogar-mascota", label: "Hogar y Mascota", emoji: "🏠" }
  ]

  const categoriesList = catalogs.length > 0
    ? (catalogs.some((c: any) => c.destacado)
        ? catalogs.filter((c: any) => c.destacado).map((c: any) => ({ id: c.id, label: c.nombre, emoji: c.emoji || '✨' }))
        : catalogs.map((c: any) => ({ id: c.id, label: c.nombre, emoji: c.emoji || '✨' })).slice(0, 6))
    : staticCategories

  // Filter products by selected categories
  const getFilteredProducts = () => {
    const activeProductsList = products.length > 0 ? products : defaultMockProducts
    
    if (selectedCategory === "todos") return activeProductsList.slice(0, 6)
    
    // Check if selectedCategory matches a database catalog ID
    const isDatabaseCatalog = catalogs.some((c: any) => c.id === selectedCategory)
    if (isDatabaseCatalog) {
      return activeProductsList.filter(p => p.catalogo_id === selectedCategory).slice(0, 6)
    }

    // Fallback static filtering rules for static categories
    if (selectedCategory === "medicamentos") {
      return activeProductsList.filter(p => p.principio_activo !== "Electrólitos Orales" && p.principio_activo !== "Ácido Ascórbico" && p.principio_activo !== "Equipo de Medición").slice(0, 6)
    }
    if (selectedCategory === "salud-bienestar") {
      return activeProductsList.filter(p => p.principio_activo === "Ácido Ascórbico" || p.nombre.toLowerCase().includes("vitamina") || p.nombre.toLowerCase().includes("suplemento")).slice(0, 6)
    }
    if (selectedCategory === "bebes") {
      return activeProductsList.filter(p => p.principio_activo === "Electrólitos Orales" || p.nombre.toLowerCase().includes("pedialyte") || p.nombre.toLowerCase().includes("bebe") || p.nombre.toLowerCase().includes("infantil")).slice(0, 6)
    }
    
    // Generic fallback filter
    return activeProductsList.filter(p => p.catalogo_id === selectedCategory).slice(0, 6)
  }

  const filteredProducts = getFilteredProducts()

  return (
    <div className="flex flex-col min-h-screen bg-white text-foreground font-sans overflow-x-hidden">
      
      {/* SECCIÓN 1: HEADER STICKY (Navbar Component) */}
      <Navbar />

      <main className="flex-grow pt-16">
        
        {/* SECCIÓN 2: HERO CAROUSEL (Banner Principal) */}
        <section id="inicio" className="relative h-[600px] md:h-[650px] w-full overflow-hidden flex items-center">
          {/* Subtle Grid Overlay Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_60%,transparent_100%)] z-10 pointer-events-none" />
          
          {/* Dynamic Background Mesh Glows */}
          <div className="absolute -left-20 -top-20 w-[600px] h-[600px] bg-brand-blue/15 rounded-full blur-[140px] pointer-events-none z-10" />
          <div className="absolute -right-20 -bottom-20 w-[500px] h-[500px] bg-brand-green/15 rounded-full blur-[130px] pointer-events-none z-10" />

          <AnimatePresence mode="wait">
            <motion.div 
              key={heroIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Background gradient pattern */}
              <div className={`absolute inset-0 bg-gradient-to-r ${heroSlides[heroIndex].gradient} z-10`} />
              
              {/* Floating abstract decorative graphics */}
              <div className="absolute right-[-10%] top-[-10%] w-[50%] h-[120%] bg-white/5 blur-3xl rounded-full transform rotate-12" />
              
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
                  {/* Left Column: Text Content */}
                  <div className="lg:col-span-7 text-left space-y-6">
                    <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/95 text-xs font-black tracking-widest uppercase px-4 py-2 rounded-full shadow-md">
                      <Sparkles className="h-3.5 w-3.5 text-brand-green animate-pulse" />
                      {heroSlides[heroIndex].brand}
                    </span>
                    
                    <div className="space-y-3">
                      <h1 className="text-4xl sm:text-5xl md:text-[54px] font-black text-white leading-none tracking-tight">
                        {heroSlides[heroIndex].title}
                      </h1>
                      <span className="block text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-gradient-to-r from-brand-green via-emerald-300 to-white bg-clip-text">
                        {heroSlides[heroIndex].subtitle}
                      </span>
                    </div>

                    <p className="text-base sm:text-lg text-white/75 max-w-xl leading-relaxed font-medium">
                      {heroSlides[heroIndex].desc}
                    </p>
                    
                    <div className="pt-4 flex flex-col sm:flex-row gap-4">
                      <Link 
                        href={heroSlides[heroIndex].link}
                        className="inline-flex items-center justify-center px-8 py-4 bg-brand-green hover:bg-brand-green-hover text-white font-bold rounded-full transition-all shadow-lg shadow-brand-green/25 hover:shadow-brand-green/45 transform hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {heroSlides[heroIndex].cta}
                        <ArrowRight className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                      
                      <Link 
                        href="/tiendas"
                        className="inline-flex items-center justify-center px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-full border border-white/20 hover:border-white/40 transition-all backdrop-blur-md shadow-md transform hover:-translate-y-0.5 active:scale-[0.98]"
                      >
                        Consultar Tiendas
                      </Link>
                    </div>
                  </div>
 
                  {/* Right Column: Dynamic Visual Graphic */}
                  <div className="hidden lg:col-span-5 lg:flex justify-center items-center relative">
                    <div className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] flex items-center justify-center">
                      
                      {/* Rotating subtle halo */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-green/10 via-brand-blue/20 to-brand-blue/40 blur-2xl animate-pulse" />
                      
                      {/* Premium Glassmorphic Frame */}
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-white/5 backdrop-blur-xl border-2 border-white/25 rounded-full flex items-center justify-center shadow-2xl float-animation p-4 overflow-hidden"
                      >
                        {/* Internal border ring */}
                        <div className="absolute inset-2 rounded-full border border-white/10 pointer-events-none" />
                        
                        {heroSlides[heroIndex].image ? (
                          <img 
                            src={heroSlides[heroIndex].image} 
                            alt={heroSlides[heroIndex].title}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <ShoppingBag className="h-28 w-28 text-white/40 z-25" />
                        )}
                      </motion.div>
                      
                      {/* Floating Badge 1 - Top Right */}
                      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-brand-dark/40 backdrop-blur-md border border-white/15 px-4.5 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 transform translate-x-2 -translate-y-2 hover:scale-105 transition-transform duration-300 cursor-default select-none z-30">
                        <span className="text-base">🛡️</span>
                        <span className="text-[10px] font-extrabold text-white uppercase tracking-wider">FarmaTuya Garantía</span>
                      </div>
                      
                      {/* Floating Badge 2 - Bottom Left */}
                      <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 bg-brand-dark/40 backdrop-blur-md border border-white/15 px-4.5 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 transform -translate-x-2 translate-y-2 hover:scale-105 transition-transform duration-300 cursor-default select-none z-30">
                        <span className="text-base">⚡</span>
                        <span className="text-[10px] font-extrabold text-brand-green uppercase tracking-wider">100% Original</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setHeroIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                  idx === heroIndex 
                    ? 'bg-brand-green w-10 shadow-lg shadow-brand-green/30' 
                    : 'bg-white/30 hover:bg-white/60 w-2.5'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>


        {/* SECCIÓN 3: CHIPS DE CATEGORÍAS */}
        <section id="categorias" className="py-16 bg-white text-brand-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div className="text-left">
                <span className="text-brand-green font-bold tracking-wider uppercase text-xs block mb-2">Descubre por Línea</span>
                <h2 className="text-3xl font-black tracking-tight text-brand-dark">Categorías Destacadas</h2>
              </div>
              <Link href="#catalogos" className="text-sm font-bold text-brand-blue hover:text-brand-green transition-colors flex items-center gap-1">
                Ver todas las líneas <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Scrolling Pills */}
            <div className="flex gap-3 overflow-x-auto py-3 pb-5 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 items-center">
              <button
                onClick={() => setSelectedCategory("todos")}
                className={`flex-shrink-0 px-6 py-3 rounded-full text-xs font-black border tracking-wide uppercase transition-all duration-300 transform hover:scale-105 active:scale-97 cursor-pointer flex items-center gap-2.5 shadow-sm ${
                  selectedCategory === "todos" 
                    ? "bg-gradient-to-r from-brand-blue to-brand-blue-mid text-white border-transparent shadow-[0_8px_20px_-6px_rgba(15,61,147,0.35)]" 
                    : "bg-slate-50/70 hover:bg-brand-green/[0.04] text-slate-700 border-slate-200/80 hover:border-brand-green/30 hover:text-brand-blue"
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-inner transition-all duration-300 ${
                  selectedCategory === "todos" ? "bg-white/20 text-white" : "bg-brand-green/10 text-brand-green"
                }`}>
                  ✨
                </span>
                <span>Todas las Ofertas</span>
              </button>
              {categoriesList.map((cat) => {
                const isActive = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex-shrink-0 px-6 py-3 rounded-full text-xs font-black border tracking-wide uppercase transition-all duration-300 transform hover:scale-105 active:scale-97 cursor-pointer flex items-center gap-2.5 shadow-sm ${
                      isActive 
                        ? "bg-gradient-to-r from-brand-blue to-brand-blue-mid text-white border-transparent shadow-[0_8px_20px_-6px_rgba(15,61,147,0.35)]" 
                        : "bg-slate-50/70 hover:bg-brand-green/[0.04] text-slate-700 border-slate-200/80 hover:border-brand-green/30 hover:text-brand-blue"
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-inner transition-all duration-300 ${
                      isActive ? "bg-white/20 text-white" : "bg-brand-green/10 text-brand-green"
                    }`}>
                      {cat.emoji}
                    </span>
                    <span>{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* SECCIÓN 4: BANNER PROMOCIONAL DESTACADO (Wide Banner - Carrusel Dinámico) */}
        {promoBanners.length > 0 && (
        <section className="py-6 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden h-[340px] sm:h-80 shadow-lg group">
              {(
                /* Dynamic Banner Carousel - Redesigned to be Professional, Elegant & Corporate */
                <div className="h-full w-full relative flex items-center">
                  <AnimatePresence mode="wait">
                    {promoBanners.map((banner, idx) => {
                      if (idx !== promoIndex) return null;
                      
                      const whatsappLink = `https://wa.me/584125040440?text=${encodeURIComponent(banner.texto_whatsapp || 'Hola, me interesa este producto.')}`;
                      
                      return (
                        <motion.div 
                          key={banner.id}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0 h-full w-full flex items-center overflow-hidden"
                          style={{ 
                            background: `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%, rgba(0,0,0,0.18) 100%), ${banner.color_fondo || '#0F3D93'}`
                          }}
                        >
                          {/* Corporate Tech Grid Overlay */}
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

                          {/* Glowing radial ambient lights for depth */}
                          <div className="absolute left-10 top-1/2 -translate-y-1/2 w-[320px] h-[320px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
                          <div className="absolute right-[10%] bottom-[-20%] w-[250px] h-[250px] bg-black/25 rounded-full blur-[80px] pointer-events-none" />

                          {/* Inner container to restrict elements */}
                          <div className="relative w-full h-full flex items-center px-8 sm:px-16 md:px-24 z-20">
                            
                            {/* Grid layout */}
                            <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 w-full h-full py-4 relative">
                              
                              {/* Left Element: Premium Product Showcase Card */}
                              <div className="hidden sm:flex md:col-span-3 h-full items-center justify-center relative select-none">
                                <div className="absolute w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none -z-10 animate-pulse" />
                                
                                <motion.div 
                                  className="relative w-44 h-60 bg-white/95 rounded-3xl p-4 flex flex-col justify-between items-center shadow-2xl border border-white/20 float-animation overflow-hidden group"
                                  initial={{ scale: 0.9, y: 10 }}
                                  animate={{ scale: 1, y: 0 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  {/* Glassmorphic border ray glow */}
                                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/30 pointer-events-none" />
                                  
                                  {/* Image container */}
                                  <div className="w-full h-40 flex items-center justify-center relative">
                                    {banner.imagen_producto_url ? (
                                      <SafeImage 
                                        src={banner.imagen_producto_url} 
                                        alt={banner.nombre_producto || 'Producto'} 
                                        className="object-contain max-h-[140px] max-w-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)] transition-transform duration-500 group-hover:scale-105"
                                        fallbackIcon={ShoppingBag}
                                      />
                                    ) : (
                                      <ShoppingBag className="w-16 h-16 text-brand-green/30" />
                                    )}
                                  </div>
                                  
                                  {/* Bottom label */}
                                  <div className="w-full text-center border-t border-slate-100/80 pt-2 flex flex-col items-center">
                                    <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest leading-none">
                                      {banner.nombre_producto || 'FarmaTuya'}
                                    </span>
                                    <span className="text-[8px] font-bold text-brand-green uppercase tracking-wider mt-0.5 leading-none">
                                      Garantizado
                                    </span>
                                  </div>
                                </motion.div>
                              </div>
                              
                              {/* Center Content: Texts and button */}
                              <div className="col-span-12 sm:col-span-8 md:col-span-6 flex flex-col justify-center text-left space-y-4 pr-4">
                                {banner.titulo && (
                                  <div className="inline-block bg-white/15 backdrop-blur-md border border-white/25 px-4.5 py-1.5 rounded-full w-fit max-w-full shadow-inner select-none">
                                    <span 
                                      className="text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest block truncate text-white"
                                    >
                                      ✨ {banner.titulo}
                                    </span>
                                  </div>
                                )}
                                
                                {banner.texto_destacado && (
                                  <h3 
                                    className="text-xl sm:text-2xl md:text-[28px] font-black leading-tight tracking-tight max-w-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] font-sans"
                                    style={{ color: banner.color_texto || '#ffffff' }}
                                  >
                                    {banner.texto_destacado}
                                  </h3>
                                )}
                                
                                {banner.subtitulo && (
                                  <p 
                                    className="text-xs sm:text-sm font-semibold opacity-90 max-w-md bg-black/15 px-3.5 py-1.5 rounded-xl w-fit border border-white/10 select-none text-white/95"
                                  >
                                    🧬 {banner.subtitulo}
                                  </p>
                                )}
                                
                                <div className="pt-2">
                                  <a 
                                    href={whatsappLink}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center px-8 py-3.5 text-xs sm:text-sm font-black rounded-full transition-all shadow-lg shadow-black/15 hover:shadow-xl hover:shadow-black/25 hover:scale-105 active:scale-98 transform hover:-translate-y-0.5 hover:brightness-105"
                                    style={{ 
                                      backgroundColor: banner.color_boton || '#39a900', 
                                      color: banner.color_texto_boton || '#ffffff' 
                                    }}
                                  >
                                    {banner.texto_boton || 'Consultar Producto'}
                                    <MessageCircle className="w-4.5 h-4.5 ml-2" fill="currentColor" stroke="none" />
                                  </a>
                                </div>
                              </div>
                              
                              {/* Right Element: Display Name and Decorative graphic */}
                              <div className="hidden md:flex md:col-span-3 h-full items-center justify-center relative select-none">
                                {/* Large Product Name background watermarked */}
                                {banner.nombre_producto && (
                                  <span 
                                    className="absolute right-6 bottom-4 text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-widest select-none text-right pointer-events-none transform rotate-[-6deg] scale-110 opacity-[0.05]"
                                    style={{ color: '#ffffff' }}
                                  >
                                    {banner.nombre_producto}
                                  </span>
                                )}
                                
                                {/* Ambient light circle */}
                                <div className="absolute w-40 h-40 rounded-full bg-white/5 blur-xl pointer-events-none -z-10 animate-pulse" />
                                
                                {/* Decorative Graphic (mist, stomach, etc.) */}
                                {banner.imagen_decorativa_url && (
                                  <motion.div 
                                    className="relative w-44 h-44 flex items-center justify-center z-10"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1, duration: 0.5 }}
                                  >
                                    <SafeImage 
                                      src={banner.imagen_decorativa_url} 
                                      alt={banner.nombre_producto || 'Decoración'} 
                                      className="object-contain max-h-full max-w-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]"
                                      fallbackIcon={Sparkles}
                                      isDecoration={true}
                                    />
                                  </motion.div>
                                )}
                              </div>
                              
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  
                  {/* Left Navigation Arrow */}
                  <button 
                    onClick={() => setPromoIndex((prev) => (prev - 1 + promoBanners.length) % promoBanners.length)}
                    className="absolute left-6 z-30 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-md backdrop-blur-md cursor-pointer"
                    title="Anterior"
                  >
                    <ChevronLeft className="h-5.5 w-5.5" />
                  </button>
                  
                  {/* Right Navigation Arrow */}
                  <button 
                    onClick={() => setPromoIndex((prev) => (prev + 1) % promoBanners.length)}
                    className="absolute right-6 z-30 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-md backdrop-blur-md cursor-pointer"
                    title="Siguiente"
                  >
                    <ChevronRight className="h-5.5 w-5.5" />
                  </button>
                  
                  {/* Dots Indicator */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
                    {promoBanners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPromoIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === promoIndex 
                            ? 'bg-white w-6' 
                            : 'bg-white/40 hover:bg-white/60 w-2'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        )}

        {/* SECCIÓN 5: CAROUSEL SECUNDARIO DE OFERTAS (Cards Rediseñadas) */}
        <section id="ofertas-especiales" className="py-12 bg-[#fafafa] relative text-brand-dark overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-left mb-6 px-2">
              <h2 className="text-[#0F3D93] font-bold text-lg md:text-xl">Hola , te puede interesar..</h2>
            </div>

            {/* Slider Container with absolute navigation arrows on sides */}
            <div className="relative px-4 sm:px-8">
              
              {/* Left Navigation Arrow */}
              <button 
                onClick={() => scrollSecondarySlider('left')}
                className="absolute left-[-15px] sm:left-[-10px] top-[45%] -translate-y-1/2 z-20 text-slate-450 hover:text-slate-600 cursor-pointer flex items-center justify-center transition-colors"
                title="Anterior"
              >
                <ChevronLeft className="h-9 w-9 stroke-[1.5]" />
              </button>
              
              {/* Right Navigation Arrow */}
              <button 
                onClick={() => scrollSecondarySlider('right')}
                className="absolute right-[-15px] sm:right-[-10px] top-[45%] -translate-y-1/2 z-20 text-slate-450 hover:text-slate-600 cursor-pointer flex items-center justify-center transition-colors"
                title="Siguiente"
              >
                <ChevronRight className="h-9 w-9 stroke-[1.5]" />
              </button>

              {/* Sliding Carousel */}
              <div 
                ref={secSliderRef}
                className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 no-scrollbar"
              >
                {descuentos.length > 0 ? (
                  descuentos.map((item) => {
                    const linkedCatalog = catalogs.find((c: any) => c.id === item.catalogo_id)
                    const catalogName = linkedCatalog ? linkedCatalog.nombre : "Oferta Especial"
                    
                    // Helper to get product name and category based on the db row data
                    let productName = item.titulo
                    let categoryName = catalogName

                    if (item.titulo.toLowerCase().includes("bucal") || item.titulo.toLowerCase().includes("dental")) {
                      productName = "Kit Enjuague Bucal Oral-B & Colgate"
                      categoryName = "Cuidado Bucal"
                    } else if (item.titulo.toLowerCase().includes("analgésicos") || item.titulo.toLowerCase().includes("pediátricas")) {
                      productName = "Analgésicos Infantiles & Fórmulas Pediátricas"
                      categoryName = "Pediatría & Salud"
                    } else if (item.titulo.toLowerCase().includes("antibióticos") || item.titulo.toLowerCase().includes("cardiovascular")) {
                      productName = "Tratamiento Cardiovascular Rowe & Genfar"
                      categoryName = "Línea Médica"
                    } else if (item.titulo.toLowerCase().includes("vitaminas") || item.titulo.toLowerCase().includes("suplementos")) {
                      productName = "Complejo de Vitaminas Inmunes & Multivitamínicos"
                      categoryName = "Suplementos"
                    } else if (item.titulo.toLowerCase().includes("equipos") || item.titulo.toLowerCase().includes("tensiómetros")) {
                      productName = "Tensiómetro & Nebulizador Digital de Precisión"
                      categoryName = "Equipos Médicos"
                    }

                    return (
                      <div 
                        key={item.id} 
                        className="flex-shrink-0 w-[240px] h-[350px] bg-white rounded-3xl border border-slate-100 hover:border-brand-blue/20 shadow-[0_4px_24px_rgba(0,0,0,0.015)] hover:shadow-[0_16px_40px_rgba(15,61,147,0.065)] snap-start flex flex-col justify-between p-4 transition-all duration-300 hover:-translate-y-1.5 relative overflow-hidden group"
                      >
                        {/* Top row: Category + arrow link */}
                        <div className="flex justify-between items-center z-10">
                          {/* Category name */}
                          <span className="text-[10px] font-black text-[#0F3D93]/45 tracking-widest uppercase">
                            {categoryName}
                          </span>
                          
                          {/* Circular arrow icon */}
                          <Link 
                            href={item.catalogo_id ? `/catalogs/${item.catalogo_id}` : "#catalogos"}
                            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#0F3D93] text-[#0F3D93] hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>

                        {/* Product Name */}
                        <div className="text-left mt-1.5 z-10">
                          <h4 className="text-xs font-black text-brand-dark leading-snug line-clamp-2 min-h-[2.25rem] flex items-start">
                            {productName}
                          </h4>
                        </div>

                        {/* Center: Product Image wrapped in an elegant rounded nested card */}
                        <div className="flex-1 flex items-center justify-center bg-slate-50/50 rounded-2xl border border-slate-100/30 my-2 relative overflow-hidden h-32 w-full">
                          <SafeImage 
                            src={item.imagen_url} 
                            alt={productName} 
                            className="object-cover w-full h-full transition-transform duration-550 group-hover:scale-105 rounded-2xl" 
                            fallbackIcon={Sparkles}
                          />
                        </div>

                        {/* Bottom: Solid Yellow Banner (Centered, wraps up to 2 lines, avoids truncation) */}
                        <div className="bg-[#fcd53f] border border-[#fbd12b] py-2 px-3 rounded-xl shadow-[0_2px_6px_rgba(252,213,63,0.1)]">
                          <p className="text-[10px] font-black text-[#0f3d93] leading-tight uppercase tracking-wider line-clamp-2 min-h-[1.5rem] flex items-center justify-center">
                            {item.titulo}
                          </p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  /* Fallback Mock Secondary Slides if Supabase is empty */
                  [
                    { 
                      porcentaje: 20, 
                      titulo: "Hasta 20% Dcto. en Higiene Personal", 
                      productName: "Pack Rexona & Crema Dove Soft",
                      categoryName: "Higiene Personal",
                      img: "/catalog_personal.png" 
                    },
                    { 
                      porcentaje: 30, 
                      titulo: "Hasta 30% Dcto. en tu Tratamiento", 
                      productName: "Metformina Calex & Cefadroxilo Rowe",
                      categoryName: "Tratamiento Médico",
                      img: "/catalog_hipertension.png" 
                    },
                    { 
                      porcentaje: 15, 
                      titulo: "15% Dcto. en Cuidado Bucal", 
                      productName: "Enjuague Oral-B & Crema Colgate",
                      categoryName: "Cuidado Bucal",
                      img: "/catalog_personal.png" 
                    },
                    { 
                      porcentaje: 10, 
                      titulo: "Cesta a menos de REF: 9,99", 
                      productName: "Kit Acetaminofén Genfar & Letisan",
                      categoryName: "Salud y Cuidado",
                      img: "/catalog_hipertension.png" 
                    },
                    { 
                      porcentaje: 30, 
                      titulo: "Hasta 30% Dcto. en Diversos", 
                      productName: "Snacks Doritos & Gomitas Trululú",
                      categoryName: "Diversos & Snacks",
                      img: "/catalog_personal.png" 
                    }
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="flex-shrink-0 w-[240px] h-[350px] bg-white rounded-3xl border border-slate-100/80 hover:border-brand-blue/20 shadow-[0_4px_24px_rgba(0,0,0,0.015)] hover:shadow-[0_16px_40px_rgba(15,61,147,0.065)] snap-start flex flex-col justify-between p-4 transition-all duration-300 hover:-translate-y-1.5 relative overflow-hidden group"
                    >
                      <div className="flex-shrink-0 flex justify-between items-center z-10">
                        <span className="text-[10px] font-black text-[#0F3D93]/45 tracking-widest uppercase">
                          {item.categoryName}
                        </span>
                        <Link 
                          href="#catalogos"
                          className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#0F3D93] text-[#0F3D93] hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>

                      <div className="text-left mt-1.5 z-10">
                        <h4 className="text-xs font-black text-brand-dark leading-snug line-clamp-2 min-h-[2.25rem] flex items-start">
                          {item.productName}
                        </h4>
                      </div>

                      <div className="flex-1 flex items-center justify-center bg-slate-50/50 rounded-2xl border border-slate-100/30 my-2 relative overflow-hidden h-32 w-full">
                        <img 
                          src={item.img} 
                          alt={item.productName} 
                          className="object-cover w-full h-full transition-transform duration-550 group-hover:scale-105 rounded-2xl" 
                        />
                      </div>

                      <div className="bg-[#fcd53f] border border-[#fbd12b] py-2 px-3 rounded-xl shadow-[0_2px_6px_rgba(252,213,63,0.1)]">
                        <p className="text-[10px] font-black text-[#0f3d93] leading-tight uppercase tracking-wider line-clamp-2 min-h-[1.5rem] flex items-center justify-center">
                          {item.titulo}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 6: GRID DE 2 BANNERS (Lado a Lado) */}
        <section className="py-6 bg-white text-brand-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Banner */}
              <div className="relative rounded-3xl overflow-hidden h-72 shadow-md group">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/95 via-brand-blue/80 to-transparent z-10" />
                <div className="absolute inset-0 bg-gray-150 overflow-hidden">
                  <img src="/catalog_hipertension.png" alt="Cardio Care" className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="relative z-20 h-full flex flex-col justify-center text-left p-8 text-white max-w-sm">
                  <span className="bg-brand-green text-white text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full w-fit mb-2">
                    SALUD CARDIOVASCULAR
                  </span>
                  <h4 className="text-2xl font-black tracking-tight mb-2">Monitoreo Constante de la Tensión</h4>
                  <p className="text-xs text-white/70 mb-4 font-semibold">Consigue tensiómetros y medicamentos reguladores con la mejor asesoría.</p>
                  <Link href="#catalogos" className="bg-brand-green hover:bg-brand-green-hover text-white text-xs font-bold py-3 px-6 rounded-full w-fit">
                    Ver Productos
                  </Link>
                </div>
              </div>

              {/* Right Banner */}
              <div className="relative rounded-3xl overflow-hidden h-72 shadow-md group">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/95 via-brand-blue/80 to-transparent z-10" />
                <div className="absolute inset-0 bg-gray-150 overflow-hidden">
                  <img src="/catalog_personal.png" alt="Cuidado Dérmico" className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="relative z-20 h-full flex flex-col justify-center text-left p-8 text-white max-w-sm">
                  <span className="bg-brand-green text-white text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full w-fit mb-2">
                    BIO-NUTRICIÓN
                  </span>
                  <h4 className="text-2xl font-black tracking-tight mb-2">Suplementación Orgánica Diaria</h4>
                  <p className="text-xs text-white/70 mb-4 font-semibold">Vitaminas y minerales para mejorar tu rendimiento diario y defensas.</p>
                  <Link href="#catalogos" className="bg-brand-green hover:bg-brand-green-hover text-white text-xs font-bold py-3 px-6 rounded-full w-fit">
                    Ver Suplementos
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECCIÓN 7: GRID DE 3 BANNERS (Cards de Productos Rediseñadas) */}
        <section id="productos-destacados" className="py-16 bg-white text-brand-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-brand-green font-bold tracking-wider uppercase text-xs block mb-2">Catálogo Directo</span>
              <h2 className="text-3xl font-black text-brand-dark tracking-tight">Productos en Tendencia</h2>
              <p className="text-sm text-gray-500 mt-2 font-medium">Conoce las especificaciones e ingredientes activos de nuestros productos destacados.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredProducts.map((product) => {
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
                        <SafeImage 
                          src={product.imagen_url} 
                          alt={product.nombre} 
                          className="object-contain max-h-full max-w-full rounded-lg transition-transform duration-500 group-hover:scale-105" 
                          fallbackIcon={ShoppingBag}
                        />
                        {/* Badges Container (Top Left) */}
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
                          {product.catalogos?.nombre || product.linea || "Medicamento"}
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

                      {/* Stock status indicator bar (replaces quantity text) */}
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
              })}
            </div>
          </div>
        </section>

        {/* SECCIÓN 9: MARCAS ALIADAS */}
        <section id="aliados" className="py-16 bg-white border-t border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">
              Nuestras Marcas Aliadas
            </h3>
            
            {/* Smooth Infinite Marquee */}
            <div className="relative overflow-hidden w-full py-4">
              <div className="flex gap-12 w-max animate-scroll-left pause-on-hover">
                {["Megalabs", "Cofasa", "NOW Venezuela", "Meyer", "Oftalmi", "Calox", "La Santé", "Andilab", "GEAGAR"].map((marca, index) => (
                  <div 
                    key={index}
                    className="text-lg font-black text-gray-400 hover:text-brand-blue transition-colors cursor-default select-none px-4"
                  >
                    🤝 {marca}
                  </div>
                ))}
                {/* Duplicate for Marquee Loop */}
                {["Megalabs", "Cofasa", "NOW Venezuela", "Meyer", "Oftalmi", "Calox", "La Santé", "Andilab", "GEAGAR"].map((marca, index) => (
                  <div 
                    key={`dup-${index}`}
                    className="text-lg font-black text-gray-400 hover:text-brand-blue transition-colors cursor-default select-none px-4"
                  >
                    🤝 {marca}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 10: SOBRE NOSOTROS (Historia, Misión, Visión y Valores - Rediseñada) */}
        <section id="nosotros" className="py-20 bg-gradient-to-r from-brand-blue via-brand-blue-mid to-brand-green text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            
            {/* 1. Historia (6 Años en Petare) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-[0_12px_40px_-15px_rgba(15,61,147,0.02)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/[0.02] rounded-full blur-3xl pointer-events-none" />
              <div className="lg:col-span-7 text-left space-y-4">
                <span className="inline-flex items-center gap-1.5 bg-brand-green/10 text-brand-green font-black tracking-wider uppercase text-[10px] px-3.5 py-1.5 rounded-full">
                  <Sparkles className="h-3.5 w-3.5" />
                  Nuestra Trayectoria
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-brand-dark tracking-tight">
                  6 Años Tejiendo Sueños, Forjando Futuros
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-wider text-brand-green">
                  Una Idea que Floreció en el Corazón de Petare
                </p>
                <div className="w-12 h-1 bg-brand-green rounded-full"></div>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  Hoy celebramos seis años de Farmatuya. Pero antes de ser esta estructura sólida que conocemos, Farmatuya fue una chispa, una visión, un sueño que nació en el corazón de un hombre visionario en Petare. En un momento donde muchos veían obstáculos, él vio oportunidades. Vio la necesidad de un servicio que podía marcar la diferencia y brindar bienestar.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  Lo que comenzó como una pequeña semilla en Petare, ha germinado y se ha fortalecido gracias al esfuerzo colectivo de nuestro valioso equipo. Hoy, con la misma pasión y determinación de nuestros inicios, nos encontramos en constante expansión, abriendo nuevas sedes y llevando el sello de calidad FarmaTuya a más hogares.
                </p>
                <div className="pt-2">
                  <Link 
                    href="/nosotros"
                    className="inline-flex items-center justify-center px-6 py-3 bg-brand-blue hover:bg-brand-blue-mid text-white text-xs font-bold rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Conoce nuestra historia completa
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-64 h-64 rounded-full bg-gradient-to-tr from-brand-blue via-brand-blue-mid to-brand-green p-1.5 shadow-xl float-animation">
                  <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center text-center p-6">
                    <span className="text-6xl font-black text-brand-blue leading-none">6</span>
                    <span className="text-xs font-black text-brand-green tracking-widest uppercase mt-2">Años</span>
                    <span className="text-[10px] text-gray-400 font-bold mt-1">Llevando Bienestar</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Misión y Visión (Dos Columnas Corporativas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Misión Card */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-brand-blue/20 shadow-[0_12px_40px_-15px_rgba(15,61,147,0.02)] hover:shadow-[0_25px_50px_-10px_rgba(15,61,147,0.05)] transition-all duration-500 hover:-translate-y-1.5 relative overflow-hidden group text-left">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/[0.01] rounded-full blur-2xl pointer-events-none group-hover:bg-brand-blue/[0.03] transition-colors" />
                <div className="absolute bottom-0 left-0 h-1.5 bg-brand-blue w-0 group-hover:w-full transition-all duration-500" />
                <span className="text-[10px] font-black text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-3.5 py-1.5 rounded-full uppercase tracking-wider block w-fit mb-4">
                  Misión
                </span>
                <h3 className="text-xl font-black text-brand-dark mb-3">Brindar Bienestar y Soluciones</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  En Farmatuya, nuestra misión es brindar bienestar y soluciones farmacéuticas de alta calidad. Nos comprometemos a la excelencia, la innovación y el servicio accesible, construyendo un legado de confianza.
                </p>
              </div>

              {/* Visión Card */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-brand-green/20 shadow-[0_12px_40px_-15px_rgba(15,61,147,0.02)] hover:shadow-[0_25px_50px_-10px_rgba(15,61,147,0.05)] transition-all duration-500 hover:-translate-y-1.5 relative overflow-hidden group text-left">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/[0.01] rounded-full blur-2xl pointer-events-none group-hover:bg-brand-green/[0.03] transition-colors" />
                <div className="absolute bottom-0 left-0 h-1.5 bg-brand-green w-0 group-hover:w-full transition-all duration-500" />
                <span className="text-[10px] font-black text-brand-green bg-brand-green/10 border border-brand-green/20 px-3.5 py-1.5 rounded-full uppercase tracking-wider block w-fit mb-4">
                  Visión
                </span>
                <h3 className="text-xl font-black text-brand-dark mb-3">Liderar el Futuro de la Salud</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  Aspiramos a ser la red farmacéutica líder en nuestro país, reconocida por nuestra calidad, accesibilidad e impacto positivo en la salud y el bienestar de cada familia. Buscamos expandir nuestra presencia e innovar constantemente en nuestros servicios.
                </p>
              </div>
            </div>

            {/* 3. Valores (Grid de 6 Columnas) */}
            <div className="space-y-8">
              <div className="text-center">
                <span className="text-brand-green font-bold tracking-wider uppercase text-xs block mb-2">Nuestro ADN</span>
                <h3 className="text-2xl font-black text-white tracking-tight">Nuestros Valores</h3>
                <div className="w-12 h-0.5 bg-brand-green mx-auto mt-3 rounded-full" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: Sparkles,
                    title: "Espíritu Emprendedor",
                    desc: "Como nació en nuestro fundador, el espíritu emprendedor y la búsqueda constante de nuevas y mejores formas de servir son el motor de nuestro crecimiento."
                  },
                  {
                    icon: ClipboardCheck,
                    title: "Excelencia y Calidad",
                    desc: "Nos comprometemos a ofrecer productos y servicios de la más alta calidad. La excelencia no es una meta, es nuestro estándar diario, desde la atención al cliente hasta la selección."
                  },
                  {
                    icon: ShieldCheck,
                    title: "Integridad y Transparencia",
                    desc: "Actuamos con honestidad, ética y transparencia en todas nuestras operaciones. La confianza de nuestros clientes y colaboradores es nuestro activo más valioso."
                  },
                  {
                    icon: Heart,
                    title: "Servicio y Vocación de Ayuda",
                    desc: "Nuestra razón de ser es servir. Nos apasiona ayudar a las personas a mejorar su salud y su calidad de vida en cada interacción con vocación de servicio."
                  },
                  {
                    icon: Users,
                    title: "Trabajo en Equipo y Colaboración",
                    desc: "Reconocemos que nuestros mayores logros se consiguen juntos. Fomentamos un ambiente de respeto, colaboración y apoyo mutuo, donde cada voz cuenta."
                  },
                  {
                    icon: Building2,
                    title: "Responsabilidad Social y Comunitaria",
                    desc: "Como parte de la comunidad que nos vio nacer, nos sentimos responsables de contribuir a su desarrollo y bienestar de forma positiva y sostenible."
                  }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="bg-white p-7 rounded-3xl border border-slate-100 hover:border-brand-green/20 shadow-[0_10px_35px_-10px_rgba(15,61,147,0.02)] hover:shadow-[0_20px_40px_-5px_rgba(15,61,147,0.04)] flex flex-col items-start text-left group transition-all duration-500 hover:-translate-y-1.5 border-l-4 border-l-transparent hover:border-l-brand-green"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center mb-5 group-hover:bg-gradient-to-br group-hover:from-brand-blue group-hover:via-brand-blue-mid group-hover:to-brand-green group-hover:text-white group-hover:scale-105 transition-all duration-500 shadow-sm">
                      <item.icon className="w-5.5 h-5.5" />
                    </div>
                    <h4 className="font-black text-base text-brand-dark mb-2 group-hover:text-brand-blue transition-colors">{item.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* SECCIÓN MOCK DE BLOG DE SALUD (Cards Rediseñadas) */}
        <section id="blog" className="py-16 bg-white text-brand-dark border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-brand-green font-bold tracking-wider uppercase text-xs block mb-2">Consejos de Expertos</span>
              <h2 className="text-3xl font-black text-brand-dark tracking-tight">Blog de Salud & Bienestar</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "La Importancia de la Vitamina C en Invierno",
                  desc: "Descubre cómo la suplementación diaria ayuda a mantener tus defensas listas contra los resfriados de temporada.",
                  date: "May 28, 2026",
                  icon: Sparkles
                },
                {
                  title: "Cómo Medir Correctamente tu Presión Arterial",
                  desc: "Pasos fundamentales para usar el tensiómetro de brazo digital en casa y evitar lecturas erróneas.",
                  date: "Jun 02, 2026",
                  icon: CheckCircle
                },
                {
                  title: "Consejos para Mantener la Hidratación de los Bebés",
                  desc: "Cuándo es necesario usar sueros orales y electrolitos para proteger a los más pequeños en días calurosos.",
                  date: "Jun 04, 2026",
                  icon: HelpCircle
                }
              ].map((post, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-7 border border-slate-100 hover:border-brand-green/20 shadow-[0_10px_35px_-10px_rgba(15,61,147,0.02)] hover:shadow-[0_25px_50px_-10px_rgba(15,61,147,0.06)] flex flex-col justify-between text-left group transition-all duration-500 hover:-translate-y-1.5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-green/[0.01] rounded-full blur-2xl pointer-events-none group-hover:bg-brand-green/[0.04] transition-colors duration-500" />
                  <div>
                    <span className="text-[10px] text-brand-green font-black bg-brand-green/10 border border-brand-green/20 px-3 py-1 rounded-full block w-fit mb-5">{post.date}</span>
                    <h4 className="font-black text-lg text-brand-dark group-hover:text-brand-green transition-colors mb-3 leading-snug">{post.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium line-clamp-3">{post.desc}</p>
                  </div>
                  <Link href="#blog" className="text-xs font-black text-brand-blue hover:text-brand-green transition-colors mt-6 inline-flex items-center gap-1.5 group/link">
                    <span>Leer artículo completo</span>
                    <ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECCIÓN DE CATÁLOGOS ORIGINALES DE BASE DE DATOS (Dynamic Lines - Rediseñada) */}
        <section id="catalogos" className="py-20 bg-brand-muted text-brand-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-brand-green font-bold tracking-wider uppercase text-xs block mb-2">Líneas Farmacéuticas</span>
              <h2 className="text-3xl font-black text-brand-dark tracking-tight">Catálogos Disponibles</h2>
              <div className="w-16 h-1 bg-brand-green mx-auto rounded-full mt-4"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {catalogs.length === 0 ? (
                <div className="col-span-4 text-center text-gray-400 font-semibold">Cargando catálogos de base de datos...</div>
              ) : (
                catalogs.map((catalog: any) => (
                  <Link 
                    href={`/catalogs/${catalog.id}`} 
                    key={catalog.id} 
                    className="bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-brand-green/30 flex flex-col group cursor-pointer transition-all duration-500 hover:-translate-y-1.5 shadow-[0_10px_35px_-10px_rgba(15,61,147,0.02)] hover:shadow-[0_25px_50px_-10px_rgba(15,61,147,0.06)]"
                  >
                    <div className="relative h-44 bg-gradient-to-tr from-brand-blue/[0.03] via-brand-blue/[0.01] to-brand-green/[0.005] flex items-center justify-center p-4 border-b border-slate-50 overflow-hidden">
                      {catalog.image_url ? (
                        <>
                          <div className="absolute inset-0 bg-brand-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                          <Image 
                            src={catalog.image_url} 
                            alt={catalog.nombre} 
                            fill 
                            sizes="(max-width: 768px) 100vw, 25vw" 
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108" 
                          />
                        </>
                      ) : (
                        <ShoppingBag className="h-10 w-10 text-brand-blue/20 group-hover:scale-110 transition-transform duration-500" />
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between text-left relative">
                      <div className="absolute bottom-0 left-0 h-1 bg-brand-blue w-0 group-hover:w-full transition-all duration-500" />
                      <div>
                        <h3 className="font-black text-base mb-1.5 text-brand-dark group-hover:text-brand-green transition-colors leading-snug">{catalog.nombre}</h3>
                        <p className="text-[11px] text-gray-400 mb-4 line-clamp-2 font-medium leading-relaxed">{catalog.descripcion || 'Ver catálogo completo'}</p>
                      </div>
                      <div className="flex items-center text-brand-blue text-xs font-black group-hover:translate-x-1.5 transition-transform duration-300">
                        <span>Ver Productos</span>
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

      </main>

      {/* SECCIÓN 11: FOOTER COMPLETO */}
      <footer id="contacto" className="bg-brand-dark text-white pt-16 pb-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
            
            {/* Columna 1: Branding */}
            <div className="lg:col-span-4 space-y-4 text-left">
              <div className="flex items-center gap-2">
                <div className="relative w-36 h-10">
                  <Image 
                    src="/IMG_2070.PNG" 
                    alt="FarmaTuya Logo" 
                    fill 
                    className="object-contain"
                  />
                </div>
              </div>
              <p className="text-white/60 text-xs font-semibold leading-relaxed max-w-sm">
                Comprometidos con tu salud y bienestar familiar. Más de 10 años ofreciendo medicamentos garantizados y atención farmacéutica de primera.
              </p>
              <div className="space-y-2 text-xs font-bold text-white/80">
                <a href="tel:+584125040440" className="flex items-center gap-2 hover:text-brand-green transition-colors">
                  <Phone className="h-4 w-4 text-brand-green" />
                  0412-504-0440
                </a>
                <a href="mailto:contacto@farmatuya.com" className="flex items-center gap-2 hover:text-brand-green transition-colors">
                  <Mail className="h-4 w-4 text-brand-green" />
                  contacto@farmatuya.com
                </a>
              </div>
              <Link href="/tiendas" className="text-xs font-black text-brand-green hover:underline flex items-center gap-1">
                Encuentra tu tienda más cercana →
              </Link>
            </div>

            {/* Columna 2: Tu Cuenta */}
            <div className="lg:col-span-2 text-left">
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-brand-green mb-4">Tu Cuenta</h4>
              <ul className="space-y-2.5 text-xs text-white/60 font-semibold">
                <li><Link href="/login" className="hover:text-white transition-colors">Iniciar Sesión</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Crear Cuenta</Link></li>
                <li><Link href="#inicio" className="hover:text-white transition-colors">Mis Pedidos</Link></li>
                <li><Link href="#inicio" className="hover:text-white transition-colors">Mis Recetas</Link></li>
                <li><Link href="#inicio" className="hover:text-white transition-colors">Ayuda</Link></li>
              </ul>
            </div>

            {/* Columna 3: Descubre */}
            <div className="lg:col-span-2 text-left">
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-brand-green mb-4">Descubre</h4>
              <ul className="space-y-2.5 text-xs text-white/60 font-semibold">
                <li><Link href="#categorias" className="hover:text-white transition-colors">Medicamentos</Link></li>
                <li><Link href="#categorias" className="hover:text-white transition-colors">Cuidado Personal</Link></li>
                <li><Link href="#categorias" className="hover:text-white transition-colors">Línea Infantil</Link></li>
                <li><Link href="#categorias" className="hover:text-white transition-colors">Salud y Nutrición</Link></li>
                <li><Link href="#categorias" className="hover:text-white transition-colors">Belleza</Link></li>
              </ul>
            </div>

            {/* Columna 4: FarmaTuya Institucional */}
            <div className="lg:col-span-2 text-left">
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-brand-green mb-4">FarmaTuya</h4>
              <ul className="space-y-2.5 text-xs text-white/60 font-semibold">
                <li><Link href="#nosotros" className="hover:text-white transition-colors">Sobre Nosotros</Link></li>
                <li><Link href="/tiendas" className="hover:text-white transition-colors">Nuestras Tiendas</Link></li>
                <li><Link href="#blog" className="hover:text-white transition-colors">Blog de Salud</Link></li>
                <li><Link href="#aliados" className="hover:text-white transition-colors">Marcas Aliadas</Link></li>
                <li><Link href="#contacto" className="hover:text-white transition-colors">Contacto</Link></li>
              </ul>
            </div>

            {/* Columna 5: Servicios */}
            <div className="lg:col-span-2 text-left">
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-brand-green mb-4">Servicios</h4>
              <ul className="space-y-2.5 text-xs text-white/60 font-semibold">
                <li><Link href="/tiendas" className="hover:text-white transition-colors">Farmacia 24 Horas</Link></li>
                <li><Link href="#contacto" className="hover:text-white transition-colors">Consulta Farmacéutica</Link></li>
                <li><Link href="#contacto" className="hover:text-white transition-colors">Toma de Presión</Link></li>
                <li><Link href="#contacto" className="hover:text-white transition-colors">Receta Recurrente</Link></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/40 gap-4">
            <p>&copy; {new Date().getFullYear()} FarmaTuya, C.A. Todos los derechos reservados. RIF J-50000000-0.</p>
            <div className="flex gap-4">
              <Link href="#contacto" className="hover:text-white transition-colors">Términos de Servicio</Link>
              <span>•</span>
              <Link href="#contacto" className="hover:text-white transition-colors">Política de Privacidad</Link>
            </div>
            <div className="flex items-center gap-2">
              <span>Hecho con ♥ para tu salud</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Botón flotante de WhatsApp */}
      <a 
        href="https://wa.me/584125040440?text=Hola%2C%20vengo%20de%20la%20p%C3%A1gina%20web%20de%20FarmaTuya%2C%20quisiera%20hacer%20una%20consulta." 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 z-50 flex items-center justify-center cursor-pointer hover:shadow-emerald-500/20"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" />
      </a>

    </div>
  )
}

