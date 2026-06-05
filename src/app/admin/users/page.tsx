'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { UserPlus, AlertCircle, Edit } from 'lucide-react'

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'user',
    permissions: '[]',
  })
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  const availablePermissions = [
    { id: 'dashboard', label: 'Ver Dashboard' },
    { id: 'products', label: 'Gestionar Productos' },
    { id: 'catalogs', label: 'Gestionar Catálogos' },
    { id: 'users', label: 'Gestionar Usuarios' },
  ]

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)

    const { data } = await supabase.from('profiles').select('*')
    
    // Filter users: only show users created by current user
    const filtered = (data || []).filter((p: any) => {
      try {
        const perms = p.permissions
        return perms && perms.created_by === user?.id
      } catch (e) {
        return false
      }
    })
    
    setUsers(filtered)
    setLoading(false)
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 1. Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: newUser.email,
      password: newUser.password,
    })

    if (error) {
      alert('Error al crear usuario en Auth: ' + error.message)
      return
    }

    // 2. Create profile (upsert to handle if trigger already created it or not)
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').upsert([
        {
          id: data.user.id,
          email: newUser.email,
          role: newUser.role,
          permissions: {
            list: selectedPermissions,
            created_by: currentUser?.id,
          },
        },
      ])

      if (profileError) {
        alert('Error al crear perfil: ' + profileError.message)
      } else {
        alert('Usuario creado exitosamente.')
        setNewUser({ email: '', password: '', role: 'user', permissions: '[]' })
        setSelectedPermissions([])
        fetchUsers()
      }
    }
  }

  if (loading) return <div className="p-8">Cargando usuarios...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Usuarios y Permisos</h1>
      </div>

      {/* Formulario rápido */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/5 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-accent" />
          Crear Nuevo Usuario
        </h2>
        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Correo</label>
              <input
                type="email"
                placeholder="Correo"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contraseña</label>
              <input
                type="password"
                placeholder="Contraseña"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rol</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Permisos / Funciones</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availablePermissions.map((perm) => (
                <label key={perm.id} className="flex items-center gap-2 p-3 border border-primary/10 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPermissions([...selectedPermissions, perm.id])
                      } else {
                        setSelectedPermissions(selectedPermissions.filter(id => id !== perm.id))
                      }
                    }}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{perm.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white font-medium py-2 px-6 rounded-lg transition-colors w-full md:w-auto"
            >
              Crear Usuario
            </button>
          </div>
        </form>
      </div>

      {/* Sección Cambiar Mi Contraseña */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/5 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-accent" />
          Cambiar Mi Contraseña
        </h2>
        <form onSubmit={async (e) => {
          e.preventDefault()
          const password = (e.target as any).new_password.value
          const { error } = await supabase.auth.updateUser({ password })
          if (error) {
            alert('Error al cambiar contraseña: ' + error.message)
          } else {
            alert('Contraseña cambiada exitosamente.')
            ;(e.target as any).reset()
          }
        }} className="flex gap-4">
          <input
            type="password"
            name="new_password"
            placeholder="Nueva Contraseña"
            className="px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary flex-1"
            required
          />
          <button
            type="submit"
            className="bg-primary hover:bg-primary-hover text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Actualizar
          </button>
        </form>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white rounded-xl shadow-sm border border-primary/5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-foreground">
            <thead className="text-xs uppercase bg-muted/50 text-foreground/60">
              <tr>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Rol</th>
                <th className="px-6 py-3">Permisos</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-foreground/60">No hay usuarios registrados en la tabla de perfiles.</td>
                </tr>
              ) : (
                users.map((user: any) => (
                  <tr key={user.id} className="border-b border-primary/5 hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-medium">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-foreground/60'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground/60">{JSON.stringify(user.permissions?.list || [])}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setEditingUser(user)
                            setShowEditModal(true)
                          }}
                          className="p-2 text-foreground/60 hover:text-primary transition-colors"
                        >
                          <Edit className="h-4 w-4" />
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

      {/* Modal de Edición de Usuario */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>
            <form onSubmit={async (e) => {
              e.preventDefault()
              
              const { error } = await supabase
                .from('profiles')
                .update({
                  role: editingUser.role,
                  permissions: editingUser.permissions,
                })
                .eq('id', editingUser.id)

              if (!error) {
                alert('Usuario actualizado exitosamente.')
                setShowEditModal(false)
                setEditingUser(null)
                fetchUsers()
              } else {
                alert('Error al actualizar usuario: ' + error.message)
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rol</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full px-4 py-2 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Permisos / Funciones</label>
                <div className="grid grid-cols-2 gap-3">
                  {availablePermissions.map((perm) => (
                    <label key={perm.id} className="flex items-center gap-2 p-3 border border-primary/10 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={(editingUser.permissions?.list || []).includes(perm.id)}
                        onChange={(e) => {
                          const currentList = editingUser.permissions?.list || []
                          let newList = []
                          if (e.target.checked) {
                            newList = [...currentList, perm.id]
                          } else {
                            newList = currentList.filter((id: string) => id !== perm.id)
                          }
                          setEditingUser({ 
                            ...editingUser, 
                            permissions: { ...editingUser.permissions, list: newList } 
                          })
                        }}
                        className="h-4 w-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingUser(null)
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
    </div>
  )
}
