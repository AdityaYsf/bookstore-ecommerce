import { useEffect, useState } from 'react'
import { Search, Eye, X, Shield, ShieldOff, Trash2, Users, UserCheck, UserX, Crown, AlertTriangle } from 'lucide-react'
import api from "../../../services/api"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');

  :root {
    --navy:        #0f1e42;
    --navy-mid:    #1a2f5e;
    --navy-lt:     #253a6e;
    --navy-pale:   #dde4f5;
    --copper:      #d4823a;
    --copper-dk:   #b06828;
    --copper-lt:   #e8a060;
    --copper-pale: #fdecd8;
    --green:       #2d6a4f;
    --green-pale:  #d8f3e8;
    --blue:        #2563eb;
    --blue-pale:   #dbeafe;
    --blue-mid:    #3b82f6;
    --bg-page:     #f5f7ff;
    --bg-card:     #ffffff;
    --bg-soft:     #eef1fb;
    --bg-mid:      #e4e9f7;
    --border:      rgba(15,30,66,0.1);
    --border-lt:   rgba(15,30,66,0.06);
    --ink2:        #3a4a6e;
    --ink3:        #6272a0;
    --ink4:        #9aa3c2;
  }

  .au-root {
    font-family: 'Poppins', sans-serif;
    background: var(--bg-page);
    color: var(--navy);
    min-height: 100vh;
  }

  /* ══ HEADER ══ */
  .au-header {
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 55%, var(--navy-lt) 100%);
    padding: 2.5rem clamp(1.5rem, 5vw, 4rem) 2.25rem;
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 1.5rem;
    flex-wrap: wrap; position: relative; overflow: hidden;
  }
  .au-header::before {
    content: 'USER';
    position: absolute; right: clamp(1rem, 4vw, 3rem); bottom: -0.75rem;
    font-family: 'Poppins', sans-serif;
    font-size: clamp(4rem, 10vw, 8rem); font-weight: 900;
    color: rgba(255,255,255,0.03); letter-spacing: -0.02em;
    line-height: 1; pointer-events: none; user-select: none;
  }
  .au-header::after {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 45% 80% at 85% 50%, rgba(212,130,58,0.12) 0%, transparent 60%);
    pointer-events: none;
  }

  .au-header-left { position: relative; z-index: 2; }
  .au-header-eyebrow {
    font-size: 0.67rem; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--copper-lt); margin-bottom: 0.5rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .au-header-eyebrow::before { content: ''; display: block; width: 1.5rem; height: 1px; background: var(--copper-lt); }
  .au-header-title {
    font-size: clamp(1.6rem, 4vw, 2.4rem);
    font-weight: 800; color: #fff; line-height: 1.1;
  }
  .au-header-title em { font-style: italic; color: var(--copper-lt); }

  /* ══ STATS / FILTER TABS ══ */
  .au-stats {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 0; background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    box-shadow: 0 2px 12px rgba(15,30,66,0.06);
  }
  @media (max-width: 768px) { .au-stats { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 400px) { .au-stats { grid-template-columns: 1fr; } }

  .au-stat {
    padding: 1.2rem 1.4rem;
    display: flex; align-items: center; gap: 0.9rem;
    cursor: pointer; transition: background 0.2s;
    border-right: 1px solid var(--border);
    position: relative;
  }
  .au-stat:last-child { border-right: none; }
  .au-stat::after {
    content: ''; position: absolute; bottom: 0; left: 0;
    width: 0; height: 3px; transition: width 0.35s ease;
  }
  .au-stat:hover { background: var(--bg-soft); }
  .au-stat:hover::after { width: 100%; }
  .au-stat.active { background: var(--bg-soft); }
  .au-stat.active::after { width: 100%; }

  .au-stat-all::after    { background: linear-gradient(90deg, var(--copper), var(--copper-lt)); }
  .au-stat-member::after { background: linear-gradient(90deg, var(--green), #4ade80); }
  .au-stat-admin::after  { background: linear-gradient(90deg, var(--blue), var(--blue-mid)); }
  .au-stat-new::after    { background: linear-gradient(90deg, #e879f9, #a855f7); }

  .au-stat-icon {
    width: 36px; height: 36px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all 0.25s;
  }
  .au-stat:hover .au-stat-icon, .au-stat.active .au-stat-icon { transform: scale(1.08); }

  .au-stat-icon-all    { background: var(--copper-pale); color: var(--copper-dk); }
  .au-stat-icon-member { background: var(--green-pale);  color: var(--green); }
  .au-stat-icon-admin  { background: var(--blue-pale);   color: var(--blue); }
  .au-stat-icon-new    { background: #fdf4ff;             color: #a855f7; }

  .au-stat-value {
    font-size: 1.4rem; font-weight: 800; color: var(--navy); line-height: 1;
    letter-spacing: -0.02em;
  }
  .au-stat-label {
    font-size: 0.63rem; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--ink4); margin-top: 0.15rem;
  }
  .au-stat.active .au-stat-label { color: var(--ink3); }
  .au-stat.active .au-stat-value { color: var(--navy); }

  /* ══ TOOLBAR ══ */
  .au-toolbar {
    padding: 1rem clamp(1.5rem, 5vw, 4rem);
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center;
    justify-content: space-between; gap: 1rem; flex-wrap: wrap;
    position: sticky; top: 66px; z-index: 89;
    box-shadow: 0 2px 8px rgba(15,30,66,0.04);
  }
  .au-search-wrap { position: relative; flex: 1; max-width: 360px; }
  .au-search-icon {
    position: absolute; left: 0.9rem; top: 50%;
    transform: translateY(-50%); color: var(--ink4); pointer-events: none;
    transition: color 0.2s;
  }
  .au-search-wrap:focus-within .au-search-icon { color: var(--copper); }
  .au-search-input {
    width: 100%; background: var(--bg-soft);
    border: 1.5px solid var(--border); color: var(--navy);
    font-family: 'Poppins', sans-serif; font-size: 0.85rem;
    padding: 0.68rem 1rem 0.68rem 2.75rem;
    border-radius: 9px; outline: none;
    transition: all 0.2s; box-sizing: border-box;
  }
  .au-search-input::placeholder { color: var(--ink4); }
  .au-search-input:focus {
    background: var(--bg-card);
    border-color: var(--copper);
    box-shadow: 0 0 0 3px rgba(212,130,58,0.1);
  }
  .au-count { font-size: 0.78rem; color: var(--ink3); }
  .au-count strong { color: var(--navy); font-weight: 700; }

  /* ══ MAIN ══ */
  .au-main {
    padding: 1.75rem clamp(1.5rem, 5vw, 4rem);
    max-width: 1400px; margin: 0 auto;
  }

  /* ══ TABLE ══ */
  .au-table-wrap {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 14px; overflow: hidden;
    box-shadow: 0 2px 12px rgba(15,30,66,0.06);
  }
  .au-table-scroll { overflow-x: auto; }
  .au-table { width: 100%; border-collapse: collapse; }

  .au-table thead tr {
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
  }
  .au-table thead th {
    padding: 0.9rem 1.2rem; text-align: left;
    font-size: 0.62rem; font-weight: 700;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: rgba(200,215,255,0.55); white-space: nowrap;
  }
  .au-table thead th:last-child { text-align: right; }

  .au-table tbody tr {
    border-bottom: 1px solid var(--border-lt); transition: background 0.15s;
  }
  .au-table tbody tr:last-child { border-bottom: none; }
  .au-table tbody tr:hover { background: var(--bg-soft); }

  .au-table td {
    padding: 0.95rem 1.2rem; font-size: 0.84rem;
    color: var(--navy); vertical-align: middle;
  }

  /* Avatar */
  .au-avatar-wrap { display: flex; align-items: center; gap: 0.85rem; }
  .au-avatar {
    width: 38px; height: 38px; border-radius: 9px;
    background: var(--navy-pale); color: var(--navy-mid);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem; font-weight: 800; flex-shrink: 0;
  }
  .au-avatar.admin {
    background: var(--blue-pale); color: var(--blue);
  }
  .au-user-name { font-weight: 600; font-size: 0.86rem; color: var(--navy); }
  .au-user-id   { font-size: 0.68rem; color: var(--ink4); margin-top: 0.1rem; }

  /* Email */
  .au-email { font-size: 0.8rem; color: var(--ink3); }

  /* Role badge */
  .au-role-badge {
    display: inline-flex; align-items: center; gap: 0.32rem;
    font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 0.24rem 0.65rem; border-radius: 100px;
  }
  .au-role-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
  .au-role-USER  { background: var(--green-pale); color: var(--green); }
  .au-role-ADMIN { background: var(--blue-pale);  color: var(--blue); }

  /* Date */
  .au-date { font-size: 0.77rem; color: var(--ink3); }

  /* Orders count */
  .au-orders-count { font-weight: 800; font-size: 0.92rem; color: var(--navy); }

  /* Action buttons */
  .au-actions-cell { text-align: right; white-space: nowrap; }
  .au-action-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 8px;
    border: 1.5px solid var(--border); background: var(--bg-soft);
    cursor: pointer; color: var(--ink3); margin-left: 0.35rem;
    transition: all 0.2s;
  }
  .au-action-btn.view:hover    { border-color: rgba(212,130,58,0.4); background: var(--copper-pale); color: var(--copper-dk); }
  .au-action-btn.promote:hover { border-color: rgba(37,99,235,0.3);  background: var(--blue-pale);   color: var(--blue); }
  .au-action-btn.demote:hover  { border-color: rgba(212,130,58,0.4); background: var(--copper-pale); color: var(--copper-dk); }
  .au-action-btn.del:hover     { border-color: rgba(220,38,38,0.3);  background: #fff5f5; color: #dc2626; }

  /* Empty */
  .au-empty {
    padding: 4.5rem 2rem; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 0.65rem;
  }
  .au-empty-icon {
    width: 58px; height: 58px; background: var(--bg-soft);
    border: 1px solid var(--border); border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    color: var(--ink4); margin-bottom: 0.2rem;
  }
  .au-empty-title { font-size: 1rem; font-weight: 700; color: var(--ink2); }
  .au-empty-desc  { font-size: 0.78rem; color: var(--ink4); }

  /* Skeleton */
  .au-skeleton-bar {
    background: var(--bg-mid); border-radius: 6px; height: 13px;
    position: relative; overflow: hidden;
  }
  .au-skeleton-bar::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%);
    animation: shimmer 1.4s infinite;
  }
  @keyframes shimmer { from{transform:translateX(-100%)} to{transform:translateX(100%)} }

  /* ══ DETAIL MODAL ══ */
  .au-overlay {
    position: fixed; inset: 0;
    background: rgba(15,30,66,0.5); backdrop-filter: blur(5px);
    display: flex; align-items: center; justify-content: center;
    padding: 1.5rem; z-index: 200; animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }

  .au-modal {
    background: var(--bg-card); width: 100%; max-width: 540px;
    max-height: 92svh; display: flex; flex-direction: column;
    border-radius: 16px; border: 1px solid var(--border);
    box-shadow: 0 24px 60px rgba(15,30,66,0.2);
    animation: modalIn 0.25s cubic-bezier(0.16,1,0.3,1);
    overflow: hidden;
  }
  @keyframes modalIn {
    from{opacity:0;transform:translateY(16px) scale(0.98)}
    to  {opacity:1;transform:translateY(0)    scale(1)}
  }

  .au-modal-header {
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    padding: 1.4rem 1.75rem;
    display: flex; align-items: center;
    justify-content: space-between; gap: 1rem; flex-shrink: 0;
    position: relative; overflow: hidden;
  }
  .au-modal-header::after {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 80% at 90% 50%, rgba(212,130,58,0.1) 0%, transparent 70%);
    pointer-events: none;
  }
  .au-modal-title {
    font-size: 1.05rem; font-weight: 700; color: #fff;
    position: relative; z-index: 1;
  }
  .au-modal-title em { font-style: italic; color: var(--copper-lt); }
  .au-modal-close {
    width: 32px; height: 32px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 8px; cursor: pointer;
    color: rgba(200,215,255,0.6);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; position: relative; z-index: 1;
  }
  .au-modal-close:hover { background: rgba(220,38,38,0.2); border-color: rgba(220,38,38,0.3); color: #fca5a5; }

  .au-modal-body { padding: 1.6rem 1.75rem; overflow-y: auto; flex: 1; }

  /* Modal user card */
  .au-modal-user-card {
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    padding: 1.4rem;
    display: flex; align-items: center; gap: 1.2rem;
    margin-bottom: 1.6rem; border-radius: 12px;
    position: relative; overflow: hidden;
  }
  .au-modal-user-card::after {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 80% at 90% 50%, rgba(212,130,58,0.1) 0%, transparent 70%);
    pointer-events: none;
  }
  .au-modal-avatar {
    width: 52px; height: 52px; border-radius: 11px;
    background: rgba(221,228,245,0.15); color: #dde4f5;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; font-weight: 800; flex-shrink: 0;
    border: 1px solid rgba(255,255,255,0.12);
    position: relative; z-index: 1;
  }
  .au-modal-avatar.admin { background: rgba(219,234,254,0.15); color: #93c5fd; }
  .au-modal-name {
    font-size: 1rem; font-weight: 700; color: #fff;
    margin-bottom: 0.22rem; position: relative; z-index: 1;
  }
  .au-modal-email { font-size: 0.78rem; color: rgba(200,215,255,0.5); position: relative; z-index: 1; }

  /* Section label */
  .au-section-label {
    font-size: 0.63rem; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--copper-dk); margin-bottom: 0.9rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .au-section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  /* Detail grid */
  .au-detail-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 0.6rem; margin-bottom: 1.5rem;
  }
  .au-detail-cell {
    background: var(--bg-soft);
    border: 1px solid var(--border-lt);
    padding: 0.85rem 1rem; border-radius: 9px;
  }
  .au-detail-cell-label {
    font-size: 0.63rem; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--ink4); margin-bottom: 0.28rem;
  }
  .au-detail-cell-value { font-size: 0.86rem; font-weight: 600; color: var(--navy); }

  /* Role section */
  .au-role-section {
    background: var(--bg-soft); border: 1px solid var(--border);
    padding: 1.1rem 1.2rem; border-radius: 10px; margin-bottom: 1.2rem;
  }
  .au-role-section-title {
    font-size: 0.75rem; font-weight: 500; color: var(--ink3); margin-bottom: 0.9rem;
  }
  .au-role-section-title strong { color: var(--navy); font-weight: 700; }
  .au-role-btns { display: flex; gap: 0.65rem; flex-wrap: wrap; }

  .au-role-btn {
    display: inline-flex; align-items: center; gap: 0.45rem;
    font-family: 'Poppins', sans-serif; font-size: 0.78rem;
    font-weight: 600;
    border: 1.5px solid var(--border); background: var(--bg-card);
    color: var(--ink2); padding: 0.58rem 1rem; border-radius: 8px;
    cursor: pointer; transition: all 0.2s;
  }
  .au-role-btn.promote:hover { border-color: rgba(37,99,235,0.35); background: var(--blue-pale); color: var(--blue); }
  .au-role-btn.demote:hover  { border-color: rgba(212,130,58,0.35); background: var(--copper-pale); color: var(--copper-dk); }
  .au-role-btn.danger { border-color: rgba(220,38,38,0.25); color: #dc2626; }
  .au-role-btn.danger:hover { border-color: rgba(220,38,38,0.4); background: #fff5f5; }
  .au-role-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .au-role-btn:disabled:hover { border-color: var(--border); background: var(--bg-card); color: var(--ink2); }

  /* ══ CONFIRM ══ */
  .au-confirm-overlay {
    position: fixed; inset: 0; background: rgba(15,30,66,0.55);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 1.5rem; z-index: 300; animation: fadeIn 0.15s ease;
  }
  .au-confirm-box {
    background: var(--bg-card); padding: 2rem;
    max-width: 380px; width: 100%; border-radius: 16px;
    border: 1px solid var(--border);
    box-shadow: 0 20px 50px rgba(15,30,66,0.2);
    animation: modalIn 0.2s ease; text-align: center;
  }
  .au-confirm-icon {
    width: 52px; height: 52px; background: #fff5f5; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    color: #dc2626; margin: 0 auto 1.2rem;
  }
  .au-confirm-title { font-size: 1.05rem; font-weight: 800; color: var(--navy); margin-bottom: 0.5rem; }
  .au-confirm-desc  { font-size: 0.82rem; color: var(--ink3); margin-bottom: 1.6rem; line-height: 1.65; }
  .au-confirm-name  { font-weight: 700; color: var(--navy); }
  .au-confirm-btns  { display: flex; gap: 0.75rem; justify-content: center; }
  .au-confirm-cancel {
    padding: 0.65rem 1.4rem; border: 1.5px solid var(--border);
    background: var(--bg-soft); color: var(--ink2);
    font-family: 'Poppins', sans-serif; font-size: 0.82rem; font-weight: 500;
    cursor: pointer; border-radius: 8px; transition: all 0.2s;
  }
  .au-confirm-cancel:hover { border-color: var(--navy); color: var(--navy); background: var(--navy-pale); }
  .au-confirm-delete {
    padding: 0.65rem 1.4rem; background: #dc2626; color: #fff;
    border: none; font-family: 'Poppins', sans-serif;
    font-size: 0.82rem; font-weight: 700;
    cursor: pointer; border-radius: 8px;
    transition: all 0.2s; box-shadow: 0 3px 10px rgba(220,38,38,0.3);
  }
  .au-confirm-delete:hover { background: #b91c1c; box-shadow: 0 5px 14px rgba(220,38,38,0.4); transform: translateY(-1px); }
`

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('')

const isNew = (createdAt) => {
  if (!createdAt) return false
  return (Date.now() - new Date(createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000
}

const FILTER_TABS = [
  { key: 'ALL',   label: 'Semua Anggota', iconClass: 'au-stat-icon-all',    statClass: 'au-stat-all',    icon: Users },
  { key: 'USER',  label: 'Member',        iconClass: 'au-stat-icon-member', statClass: 'au-stat-member', icon: UserCheck },
  { key: 'ADMIN', label: 'Admin',         iconClass: 'au-stat-icon-admin',  statClass: 'au-stat-admin',  icon: Crown },
  { key: 'NEW',   label: 'Baru (30 hari)',iconClass: 'au-stat-icon-new',    statClass: 'au-stat-new',    icon: UserX },
]

const AdminUsers = () => {
  const [users, setUsers]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [searchQuery, setSearchQuery]   = useState('')
  const [filterTab, setFilterTab]       = useState('ALL')
  const [selectedUser, setSelectedUser] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId]     = useState(null)
  const [confirmDeleteName, setConfirmDeleteName] = useState('')

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/admin/users')
      setUsers(data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}`, { role: newRole })
      await fetchUsers()
      if (selectedUser?.id === userId) setSelectedUser(prev => ({ ...prev, role: newRole }))
    } catch (err) { alert(err.response?.data?.message || 'Gagal mengubah role') }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/users/${confirmDeleteId}`)
      setConfirmDeleteId(null); setConfirmDeleteName(''); setSelectedUser(null)
      await fetchUsers()
    } catch (err) { alert(err.response?.data?.message || 'Gagal menghapus pengguna') }
  }

  const counts = {
    ALL:   users.length,
    USER:  users.filter(u => u.role === 'USER').length,
    ADMIN: users.filter(u => u.role === 'ADMIN').length,
    NEW:   users.filter(u => isNew(u.createdAt)).length,
  }

  const filtered = users.filter(u => {
    const matchTab =
      filterTab === 'ALL' ? true :
      filterTab === 'NEW' ? isNew(u.createdAt) :
      u.role === filterTab
    const q = searchQuery.toLowerCase()
    const matchSearch = !q ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.id?.toString().includes(q)
    return matchTab && matchSearch
  })

  return (
    <div className="au-root">
      <style>{styles}</style>

      {/* HEADER */}
      <div className="au-header">
        <div className="au-header-left">
          <div className="au-header-eyebrow">Panel Admin</div>
          <h1 className="au-header-title">Kelola <em>Anggota</em></h1>
        </div>
      </div>

      {/* STAT TABS */}
      <div className="au-stats">
        {FILTER_TABS.map(tab => {
          const Icon = tab.icon
          return (
            <div
              key={tab.key}
              className={`au-stat ${tab.statClass} ${filterTab === tab.key ? 'active' : ''}`}
              onClick={() => setFilterTab(tab.key)}
            >
              <div className={`au-stat-icon ${tab.iconClass}`}><Icon size={15} /></div>
              <div>
                <div className="au-stat-value">{counts[tab.key]}</div>
                <div className="au-stat-label">{tab.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* TOOLBAR */}
      <div className="au-toolbar">
        <div className="au-search-wrap">
          <Search size={15} className="au-search-icon" />
          <input
            type="text"
            placeholder="Cari nama, email, atau ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="au-search-input"
          />
        </div>
        <span className="au-count"><strong>{filtered.length}</strong> anggota ditemukan</span>
      </div>

      {/* MAIN */}
      <div className="au-main">
        <div className="au-table-wrap">
          <div className="au-table-scroll">
            <table className="au-table">
              <thead>
                <tr>
                  <th>Anggota</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Bergabung</th>
                  <th>Pesanan</th>
                  <th style={{textAlign:'right'}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{display:'flex',gap:'0.85rem',alignItems:'center'}}>
                          <div style={{width:38,height:38,background:'var(--bg-mid)',borderRadius:9,flexShrink:0}} />
                          <div style={{flex:1,display:'flex',flexDirection:'column',gap:'0.4rem'}}>
                            <div className="au-skeleton-bar" style={{width:'60%'}} />
                            <div className="au-skeleton-bar" style={{width:'35%',height:10}} />
                          </div>
                        </div>
                      </td>
                      {[1,2,3,4,5].map(j => (
                        <td key={j}><div className="au-skeleton-bar" style={{width: j===4?'30%':'65%'}} /></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6}>
                    <div className="au-empty">
                      <div className="au-empty-icon"><Users size={26} /></div>
                      <div className="au-empty-title">Tidak Ada Anggota</div>
                      <div className="au-empty-desc">
                        {searchQuery ? `Tidak ditemukan hasil untuk "${searchQuery}"` : 'Belum ada anggota terdaftar'}
                      </div>
                    </div>
                  </td></tr>
                ) : filtered.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="au-avatar-wrap">
                        <div className={`au-avatar ${user.role === 'ADMIN' ? 'admin' : ''}`}>
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <div className="au-user-name">{user.name}</div>
                          <div className="au-user-id">ID #{user.id?.toString().padStart(4, '0')}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="au-email">{user.email}</span></td>
                    <td>
                      <span className={`au-role-badge au-role-${user.role}`}>
                        <span className="au-role-badge-dot" />
                        {user.role === 'ADMIN' ? 'Admin' : 'Member'}
                      </span>
                    </td>
                    <td><span className="au-date">{formatDate(user.createdAt)}</span></td>
                    <td><span className="au-orders-count">{user._count?.orders ?? user.ordersCount ?? 0}</span></td>
                    <td className="au-actions-cell">
                      <button className="au-action-btn view"    title="Lihat Detail"  onClick={() => setSelectedUser(user)}><Eye size={13} /></button>
                      {user.role === 'USER'
                        ? <button className="au-action-btn promote" title="Jadikan Admin"  onClick={() => handleRoleChange(user.id, 'ADMIN')}><Shield size={13} /></button>
                        : <button className="au-action-btn demote"  title="Cabut Admin"    onClick={() => handleRoleChange(user.id, 'USER')}><ShieldOff size={13} /></button>
                      }
                      <button className="au-action-btn del" title="Hapus Anggota" onClick={() => { setConfirmDeleteId(user.id); setConfirmDeleteName(user.name) }}><Trash2 size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ══ DETAIL MODAL ══ */}
      {selectedUser && (
        <div className="au-overlay" onClick={e => e.target === e.currentTarget && setSelectedUser(null)}>
          <div className="au-modal">
            <div className="au-modal-header">
              <div className="au-modal-title">Detail <em>Anggota</em></div>
              <button className="au-modal-close" onClick={() => setSelectedUser(null)}><X size={15} /></button>
            </div>

            <div className="au-modal-body">
              {/* User card */}
              <div className="au-modal-user-card">
                <div className={`au-modal-avatar ${selectedUser.role === 'ADMIN' ? 'admin' : ''}`}>
                  {getInitials(selectedUser.name)}
                </div>
                <div>
                  <div className="au-modal-name">{selectedUser.name}</div>
                  <div className="au-modal-email">{selectedUser.email}</div>
                </div>
              </div>

              {/* Info grid */}
              <div className="au-section-label">Informasi Akun</div>
              <div className="au-detail-grid">
                {[
                  ['ID Anggota',      `#${selectedUser.id?.toString().padStart(4, '0')}`],
                  ['Role',            selectedUser.role === 'ADMIN' ? 'Administrator' : 'Member'],
                  ['Bergabung',       formatDate(selectedUser.createdAt)],
                  ['Terakhir Update', formatDate(selectedUser.updatedAt)],
                  ['Total Pesanan',   `${selectedUser._count?.orders ?? selectedUser.ordersCount ?? 0} pesanan`],
                  ['Status',          isNew(selectedUser.createdAt) ? 'Anggota Baru' : 'Anggota Aktif'],
                ].map(([label, value]) => (
                  <div key={label} className="au-detail-cell">
                    <div className="au-detail-cell-label">{label}</div>
                    <div className="au-detail-cell-value">{value}</div>
                  </div>
                ))}
              </div>

              {/* Role management */}
              <div className="au-section-label">Manajemen Role</div>
              <div className="au-role-section">
                <div className="au-role-section-title">
                  Role saat ini: <strong>{selectedUser.role === 'ADMIN' ? 'Administrator' : 'Member'}</strong>
                </div>
                <div className="au-role-btns">
                  <button className="au-role-btn promote"
                    disabled={selectedUser.role === 'ADMIN'}
                    onClick={() => handleRoleChange(selectedUser.id, 'ADMIN')}>
                    <Shield size={12} /> Jadikan Admin
                  </button>
                  <button className="au-role-btn demote"
                    disabled={selectedUser.role === 'USER'}
                    onClick={() => handleRoleChange(selectedUser.id, 'USER')}>
                    <ShieldOff size={12} /> Cabut Hak Admin
                  </button>
                </div>
              </div>

              {/* Danger zone */}
              <div className="au-section-label">Zona Berbahaya</div>
              <button
                className="au-role-btn danger"
                style={{ width:'100%', justifyContent:'center', padding:'0.72rem' }}
                onClick={() => { setConfirmDeleteId(selectedUser.id); setConfirmDeleteName(selectedUser.name) }}
              >
                <Trash2 size={12} /> Hapus Akun Ini Secara Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ CONFIRM DELETE ══ */}
      {confirmDeleteId && (
        <div className="au-confirm-overlay" onClick={e => e.target === e.currentTarget && setConfirmDeleteId(null)}>
          <div className="au-confirm-box">
            <div className="au-confirm-icon"><AlertTriangle size={22} /></div>
            <div className="au-confirm-title">Hapus Anggota?</div>
            <div className="au-confirm-desc">
              Akun <span className="au-confirm-name">"{confirmDeleteName}"</span> akan dihapus secara permanen beserta seluruh datanya. Tindakan ini tidak bisa dibatalkan.
            </div>
            <div className="au-confirm-btns">
              <button className="au-confirm-cancel" onClick={() => setConfirmDeleteId(null)}>Batal</button>
              <button className="au-confirm-delete" onClick={handleDelete}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers