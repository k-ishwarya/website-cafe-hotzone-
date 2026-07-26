import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../api.js'

const CATS = ['Sandwich', 'Burger', 'Pizza', 'Fries', 'Mojito', 'Milkshake', 'Meat']
const emptyItem = { name: '', price: '', category: 'Sandwich', type: 'veg', image: '', desc: '' }

function Toast({ text }) {
  if (!text) return null
  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, background: '#22c55e', color: 'white',
      padding: '14px 22px', borderRadius: 12, fontWeight: 600, zIndex: 9999,
      boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
    }}>
      {text}
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [menuItems, setMenuItems] = useState([])
  const [toast, setToast] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState(emptyItem)

  const [editingId, setEditingId] = useState(null)
  const [editItemState, setEditItemState] = useState(emptyItem)

  const [showPwModal, setShowPwModal] = useState(false)
  const [cpOld, setCpOld] = useState('')
  const [cpNew, setCpNew] = useState('')
  const [cpConfirm, setCpConfirm] = useState('')
  const [cpError, setCpError] = useState('')
  const [cpSuccess, setCpSuccess] = useState('')
  const [showCpOld, setShowCpOld] = useState(false)
  const [showCpNew, setShowCpNew] = useState(false)
  const [showCpConfirm, setShowCpConfirm] = useState(false)

  const [showUserModal, setShowUserModal] = useState(false)
  const [cuNewUsername, setCuNewUsername] = useState('')
  const [cuError, setCuError] = useState('')
  const [cuSuccess, setCuSuccess] = useState('')

  const showMessage = (text) => {
    setToast(text)
    setTimeout(() => setToast(''), 2500)
  }

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    navigate('/')
  }, [navigate])

  const fetchMenu = useCallback(async () => {
    try {
      const res = await fetch(`${API}/menu`)
      setMenuItems(await res.json())
    } catch (err) {
      console.error('Error fetching menu:', err)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/admin/login')
      return
    }
    async function verifyAdmin() {
      try {
        const res = await fetch(`${API}/auth/verify`, {
          headers: { Authorization: 'Bearer ' + token },
        })
        if (!res.ok) {
          localStorage.removeItem('token')
          navigate('/admin/login')
          return
        }
        fetchMenu()
      } catch {
        showMessage('Cannot connect to server. Is it running? ❌')
      }
    }
    verifyAdmin()
  }, [navigate, fetchMenu])

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  })

  const handleSessionExpired = (res) => {
    if (res.status === 401) {
      showMessage('Session expired ❌')
      setTimeout(logout, 1200)
      return true
    }
    return false
  }

  const addItem = async () => {
    if (!localStorage.getItem('token')) { showMessage('Session expired ❌'); logout(); return }
    const item = { ...newItem, price: Number(newItem.price), available: true }
    if (!item.name.trim() || !item.price) { showMessage('Name and price are required ❌'); return }
    try {
      const res = await fetch(`${API}/menu`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(item) })
      if (handleSessionExpired(res)) return
      await fetchMenu()
      setNewItem(emptyItem)
      setShowAddForm(false)
      showMessage('Item Added ✅')
    } catch {
      showMessage('Error adding item ❌')
    }
  }

  const toggleAvail = async (id) => {
    const token = localStorage.getItem('token')
    if (!token) { logout(); return }
    const item = menuItems.find((i) => i._id === id)
    try {
      const res = await fetch(`${API}/menu/${id}`, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify({ available: !item.available }),
      })
      if (handleSessionExpired(res)) return
      await fetchMenu()
    } catch {
      showMessage('Error updating availability ❌')
    }
  }

  const deleteItem = async (id) => {
    if (!localStorage.getItem('token')) { logout(); return }
    if (!window.confirm('Delete this item?')) return
    try {
      const res = await fetch(`${API}/menu/${id}`, { method: 'DELETE', headers: authHeaders() })
      if (handleSessionExpired(res)) return
      await fetchMenu()
      showMessage('Item Deleted 🗑️')
    } catch {
      showMessage('Error deleting item ❌')
    }
  }

  const startEdit = (id) => {
    const item = menuItems.find((i) => i._id === id)
    if (!item) return
    setEditingId(id)
    setEditItemState({
      name: item.name, price: item.price, category: item.category,
      type: item.type, image: item.image || '', desc: item.desc || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const saveEdit = async () => {
    if (!localStorage.getItem('token')) { logout(); return }
    try {
      const res = await fetch(`${API}/menu/${editingId}`, {
        method: 'PATCH', headers: authHeaders(),
        body: JSON.stringify({ ...editItemState, name: editItemState.name.trim(), desc: editItemState.desc.trim(), image: editItemState.image.trim() }),
      })
      if (handleSessionExpired(res)) return
      setEditingId(null)
      showMessage('Item Updated ✔️')
      await fetchMenu()
    } catch {
      showMessage('Error saving changes ❌')
    }
  }

  const doChangePassword = async () => {
    setCpError(''); setCpSuccess('')
    if (!cpOld || !cpNew || !cpConfirm) { setCpError('Please fill in all fields'); return }
    if (cpNew.length < 8) { setCpError('New password must be at least 8 characters'); return }
    if (cpNew !== cpConfirm) { setCpError('Passwords do not match'); return }
    try {
      const res = await fetch(`${API}/auth/change-password`, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify({ oldPassword: cpOld, newPassword: cpNew }),
      })
      const data = await res.json()
      if (res.ok) {
        setCpSuccess('✅ Password updated!')
        setCpOld(''); setCpNew(''); setCpConfirm('')
        setTimeout(() => setShowPwModal(false), 1800)
      } else if (res.status === 401) {
        showMessage('Session expired ❌'); setTimeout(logout, 1200)
      } else {
        setCpError(data.msg || 'Failed')
      }
    } catch {
      setCpError('Cannot connect to server')
    }
  }

  const doChangeUsername = async () => {
    setCuError(''); setCuSuccess('')
    if (!cuNewUsername.trim()) { setCuError('Please enter a new username'); return }
    try {
      const res = await fetch(`${API}/auth/change-username`, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify({ newUsername: cuNewUsername.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        setCuSuccess('✅ Username updated! Logging out…')
        setTimeout(logout, 2000)
      } else if (res.status === 401) {
        showMessage('Session expired ❌'); setTimeout(logout, 1200)
      } else {
        setCuError(data.msg || 'Failed')
      }
    } catch {
      setCuError('Cannot connect to server')
    }
  }

  const CategoryOptions = () => CATS.map((c) => <option key={c} value={c}>{c}</option>)

  return (
    <div id="page-admin">
      <Toast text={toast} />
      <div className="admin-wrap">

        <div className="admin-header">
          <div className="admin-title">
            Menu Management
            <span className="item-count">— {menuItems.length} items</span>
          </div>
          <div className="admin-header-actions">
            <button className="btn btn-primary" onClick={() => setShowAddForm((s) => !s)}>＋ Add Item</button>
            <button className="btn btn-ghost" onClick={() => { setCpError(''); setCpSuccess(''); setCpOld(''); setCpNew(''); setCpConfirm(''); setShowPwModal(true) }}>🔑 Password</button>
            <button className="btn btn-ghost" onClick={() => { setCuError(''); setCuSuccess(''); setCuNewUsername(''); setShowUserModal(true) }}>👤 Username</button>
            <button className="btn btn-ghost" onClick={logout}>Logout</button>
          </div>
        </div>

        {showAddForm && (
          <div className="add-form">
            <div className="form-title">Add New Menu Item</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Item Name</label>
                <input type="text" placeholder="e.g. Veg Burger" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input type="number" placeholder="e.g. 80" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}>
                  <CategoryOptions />
                </select>
              </div>
              <div className="form-group">
                <label>Type</label>
                <select value={newItem.type} onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}>
                  <option value="veg">Vegetarian</option>
                  <option value="nonveg">Non-Vegetarian</option>
                  <option value="beverage">Beverage</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input type="text" placeholder="Paste image link" value={newItem.image} onChange={(e) => setNewItem({ ...newItem, image: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" placeholder="Short description" value={newItem.desc} onChange={(e) => setNewItem({ ...newItem, desc: e.target.value })} />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-success" onClick={addItem}>Save Item</button>
              <button className="btn btn-ghost" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {editingId && (
          <div className="add-form">
            <div className="form-title">Edit Menu Item</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={editItemState.name} onChange={(e) => setEditItemState({ ...editItemState, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input type="number" value={editItemState.price} onChange={(e) => setEditItemState({ ...editItemState, price: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={editItemState.category} onChange={(e) => setEditItemState({ ...editItemState, category: e.target.value })}>
                  <CategoryOptions />
                </select>
              </div>
              <div className="form-group">
                <label>Type</label>
                <select value={editItemState.type} onChange={(e) => setEditItemState({ ...editItemState, type: e.target.value })}>
                  <option value="veg">Veg</option>
                  <option value="nonveg">Non-Veg</option>
                  <option value="beverage">Beverages</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input type="text" value={editItemState.image} onChange={(e) => setEditItemState({ ...editItemState, image: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" value={editItemState.desc} onChange={(e) => setEditItemState({ ...editItemState, desc: e.target.value })} />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-success" onClick={saveEdit}>Save Changes</button>
              <button className="btn btn-ghost" onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </div>
        )}

        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item</th><th>Category</th><th>Price</th><th>Type</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="tbl-item-cell">
                      <img loading="lazy" className="tbl-thumb" src={item.image || '/img/default-food.png'} alt={item.name} />
                      <span className="tbl-item-name">{item.name}</span>
                    </div>
                  </td>
                  <td>{item.category}</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{item.price}</td>
                  <td>
                    <span className="type-badge">
                      <span style={{ color: item.type === 'veg' ? '#22c55e' : item.type === 'nonveg' ? '#ef4444' : '#3b82f6' }}>●</span>
                      {item.type === 'veg' ? 'Veg' : item.type === 'nonveg' ? 'Non-Veg' : 'Beverage'}
                    </span>
                  </td>
                  <td>
                    <span className="status-badge">
                      <span className={`status-dot ${item.available ? 'on' : 'off'}`}></span>
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <label className="switch">
                        <input type="checkbox" checked={item.available} onChange={() => toggleAvail(item._id)} />
                        <span className="slider"></span>
                      </label>
                      <button className="tbl-btn btn-edit" onClick={() => startEdit(item._id)}>Edit</button>
                      <button className="tbl-btn btn-delete" onClick={() => deleteItem(item._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPwModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowPwModal(false)}>
          <div className="modal-card">
            <div className="form-title">🔑 Change Password</div>
            {cpError && <div className="login-error">{cpError}</div>}
            {cpSuccess && <div className="login-success">{cpSuccess}</div>}
            <div className="form-group">
              <label>Current Password</label>
              <div className="password-wrap">
                <input
                  type={showCpOld ? 'text' : 'password'}
                  placeholder="Current password"
                  value={cpOld}
                  onChange={(e) => setCpOld(e.target.value)}
                />
                <span
                  className="toggle-pass"
                  style={{ color: showCpOld ? '#ff6200' : '#888' }}
                  onClick={() => setShowCpOld((s) => !s)}
                >
                  <i className={`fa-solid ${showCpOld ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </span>
              </div>
            </div>
            <div className="form-group">
              <label>New Password</label>
              <div className="password-wrap">
                <input
                  type={showCpNew ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={cpNew}
                  onChange={(e) => setCpNew(e.target.value)}
                />
                <span
                  className="toggle-pass"
                  style={{ color: showCpNew ? '#ff6200' : '#888' }}
                  onClick={() => setShowCpNew((s) => !s)}
                >
                  <i className={`fa-solid ${showCpNew ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </span>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label>Confirm New Password</label>
              <div className="password-wrap">
                <input
                  type={showCpConfirm ? 'text' : 'password'}
                  placeholder="Repeat new password"
                  value={cpConfirm}
                  onChange={(e) => setCpConfirm(e.target.value)}
                />
                <span
                  className="toggle-pass"
                  style={{ color: showCpConfirm ? '#ff6200' : '#888' }}
                  onClick={() => setShowCpConfirm((s) => !s)}
                >
                  <i className={`fa-solid ${showCpConfirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary full-btn" onClick={doChangePassword}>Update Password</button>
              <button className="btn btn-ghost" style={{ minWidth: 90 }} onClick={() => setShowPwModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showUserModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowUserModal(false)}>
          <div className="modal-card">
            <div className="form-title">👤 Change Username</div>
            {cuError && <div className="login-error">{cuError}</div>}
            {cuSuccess && <div className="login-success">{cuSuccess}</div>}
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label>New Username</label>
              <input type="text" placeholder="New username" value={cuNewUsername} onChange={(e) => setCuNewUsername(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary full-btn" onClick={doChangeUsername}>Update Username</button>
              <button className="btn btn-ghost" style={{ minWidth: 90 }} onClick={() => setShowUserModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
