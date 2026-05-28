'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Users, Crown, Zap, Search, CheckCircle } from 'lucide-react'

interface User {
  id: string
  email: string
  plan: string
  generations_used: number
  created_at: string
}

export default function AdminPage() {
  const [secret, setSecret] = useState('')
  const [authed, setAuthed] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [activating, setActivating] = useState<string | null>(null)

  async function loadUsers(s: string) {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'x-admin-secret': s },
      })
      if (res.status === 401) { toast.error('Неверный пароль'); return }
      const data = await res.json()
      setUsers(data.users ?? [])
      setAuthed(true)
    } catch {
      toast.error('Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }

  async function activatePro(email: string) {
    setActivating(email)
    try {
      const res = await fetch(`/api/admin/activate?email=${encodeURIComponent(email)}&plan=pro&secret=${encodeURIComponent(secret)}`)
      if (res.ok) {
        toast.success(`Pro активирован для ${email}`)
        setUsers(prev => prev.map(u => u.email === email ? { ...u, plan: 'pro' } : u))
      } else {
        toast.error('Не удалось активировать')
      }
    } catch {
      toast.error('Ошибка')
    } finally {
      setActivating(null)
    }
  }

  const filtered = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const proCount = users.filter(u => u.plan === 'pro').length
  const freeCount = users.filter(u => u.plan !== 'pro').length

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #faf8ff, #f3f0ff)' }}>
        <div className="w-full max-w-sm space-y-4 p-8 rounded-2xl bg-white shadow-lg border border-violet-100">
          <h1 className="text-2xl font-black text-center" style={{ color: '#1a1035' }}>Админ-панель</h1>
          <input
            type="password"
            placeholder="Введите пароль"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && loadUsers(secret)}
            className="w-full px-4 py-3 rounded-xl border border-violet-200 outline-none focus:border-violet-500 text-sm"
          />
          <button
            onClick={() => loadUsers(secret)}
            disabled={loading || !secret}
            className="w-full py-3 rounded-xl font-semibold text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin inline" /> : 'Войти'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(160deg, #faf8ff, #f3f0ff)' }}>
      <div className="max-w-4xl mx-auto space-y-6">

        <h1 className="text-3xl font-black" style={{ color: '#1a1035' }}>Админ-панель</h1>

        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Users, label: 'Всего', value: users.length, color: '#7c3aed' },
            { icon: Crown, label: 'Pro', value: proCount, color: '#f59e0b' },
            { icon: Zap, label: 'Free', value: freeCount, color: '#10b981' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-violet-100 flex items-center gap-4">
              <Icon className="w-8 h-8" style={{ color }} />
              <div>
                <p className="text-2xl font-black" style={{ color: '#1a1035' }}>{value}</p>
                <p className="text-sm" style={{ color: '#9d8ec4' }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-violet-100 overflow-hidden">
          <div className="p-4 border-b border-violet-50 flex items-center gap-3">
            <Search className="w-4 h-4" style={{ color: '#9d8ec4' }} />
            <input
              type="text"
              placeholder="Поиск по email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 outline-none text-sm"
            />
          </div>

          <div className="divide-y divide-violet-50">
            {filtered.length === 0 && (
              <div className="p-8 text-center text-sm" style={{ color: '#9d8ec4' }}>Пользователи не найдены</div>
            )}
            {filtered.map(user => (
              <div key={user.id} className="p-4 flex items-center justify-between hover:bg-violet-50/30 transition-colors">
                <div className="space-y-0.5">
                  <p className="font-semibold text-sm" style={{ color: '#1a1035' }}>{user.email}</p>
                  <p className="text-xs" style={{ color: '#9d8ec4' }}>
                    Генераций: {user.generations_used} · Регистрация: {new Date(user.created_at).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={user.plan === 'pro'
                      ? { background: '#fef3c7', color: '#d97706' }
                      : { background: '#f3f0ff', color: '#7c3aed' }
                    }
                  >
                    {user.plan === 'pro' ? '👑 Pro' : 'Free'}
                  </span>
                  {user.plan !== 'pro' && (
                    <button
                      onClick={() => activatePro(user.email)}
                      disabled={activating === user.email}
                      className="px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1"
                      style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
                    >
                      {activating === user.email
                        ? <Loader2 className="w-3 h-3 animate-spin" />
                        : <CheckCircle className="w-3 h-3" />
                      }
                      Дать Pro
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
