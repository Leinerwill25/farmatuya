import { supabase } from '@/lib/supabase'
import ProductClient from './ProductClient'
import { notFound } from 'next/navigation'

export const revalidate = 60

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: productData } = await supabase
    .from('productos')
    .select('*, catalogos(nombre)')
    .eq('id', id)
    .eq('empresa', 'farmatuya')
    .single()

  if (!productData) {
    notFound()
  }

  const { data: relatedData } = await supabase
    .from('productos')
    .select('*')
    .eq('catalogo_id', productData.catalogo_id)
    .eq('empresa', 'farmatuya')
    .neq('id', id)
    .limit(4)

  return <ProductClient productData={productData} relatedProductsData={relatedData || []} />
}

