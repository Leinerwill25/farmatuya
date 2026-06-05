'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, Edit, Upload, CheckCircle, AlertCircle } from 'lucide-react'
import { getLatestRate } from '@/lib/rates-client'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [rates, setRates] = useState({ usd: 1, eur: 1 }) // Rates relative to Bs
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    currency: 'USD',
    stock: '0',
    bultos_stock: '0',
    unidades_por_bulto: '1',
    description: '',
    expiration_date: '',
    catalog_id: '',
    descuento: '0',
    en_tendencia: false,
  })
  const [file, setFile] = useState<File | null>(null)
  const [editFile, setEditFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  
  const [showReceptionModal, setShowReceptionModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [receptionData, setReceptionData] = useState({
    quantity_invoice: '',
    quantity_received: '',
    reason_rejected: '',
  })

  // State for custom messages modal
  const [modalMessage, setModalMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)

  // State for edit modal
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [editNote, setEditNote] = useState('')

  const [catalogs, setCatalogs] = useState<any[]>([])

  useEffect(() => {
    fetchProducts()
    fetchRates()
    fetchCatalogs()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const fetchProducts = async () => {
    setLoading(true)
    const { data } = await supabase.from('productos').select('*').eq('empresa', 'farmatuya')
    setProducts(data || [])
    setLoading(false)
  }

  const fetchCatalogs = async () => {
    const { data } = await supabase.from('catalogos').select('*').eq('empresa', 'farmatuya')
    setCatalogs(data || [])
  }

  const fetchRates = async () => {
    const usdRate = await getLatestRate('USD')
    const eurRate = await getLatestRate('EUR')
    setRates({
      usd: usdRate?.rate || 36.5, // Fallback
      eur: eurRate?.rate || 40.0, // Fallback
    })
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    let image_url = null

    // Upload file if exists
    if (file) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
         .from('product-images')
         .upload(filePath, file)

      if (uploadError) {
        setModalMessage({ type: 'error', text: 'Error al subir imagen: ' + uploadError.message })
        setUploading(false)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      image_url = publicUrlData.publicUrl
    }

    const bStock = parseInt(newProduct.bultos_stock) || 0
    const uPerB = parseInt(newProduct.unidades_por_bulto) || 1
    const totalStock = bStock * uPerB

    const { error } = await supabase.from('productos').insert([
      {
        nombre: newProduct.name,
        precio: parseFloat(newProduct.price) || 0,
        moneda: newProduct.currency,
        stock: totalStock,
        bultos_stock: bStock,
        unidades_por_bulto: uPerB,
        descripcion: newProduct.description,
        catalogo_id: newProduct.catalog_id || null,
        imagen_url: image_url,
        empresa: 'farmatuya',
        descuento: parseInt(newProduct.descuento) || 0,
        en_tendencia: newProduct.en_tendencia,
      },
    ])

    setUploading(false)

    if (!error) {
      setModalMessage({ type: 'success', text: 'Producto agregado exitosamente.' })
      setNewProduct({ name: '', price: '', currency: 'USD', stock: '0', bultos_stock: '0', unidades_por_bulto: '1', description: '', expiration_date: '', catalog_id: '', descuento: '0', en_tendencia: false })
      setFile(null)
      fetchProducts()
    } else {
      setModalMessage({ type: 'error', text: 'Error al agregar producto: ' + error.message })
    }
  }

  const handleReception = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return

    const invoice = parseInt(receptionData.quantity_invoice)
    const received = parseInt(receptionData.quantity_received)
    const rejected = invoice - received

    if (received > invoice) {
      setModalMessage({ type: 'error', text: 'La cantidad recibida no puede ser mayor a la facturada.' })
      return
    }

    const newStock = (selectedProduct.stock || 0) + received
    const newBultosStock = Math.floor(newStock / (selectedProduct.unidades_por_bulto || 1))

    const { error: stockError } = await supabase
      .from('productos')
      .update({ 
        stock: newStock,
        bultos_stock: newBultosStock
      })
      .eq('id', selectedProduct.id)

    if (stockError) {
      setModalMessage({ type: 'error', text: 'Error al actualizar stock: ' + stockError.message })
      return
    }

    const { error: logError } = await supabase.from('receptions').insert([
      {
        product_id: selectedProduct.id,
        quantity_invoice: invoice,
        quantity_received: received,
        quantity_rejected: rejected,
        reason_rejected: rejected > 0 ? receptionData.reason_rejected : null,
      },
    ])

    if (logError) {
      setModalMessage({ type: 'error', text: 'Error al registrar recepción: ' + logError.message })
    } else {
      setModalMessage({ type: 'success', text: `Recepción completada. Se cargaron ${received} unidades al inventario.` })
      setShowReceptionModal(false)
      setReceptionData({ quantity_invoice: '', quantity_received: '', reason_rejected: '' })
      fetchProducts()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return
    const { error } = await supabase.from('productos').delete().eq('id', id)
    if (!error) {
      setModalMessage({ type: 'success', text: 'Producto eliminado exitosamente.' })
      fetchProducts()
    } else {
      setModalMessage({ type: 'error', text: 'Error al eliminar producto: ' + error.message })
    }
  }

  const calculateEquivalents = (price: string, currency: string) => {
    const val = parseFloat(price)
    if (isNaN(val)) return { usd: 0, eur: 0, bs: 0 }

    let bs = 0
    let usd = 0
    let eur = 0

    if (currency === 'BS') {
      bs = val
      usd = val / rates.usd
      eur = val / rates.eur
    } else if (currency === 'USD') {
      usd = val
      bs = val * rates.usd
      eur = (val * rates.usd) / rates.eur
    } else if (currency === 'EUR') {
      eur = val
      bs = val * rates.eur
      usd = (val * rates.eur) / rates.usd
    }

    return { usd, eur, bs }
  }

  const equivalents = calculateEquivalents(newProduct.price, newProduct.currency)

  const filteredProducts = products.filter((p: any) => 
    (p.nombre || p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.descripcion || p.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  )
  const totalPages = Math.ceil(filteredProducts.length / 21)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * 21, currentPage * 21)

  if (loading) return <div className="p-8">Cargando productos...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Productos</h1>
      </div>

      {/* Formulario de Alta Mejorado */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/5 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-accent" />
          Agregar Nuevo Producto
        </h2>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                placeholder="Nombre del Producto"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Moneda</label>
              <select
                value={newProduct.currency}
                onChange={(e) => setNewProduct({ ...newProduct, currency: e.target.value })}
                className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="USD">Dólar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="BS">Bolívar (Bs)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Precio</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          {/* Cálculos en tiempo real */}
          {newProduct.price && (
            <div className="bg-muted/50 p-3 rounded-lg grid grid-cols-3 gap-4 text-sm text-center">
              <div><span className="text-foreground/60">En USD:</span> <span className="font-bold">${equivalents.usd.toFixed(2)}</span></div>
              <div><span className="text-foreground/60">En EUR:</span> <span className="font-bold">€{equivalents.eur.toFixed(2)}</span></div>
              <div><span className="text-foreground/60">En Bs:</span> <span className="font-bold">{equivalents.bs.toFixed(2)} Bs</span></div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-4">
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <input
                type="text"
                placeholder="Descripción corta del producto"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bultos en Stock</label>
              <input
                type="number"
                placeholder="0"
                value={newProduct.bultos_stock}
                onChange={(e) => {
                  const bStock = e.target.value;
                  const uPerB = newProduct.unidades_por_bulto;
                  const total = (parseInt(bStock) || 0) * (parseInt(uPerB) || 1);
                  setNewProduct({ ...newProduct, bultos_stock: bStock, stock: total.toString() })
                }}
                className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unidades por Bulto</label>
              <input
                type="number"
                placeholder="1"
                value={newProduct.unidades_por_bulto}
                onChange={(e) => {
                  const uPerB = e.target.value;
                  const bStock = newProduct.bultos_stock;
                  const total = (parseInt(bStock) || 0) * (parseInt(uPerB) || 1);
                  setNewProduct({ ...newProduct, unidades_por_bulto: uPerB, stock: total.toString() })
                }}
                className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock Total (Unidades)</label>
              <input
                type="number"
                value={(parseInt(newProduct.bultos_stock) || 0) * (parseInt(newProduct.unidades_por_bulto) || 1)}
                className="w-full px-4 py-2 border border-primary/10 rounded-lg bg-muted/50 text-foreground/60 cursor-not-allowed focus:outline-none font-semibold"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Catálogo</label>
              <select
                value={newProduct.catalog_id || ''}
                onChange={(e) => setNewProduct({ ...newProduct, catalog_id: e.target.value })}
                className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Sin Catálogo</option>
                {catalogs.map((catalog: any) => (
                  <option key={catalog.id} value={catalog.id}>{catalog.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Descuento (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="0"
                value={newProduct.descuento}
                onChange={(e) => setNewProduct({ ...newProduct, descuento: e.target.value })}
                className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={newProduct.en_tendencia}
                  onChange={(e) => setNewProduct({ ...newProduct, en_tendencia: e.target.checked })}
                  className="w-5 h-5 text-primary rounded border-primary/10 focus:ring-primary cursor-pointer"
                />
                Destacar como Producto en Tendencia
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Imagen del Producto</label>
              <div className="flex items-center gap-4">
                <label className="w-full flex flex-col items-center px-4 py-2 bg-white text-foreground/60 rounded-lg border border-primary/10 cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="h-5 w-5 mb-1 text-accent" />
                  <span className="text-sm">{file ? file.name : "Seleccionar archivo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fecha de Vencimiento</label>
              <input
                type="date"
                value={newProduct.expiration_date}
                onChange={(e) => setNewProduct({ ...newProduct, expiration_date: e.target.value })}
                className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading}
              className="bg-primary hover:bg-primary-hover text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              {uploading ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Productos en Estilo Cards Minimalista */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/5 mb-6">
        {/* Buscador */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar productos por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-muted/30"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center text-foreground/60 py-8">No se encontraron productos.</div>
          ) : (
            paginatedProducts.map((product: any) => {
            const equiv = calculateEquivalents((product.precio ?? product.price ?? 0).toString(), product.moneda ?? product.currency ?? 'USD')
            return (
              <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all border border-gray-50 flex flex-col group p-3">
                {/* Contenedor de Imagen Limpio */}
                <div className="relative h-56 bg-[#F8F9FA] rounded-2xl flex items-center justify-center overflow-hidden">
                  {product.imagen_url ? (
                    <img src={product.imagen_url} alt={product.nombre || product.name} className="object-contain h-4/5 w-4/5 transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <Upload className="h-12 w-12 text-foreground/20" />
                  )}
                  {/* Badge de Stock flotante */}
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${
                    product.stock > 10 ? 'bg-white text-green-600' : 'bg-white text-red-600'
                  } shadow-sm`}>
                    Stock: {product.stock} unidades
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-[#1A1A1A] mb-1">{product.nombre || product.name}</h3>
                    <p className="text-xs text-foreground/50 mb-3 line-clamp-2">{product.descripcion || product.description || 'Sin descripción'}</p>
                  </div>

                  {/* Precios y Acción */}
                  <div className="border-t border-gray-50 pt-3">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <span className="text-xs text-foreground/40 block">Precio</span>
                        <span className="text-2xl font-bold text-[#1A1A1A]">
                          {(product.moneda ?? product.currency ?? 'USD') === 'USD' && `$${product.precio ?? product.price ?? 0}`}
                          {(product.moneda ?? product.currency) === 'EUR' && `€${product.precio ?? product.price ?? 0}`}
                          {(product.moneda ?? product.currency) === 'BS' && `${product.precio ?? product.price ?? 0} Bs`}
                        </span>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedProduct(product)
                          setShowReceptionModal(true)
                        }}
                        className="text-xs bg-[#1A1A1A] text-white px-4 py-2 rounded-full hover:bg-[#333333] hover:scale-105 hover:shadow-md transition-all duration-200 font-medium shadow-sm"
                      >
                        Recepción
                      </button>
                    </div>

                    {/* Equivalentes minimalistas */}
                    <div className="flex gap-2 text-xs text-foreground/50">
                      {(product.moneda ?? product.currency) !== 'USD' && (
                        <span>USD: <span className="font-medium text-foreground">${equiv.usd.toFixed(2)}</span></span>
                      )}
                      {(product.moneda ?? product.currency) !== 'EUR' && (
                        <span>EUR: <span className="font-medium text-foreground">€{equiv.eur.toFixed(2)}</span></span>
                      )}
                      {(product.moneda ?? product.currency) !== 'BS' && (
                        <span>Bs: <span className="font-medium text-foreground">{equiv.bs.toFixed(2)}</span></span>
                      )}
                    </div>

                    {/* Botones de acción secundarios */}
                    <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-gray-50">
                      <button 
                        onClick={() => {
                          setEditingProduct({
                            ...product,
                            descuento: product.descuento ?? 0,
                            en_tendencia: product.en_tendencia ?? false
                          })
                          setShowEditModal(true)
                        }}
                        className="p-2 text-foreground/40 hover:text-[#1A1A1A] transition-colors hover:bg-gray-50 rounded-full"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setProductToDelete(product.id)
                          setShowDeleteModal(true)
                        }}
                        className="p-2 text-foreground/40 hover:text-red-500 transition-colors hover:bg-gray-50 rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t border-primary/5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-primary/10 rounded-lg text-sm hover:bg-muted disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-foreground/60">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-primary/10 rounded-lg text-sm hover:bg-muted disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Modal de Recepción Parcial */}
      {showReceptionModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold mb-2">Recepción de Mercancía</h2>
            <p className="text-sm text-foreground/60 mb-4">Producto: <span className="font-semibold text-foreground">{selectedProduct.name}</span></p>
            
            <form onSubmit={handleReception} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Cantidad Facturada por Proveedor</label>
                <input
                  type="number"
                  value={receptionData.quantity_invoice}
                  onChange={(e) => setReceptionData({ ...receptionData, quantity_invoice: e.target.value })}
                  className="w-full px-4 py-2 border border-primary/10 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cantidad Real Ingresada</label>
                <input
                  type="number"
                  value={receptionData.quantity_received}
                  onChange={(e) => setReceptionData({ ...receptionData, quantity_received: e.target.value })}
                  className="w-full px-4 py-2 border border-primary/10 rounded-lg"
                  required
                />
              </div>
              
              {parseInt(receptionData.quantity_invoice) > parseInt(receptionData.quantity_received) && (
                <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                  <p className="text-xs text-red-600 font-medium mb-1">Se registrará un rechazo de {parseInt(receptionData.quantity_invoice) - parseInt(receptionData.quantity_received)} unidades.</p>
                  <label className="block text-xs font-medium mb-1 text-red-600">Motivo del Rechazo / Novedad</label>
                  <input
                    type="text"
                    placeholder="Eje: Dañado, Vencido, No entregado"
                    value={receptionData.reason_rejected}
                    onChange={(e) => setReceptionData({ ...receptionData, reason_rejected: e.target.value })}
                    className="w-full px-3 py-1.5 border border-red-200 rounded-lg text-sm"
                    required
                  />
                </div>
              )}

              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowReceptionModal(false)}
                  className="px-4 py-2 border border-primary/10 rounded-lg text-sm hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover"
                >
                  Procesar Recepción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Mensajes Personalizado */}
      {modalMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl max-w-sm w-full shadow-2xl text-center">
            <div className="flex justify-center mb-4">
              {modalMessage.type === 'success' ? (
                <CheckCircle className="h-12 w-12 text-green-500" />
              ) : (
                <AlertCircle className="h-12 w-12 text-red-500" />
              )}
            </div>
            <h2 className="text-xl font-bold mb-2">
              {modalMessage.type === 'success' ? '¡Éxito!' : 'Error'}
            </h2>
            <p className="text-foreground/60 mb-6">{modalMessage.text}</p>
            <button
              onClick={() => setModalMessage(null)}
              className={`px-6 py-2 rounded-lg text-white font-medium ${
                modalMessage.type === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
              } transition-colors`}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Edición de Producto */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl max-w-4xl w-full shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
            <form onSubmit={async (e) => {
              e.preventDefault()
              setUploading(true)

              let image_url = editingProduct.imagen_url || editingProduct.image_url

              if (editFile) {
                const fileExt = editFile.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `${fileName}`

                const { error: uploadError } = await supabase.storage
                  .from('product-images')
                  .upload(filePath, editFile)

                if (uploadError) {
                  setModalMessage({ type: 'error', text: 'Error al subir imagen: ' + uploadError.message })
                  setUploading(false)
                  return
                }

                const { data: publicUrlData } = supabase.storage
                  .from('product-images')
                  .getPublicUrl(filePath)

                image_url = publicUrlData.publicUrl
              }

              const bStock = parseInt((editingProduct.bultos_stock ?? 0).toString()) || 0
              const uPerB = parseInt((editingProduct.unidades_por_bulto ?? 1).toString()) || 1
              const totalStock = bStock * uPerB

              const { error } = await supabase
                .from('productos')
                .update({
                  nombre: editingProduct.nombre ?? editingProduct.name ?? '',
                  precio: parseFloat((editingProduct.precio ?? editingProduct.price ?? 0).toString()) || 0,
                  moneda: editingProduct.moneda ?? editingProduct.currency ?? 'USD',
                  stock: totalStock,
                  bStock: undefined, // remove any temporary fields
                  bultos_stock: bStock,
                  unidades_por_bulto: uPerB,
                  descripcion: editingProduct.descripcion ?? editingProduct.description ?? null,
                  catalogo_id: editingProduct.catalogo_id ?? editingProduct.catalog_id ?? null,
                  imagen_url: image_url,
                  descuento: parseInt((editingProduct.descuento ?? 0).toString()) || 0,
                  en_tendencia: editingProduct.en_tendencia ?? false,
                })
                .eq('id', editingProduct.id)

              if (!error) {
                // Insert log
                const { error: logError } = await supabase
                  .from('product_logs')
                  .insert([{ product_id: editingProduct.id, note: editNote }])

                if (logError) {
                  setModalMessage({ type: 'error', text: 'Producto actualizado pero falló el registro de auditoría: ' + logError.message })
                } else {
                  setModalMessage({ type: 'success', text: 'Producto actualizado y nota registrada exitosamente.' })
                }
                
                setShowEditModal(false)
                setEditingProduct(null)
                setEditNote('')
                fetchProducts()
              } else {
                setModalMessage({ type: 'error', text: 'Error al actualizar producto: ' + error.message })
              }
            }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre</label>
                  <input
                    type="text"
                    value={editingProduct.nombre ?? editingProduct.name ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nombre: e.target.value })}
                    className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Precio</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.precio ?? editingProduct.price ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, precio: e.target.value })}
                    className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <input
                    type="text"
                    value={editingProduct.descripcion ?? editingProduct.description ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, descripcion: e.target.value })}
                    className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Imagen del Producto</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-primary/10 border-dashed rounded-lg hover:border-primary/30 transition-colors cursor-pointer"
                       onClick={() => document.getElementById('edit-file-input')?.click()}>
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-foreground/20" />
                      <div className="flex text-sm text-foreground/60 justify-center">
                        <span className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-hover">
                          Subir un archivo
                        </span>
                        <p className="pl-1">o arrastrar y soltar</p>
                      </div>
                      <p className="text-xs text-foreground/40">PNG, JPG, GIF hasta 10MB</p>
                      {editFile && (
                        <p className="text-xs text-green-600 font-medium mt-1">Seleccionado: {editFile.name}</p>
                      )}
                    </div>
                    <input
                      id="edit-file-input"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Moneda</label>
                  <select
                    value={editingProduct.moneda ?? editingProduct.currency ?? 'USD'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, moneda: e.target.value })}
                    className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="USD">Dólar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="BS">Bolívar (Bs)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Bultos en Stock</label>
                    <input
                      type="number"
                      value={editingProduct.bultos_stock ?? 0}
                      onChange={(e) => {
                        const bStock = e.target.value;
                        const uPerB = editingProduct.unidades_por_bulto ?? 1;
                        const total = (parseInt(bStock) || 0) * (parseInt(uPerB) || 1);
                        setEditingProduct({ 
                          ...editingProduct, 
                          bultos_stock: bStock,
                          stock: total
                        })
                      }}
                      className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Unidades por Bulto</label>
                    <input
                      type="number"
                      value={editingProduct.unidades_por_bulto ?? 1}
                      onChange={(e) => {
                        const uPerB = e.target.value;
                        const bStock = editingProduct.bultos_stock ?? 0;
                        const total = (parseInt(bStock) || 0) * (parseInt(uPerB) || 1);
                        setEditingProduct({ 
                          ...editingProduct, 
                          unidades_por_bulto: uPerB,
                          stock: total
                        })
                      }}
                      className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock Total (Unidades)</label>
                  <input
                    type="number"
                    value={(parseInt(editingProduct.bultos_stock) || 0) * (parseInt(editingProduct.unidades_por_bulto) || 1)}
                    className="w-full px-4 py-2 border border-primary/10 rounded-lg bg-muted/50 text-foreground/60 cursor-not-allowed focus:outline-none font-semibold"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha de Vencimiento</label>
                  <input
                    type="date"
                    value={editingProduct.expiration_date || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, expiration_date: e.target.value })}
                    className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Catálogo</label>
                  <select
                    value={editingProduct.catalogo_id ?? editingProduct.catalog_id ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, catalogo_id: e.target.value })}
                    className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Sin Catálogo</option>
                    {catalogs.map((catalog: any) => (
                      <option key={catalog.id} value={catalog.id}>{catalog.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Descuento (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={editingProduct.descuento ?? '0'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, descuento: e.target.value })}
                    className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex items-center pt-2">
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editingProduct.en_tendencia ?? false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, en_tendencia: e.target.checked })}
                      className="w-5 h-5 text-primary rounded border-primary/10 focus:ring-primary cursor-pointer"
                    />
                    Destacar como Producto en Tendencia
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Motivo de la Edición (Nota Interna)</label>
                  <textarea
                    placeholder="Eje: Cambio de precio por inflación, Corrección de stock..."
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-20"
                    required
                  />
                </div>
              </div>

              <div className="col-span-full flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingProduct(null)
                    setEditFile(null)
                  }}
                  className="px-4 py-2 border border-primary/10 rounded-lg text-sm hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl max-w-sm w-full shadow-2xl text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">¿Estás seguro?</h2>
            <p className="text-foreground/60 mb-6">Esta acción eliminará el producto permanentemente.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setProductToDelete(null)
                }}
                className="px-4 py-2 border border-primary/10 rounded-lg text-sm hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (productToDelete) {
                    const { error } = await supabase.from('productos').delete().eq('id', productToDelete)
                    if (!error) {
                      setModalMessage({ type: 'success', text: 'Producto eliminado exitosamente.' })
                      fetchProducts()
                    } else {
                      setModalMessage({ type: 'error', text: 'Error al eliminar producto: ' + error.message })
                    }
                    setShowDeleteModal(false)
                    setProductToDelete(null)
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
