'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  MapPin, 
  Clock, 
  Globe, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react'

export default function TiendasAdmin() {
  const [tiendas, setTiendas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTienda, setEditingTienda] = useState<any>(null)
  
  // Form state
  const [nombre, setNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [horario, setHorario] = useState('8:00 AM - 10:00 PM (Lunes a Domingo)')
  const [ubicacionMapa, setUbicacionMapa] = useState('')
  const [activo, setActivo] = useState(true)

  // Feedback messages
  const [modalMessage, setModalMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetchTiendas()
  }, [])

  const fetchTiendas = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('tiendas')
        .select('*')
        .eq('empresa', 'farmatuya')
        .order('nombre', { ascending: true })
      if (error) throw error
      setTiendas(data || [])
    } catch (err) {
      console.error('Error fetching stores:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCreate = () => {
    setEditingTienda(null)
    setNombre('')
    setDireccion('')
    setHorario('8:00 AM - 10:00 PM (Lunes a Domingo)')
    setUbicacionMapa('')
    setActivo(true)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (tienda: any) => {
    setEditingTienda(tienda)
    setNombre(tienda.nombre || '')
    setDireccion(tienda.direccion || '')
    setHorario(tienda.horario || '')
    setUbicacionMapa(tienda.ubicacion_mapa || '')
    setActivo(tienda.activo !== false)
    setIsFormOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const storePayload = {
      empresa: 'farmatuya',
      nombre,
      direccion,
      horario,
      ubicacion_mapa: ubicacionMapa || null,
      activo
    }

    try {
      if (editingTienda) {
        const { error } = await supabase
          .from('tiendas')
          .update(storePayload)
          .eq('id', editingTienda.id)
        if (error) throw error
        setModalMessage({ type: 'success', text: 'Sede/Tienda actualizada exitosamente.' })
      } else {
        const { error } = await supabase
          .from('tiendas')
          .insert([storePayload])
        if (error) throw error
        setModalMessage({ type: 'success', text: 'Nueva Sede/Tienda registrada exitosamente.' })
      }
      setIsFormOpen(false)
      fetchTiendas()
    } catch (err: any) {
      console.error('Error saving store:', err)
      setModalMessage({ type: 'error', text: 'Error al guardar sede: ' + err.message })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta sede/tienda de forma permanente?')) return
    try {
      const { error } = await supabase
        .from('tiendas')
        .delete()
        .eq('id', id)
      if (error) throw error
      setModalMessage({ type: 'success', text: 'Sede/Tienda eliminada exitosamente.' })
      fetchTiendas()
    } catch (err: any) {
      console.error('Error deleting store:', err)
      setModalMessage({ type: 'error', text: 'Error al eliminar sede: ' + err.message })
    }
  }

  const handleToggleActivo = async (tienda: any) => {
    try {
      const { error } = await supabase
        .from('tiendas')
        .update({ activo: !tienda.activo })
        .eq('id', tienda.id)
      if (error) throw error
      fetchTiendas()
    } catch (err) {
      console.error('Error toggling store status:', err)
    }
  }

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">Nuestras Tiendas (Sedes)</h1>
          <p className="text-sm text-slate-500 font-medium">Gestiona las ubicaciones y horarios de atención al público de FarmaTuya.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-hover text-white font-bold py-3 px-6 rounded-full shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus className="h-5 w-5" />
          Nueva Sede / Tienda
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl max-w-2xl animate-fade-in">
          <form onSubmit={handleSave} className="space-y-5">
            <h3 className="text-lg font-black text-slate-800 border-b pb-3 mb-2 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-brand-green" />
              {editingTienda ? 'Editar Sede / Tienda' : 'Agregar Nueva Sede / Tienda'}
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Nombre de la Sede</label>
              <input 
                type="text" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-green/20 focus:bg-white rounded-xl p-3 text-sm outline-none font-medium transition-colors"
                placeholder="ej. Sede Las Mercedes"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Dirección Completa (Ubicación)</label>
              <textarea 
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-green/20 focus:bg-white rounded-xl p-3 text-sm outline-none font-medium transition-colors h-24 resize-none"
                placeholder="ej. Calle Madrid, Edif. FarmaTuya, Las Mercedes, Caracas."
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Horario de Atención</label>
                <input 
                  type="text" 
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-green/20 focus:bg-white rounded-xl p-3 text-sm outline-none font-medium transition-colors"
                  placeholder="ej. 8:00 AM - 10:00 PM (Lunes a Domingo)"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Enlace Google Maps (Opcional)</label>
                <input 
                  type="url" 
                  value={ubicacionMapa}
                  onChange={(e) => setUbicacionMapa(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-green/20 focus:bg-white rounded-xl p-3 text-sm outline-none font-medium transition-colors"
                  placeholder="ej. https://maps.google.com/..."
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                  className="w-5.5 h-5.5 text-brand-green border-slate-350 focus:ring-brand-green rounded-lg cursor-pointer"
                />
                Activa / Mostrar en la Página Web
              </label>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <button 
                type="submit" 
                className="flex-grow bg-brand-blue hover:bg-brand-blue-mid text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer"
              >
                {editingTienda ? 'Guardar Cambios' : 'Registrar Sede'}
              </button>
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 px-6 rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Listado de Sedes */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-black text-slate-800 flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-blue" />
            Sedes Registradas
          </h3>
          <span className="text-xs bg-slate-200 text-slate-600 font-extrabold uppercase px-3 py-1 rounded-full">
            {tiendas.length} Ubicaciones
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 font-bold">Cargando sedes...</div>
        ) : tiendas.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-bold">No hay tiendas o sedes registradas en FarmaTuya. ¡Crea una nueva!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-black text-slate-400 uppercase bg-slate-50/50">
                  <th className="p-4">Sede</th>
                  <th className="p-4">Dirección</th>
                  <th className="p-4">Horario</th>
                  <th className="p-4">Ubicación (Mapa)</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-600">
                {tiendas.map((tienda) => (
                  <tr key={tienda.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">{tienda.nombre}</td>
                    <td className="p-4 max-w-xs truncate" title={tienda.direccion}>{tienda.direccion}</td>
                    <td className="p-4 text-slate-500 font-medium flex items-center gap-1.5 mt-2.5">
                      <Clock className="w-4 h-4 text-brand-green" />
                      {tienda.horario}
                    </td>
                    <td className="p-4">
                      {tienda.ubicacion_mapa ? (
                        <a 
                          href={tienda.ubicacion_mapa} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs font-bold text-brand-blue hover:text-brand-green hover:underline flex items-center gap-1"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          Ver enlace
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No especificada</span>
                      )}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActivo(tienda)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold cursor-pointer border transition-colors ${
                          tienda.activo !== false
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                        }`}
                      >
                        {tienda.activo !== false ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Activa
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5" />
                            Inactiva
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(tienda)}
                          className="p-2 hover:bg-brand-blue/10 rounded-xl text-brand-blue hover:text-brand-blue-mid transition-all cursor-pointer border border-transparent hover:border-brand-blue/20"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tienda.id)}
                          className="p-2 hover:bg-red-50 rounded-xl text-red-500 hover:text-red-650 transition-all cursor-pointer border border-transparent hover:border-red-100"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Feedback modal */}
      {modalMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full shadow-2xl text-center">
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
              } transition-colors cursor-pointer`}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
