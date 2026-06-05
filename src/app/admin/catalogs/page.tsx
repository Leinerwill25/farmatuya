'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, Upload, CheckCircle, AlertCircle, Edit } from 'lucide-react'

export default function CatalogsPage() {
  const [catalogs, setCatalogs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [newCatalog, setNewCatalog] = useState({
    name: '',
    description: '',
    destacado: false,
    emoji: '✨',
  })
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [modalMessage, setModalMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCatalog, setEditingCatalog] = useState<any>(null)
  const [editFile, setEditFile] = useState<File | null>(null)

  useEffect(() => {
    fetchCatalogs()
  }, [])

  const fetchCatalogs = async () => {
    setLoading(true)
    const { data } = await supabase.from('catalogos').select('*').eq('empresa', 'farmatuya')
    setCatalogs(data || [])
    setLoading(false)
  }

  const handleAddCatalog = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    let image_url = null

    // Upload file if exists
    if (file) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images') // Usamos el mismo bucket
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

    const { error } = await supabase.from('catalogos').insert([
      {
        nombre: newCatalog.name,
        descripcion: newCatalog.description,
        image_url: image_url,
        empresa: 'farmatuya',
        destacado: newCatalog.destacado,
        emoji: newCatalog.emoji || '✨',
      },
    ])

    setUploading(false)

    if (!error) {
      setModalMessage({ type: 'success', text: 'Catálogo creado exitosamente.' })
      setNewCatalog({ name: '', description: '', destacado: false, emoji: '✨' })
      setFile(null)
      fetchCatalogs()
    } else {
      setModalMessage({ type: 'error', text: 'Error al crear catálogo: ' + error.message })
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('catalogos').delete().eq('id', id)
    if (!error) {
      setModalMessage({ type: 'success', text: 'Catálogo eliminado exitosamente.' })
      fetchCatalogs()
    } else {
      setModalMessage({ type: 'error', text: 'Error al eliminar catálogo: ' + error.message })
    }
  }

  if (loading) return <div className="p-8">Cargando catálogos...</div>

  const filteredCatalogs = catalogs.filter((c: any) => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Catálogos</h1>
      </div>

      {/* Formulario de Alta */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/5 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-accent" />
          Crear Nuevo Catálogo
        </h2>
        <form onSubmit={handleAddCatalog} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre del Catálogo"
              value={newCatalog.name}
              onChange={(e) => setNewCatalog({ ...newCatalog, name: e.target.value })}
              className="px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <input
              type="text"
              placeholder="Descripción"
              value={newCatalog.description}
              onChange={(e) => setNewCatalog({ ...newCatalog, description: e.target.value })}
              className="px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Emoji (ej. 💊)"
              value={newCatalog.emoji}
              onChange={(e) => setNewCatalog({ ...newCatalog, emoji: e.target.value })}
              className="px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex items-center">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={newCatalog.destacado}
                  onChange={(e) => setNewCatalog({ ...newCatalog, destacado: e.target.checked })}
                  className="w-5 h-5 text-primary rounded border-primary/10 focus:ring-primary cursor-pointer"
                />
                Destacar como Categoría Destacada en el Home
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="w-full flex flex-col items-center px-4 py-2 bg-white text-foreground/60 rounded-lg border border-primary/10 cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="h-5 w-5 mb-1 text-accent" />
                <span className="text-sm">{file ? file.name : "Seleccionar Imagen del Catálogo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
            <div className="flex justify-end items-end">
              <button
                type="submit"
                disabled={uploading}
                className="bg-primary hover:bg-primary-hover text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 w-full md:w-auto"
              >
                {uploading ? 'Guardando...' : 'Crear Catálogo'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Lista de Catálogos */}
      <div className="bg-white rounded-xl shadow-sm border border-primary/5 overflow-hidden p-6">
        {/* Buscador */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar catálogos por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-muted/30"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-foreground">
            <thead className="text-xs uppercase bg-muted/50 text-foreground/60">
              <tr>
                <th className="px-6 py-3">Imagen</th>
                <th className="px-6 py-3">Icono/Emoji</th>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Descripción</th>
                <th className="px-6 py-3">Destacado</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCatalogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-foreground/60">No se encontraron catálogos.</td>
                </tr>
              ) : (
                filteredCatalogs.map((catalog: any) => (
                  <tr key={catalog.id} className="border-b border-primary/5 hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4">
                      {catalog.image_url ? (
                        <img src={catalog.image_url} alt={catalog.nombre} className="h-12 w-12 object-cover rounded-lg" />
                      ) : (
                        <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                          <Upload className="h-5 w-5 text-foreground/20" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-lg font-bold">{catalog.emoji || '✨'}</td>
                    <td className="px-6 py-4 font-medium">{catalog.nombre}</td>
                    <td className="px-6 py-4 text-foreground/60">{catalog.descripcion}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        catalog.destacado ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-150'
                      }`}>
                        {catalog.destacado ? 'Destacado' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setEditingCatalog(catalog)
                            setShowEditModal(true)
                          }}
                          className="p-2 text-foreground/60 hover:text-primary transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(catalog.id)}
                          className="p-2 text-foreground/60 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edición de Catálogo */}
      {showEditModal && editingCatalog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl max-w-2xl w-full shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Editar Catálogo</h2>
            <form onSubmit={async (e) => {
              e.preventDefault()
              setUploading(true)

              let image_url = editingCatalog.image_url

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

              const { error } = await supabase
                .from('catalogos')
                .update({
                  nombre: editingCatalog.nombre,
                  descripcion: editingCatalog.descripcion,
                  image_url: image_url,
                  destacado: editingCatalog.destacado ?? false,
                  emoji: editingCatalog.emoji || '✨',
                })
                .eq('id', editingCatalog.id)

              if (!error) {
                setModalMessage({ type: 'success', text: 'Catálogo actualizado exitosamente.' })
                setShowEditModal(false)
                setEditingCatalog(null)
                setEditFile(null)
                fetchCatalogs()
              } else {
                setModalMessage({ type: 'error', text: 'Error al actualizar catálogo: ' + error.message })
              }
              setUploading(false)
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre</label>
                  <input
                    type="text"
                    value={editingCatalog.nombre || ''}
                    onChange={(e) => setEditingCatalog({ ...editingCatalog, nombre: e.target.value })}
                    className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <input
                    type="text"
                    value={editingCatalog.descripcion || ''}
                    onChange={(e) => setEditingCatalog({ ...editingCatalog, descripcion: e.target.value })}
                    className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Emoji / Icono</label>
                  <input
                    type="text"
                    value={editingCatalog.emoji || ''}
                    onChange={(e) => setEditingCatalog({ ...editingCatalog, emoji: e.target.value })}
                    className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editingCatalog.destacado ?? false}
                      onChange={(e) => setEditingCatalog({ ...editingCatalog, destacado: e.target.checked })}
                      className="w-5 h-5 text-primary rounded border-primary/10 focus:ring-primary cursor-pointer"
                    />
                    Destacar como Categoría Destacada en el Home
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Imagen del Catálogo</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-primary/10 border-dashed rounded-lg hover:border-primary/30 transition-colors cursor-pointer"
                     onClick={() => document.getElementById('edit-catalog-file-input')?.click()}>
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
                    id="edit-catalog-file-input"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingCatalog(null)
                    setEditFile(null)
                  }}
                  className="px-4 py-2 border border-primary/10 rounded-lg text-sm hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover disabled:opacity-50"
                >
                  {uploading ? 'Guardando...' : 'Guardar Cambios'}
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
    </div>
  )
}
