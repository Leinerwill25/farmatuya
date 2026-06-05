'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ShoppingBag, AlertTriangle, Package, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    totalCategories: 0,
    totalUsers: 0,
  })
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      const { data: { user } } = await supabase.auth.getUser()
      
      // Real fetch (will be 0 if tables are empty)
      const { count: productsCount } = await supabase.from('productos').select('*', { count: 'exact', head: true }).eq('empresa', 'farmatuya')
      const { count: lowStockCount } = await supabase.from('productos').select('*', { count: 'exact', head: true }).lt('stock', 5).eq('empresa', 'farmatuya')
      const { count: categoriesCount } = await supabase.from('catalogos').select('*', { count: 'exact', head: true }).eq('empresa', 'farmatuya')
      
      const { data: profiles } = await supabase.from('profiles').select('*')
      const filteredUsers = profiles?.filter((p: any) => p.permissions?.created_by === user?.id) || []
      const usersCount = filteredUsers.length

      setStats({
        totalProducts: productsCount || 0,
        lowStock: lowStockCount || 0,
        totalCategories: categoriesCount || 0,
        totalUsers: usersCount,
      })

      const { data: products } = await supabase.from('productos').select('*').lt('stock', 5).eq('empresa', 'farmatuya').limit(5)
      setLowStockProducts(products || [])
      
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <div className="p-8">Cargando estadísticas...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/5 flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <ShoppingBag className="h-6 w-6 text-primary" />
          </div>
          <div>
            <span className="text-sm text-foreground/60">Total Productos</span>
            <p className="text-2xl font-bold text-foreground">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/5 flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <span className="text-sm text-foreground/60">Bajo Stock</span>
            <p className="text-2xl font-bold text-red-500">{stats.lowStock}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/5 flex items-center gap-4">
          <div className="bg-accent/10 p-3 rounded-full">
            <Package className="h-6 w-6 text-accent" />
          </div>
          <div>
            <span className="text-sm text-foreground/60">Categorías</span>
            <p className="text-2xl font-bold text-foreground">{stats.totalCategories}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/5 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Users className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <span className="text-sm text-foreground/60">Usuarios</span>
            <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
          </div>
        </div>
      </div>

      {/* Alertas de Inventario */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/5">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Alertas de Inventario (Poco Stock)
        </h2>

        {lowStockProducts.length === 0 ? (
          <p className="text-foreground/60 text-sm">No hay alertas de inventario en este momento (Stock &lt; 5).</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-foreground">
              <thead className="text-xs uppercase bg-muted/50 text-foreground/60">
                <tr>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Acción</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map((product: any) => (
                  <tr key={product.id} className="border-b border-primary/5">
                    <td className="px-4 py-3 font-medium">{product.nombre || product.name}</td>
                    <td className="px-4 py-3 text-red-500 font-bold">{product.stock} unidades</td>
                    <td className="px-4 py-3">${product.precio || product.price || 0}</td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => router.push(`/admin/products?search=${product.nombre || product.name}`)}
                        className="text-primary hover:underline"
                      >
                        Reponer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
