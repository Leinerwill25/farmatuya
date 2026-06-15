import { supabase } from '@/lib/supabase'
import CatalogClient from './CatalogClient'
import { notFound } from 'next/navigation'

export const revalidate = 60

export default async function CatalogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [catalogRes, productsRes] = await Promise.all([
    supabase.from('catalogos').select('*').eq('id', id).eq('empresa', 'farmatuya').single(),
    supabase.from('productos').select('*').eq('catalogo_id', id).eq('empresa', 'farmatuya').order('nombre', { ascending: true })
  ])

  if (catalogRes.error) { console.error("Supabase Error:", catalogRes.error); }
  if (!catalogRes.data) {
    notFound()
  }

  return <CatalogClient catalogData={catalogRes.data} productsData={productsRes.data || []} />
}


