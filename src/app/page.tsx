import { supabase } from '@/lib/supabase'
import { getLatestRate } from '@/lib/rates-client'
import HomePageClient from './HomePageClient'

export const revalidate = 60 // ISR: Revalidate every 60 seconds

export default async function Home() {
  // Fetch all initial data in parallel
  const [
    productsRes,
    catalogsRes,
    descuentosRes,
    promoBannersRes,
    tiendasRes,
    usdRate,
    eurRate
  ] = await Promise.all([
    supabase.from('productos').select('*, catalogos(nombre)').eq('activo', true).eq('empresa', 'farmatuya').limit(9),
    supabase.from('catalogos').select('*').eq('activo', true).eq('empresa', 'farmatuya'),
    supabase.from('descuentos_visuales').select('*').eq('activo', true).eq('empresa', 'farmatuya').order('order_index', { ascending: true }),
    supabase.from('banners_promocionales').select('*').eq('activo', true).eq('empresa', 'farmatuya').order('order_index', { ascending: true }),
    supabase.from('tiendas').select('*').eq('activo', true).eq('empresa', 'farmatuya').order('nombre', { ascending: true }),
    getLatestRate('USD').catch(() => null),
    getLatestRate('EUR').catch(() => null)
  ])

  const initialData = {
    products: productsRes.data || [],
    catalogs: catalogsRes.data || [],
    descuentos: descuentosRes.data || [],
    promoBanners: promoBannersRes.data || [],
    tiendas: tiendasRes.data || [],
    rates: {
      usd: usdRate?.rate || 36.5,
      eur: eurRate?.rate || 40.0
    }
  }

  return <HomePageClient initialData={initialData} />
}
