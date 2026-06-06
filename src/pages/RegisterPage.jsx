import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      toast.success('Account created! Welcome!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '' }))
  }

  const Field = ({ name, label, type = 'text', Icon: Ic, placeholder, extra }) => (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <Ic className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type={type}
          value={form[name]}
          onChange={set(name)}
          className={`input pl-9 ${extra || ''} ${errors[name] ? 'border-red-400 focus:ring-red-400' : ''}`}
          placeholder={placeholder}
        />
      </div>
      {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
    </div>
  )

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create account</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign in</Link>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field name="name" label="Full name" Icon={User} placeholder="John Doe" />
        <Field name="email" label="Email address" type="email" Icon={Mail} placeholder="you@example.com" />
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPwd ? 'text' : 'password'}
              value={form.password}
              onChange={set('password')}
              className={`input pl-9 pr-10 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
              placeholder="Min 6 characters"
            />
            <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
        </div>
        <Field name="confirm" label="Confirm password" type="password" Icon={Lock} placeholder="Repeat password" />

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 mt-2">
          {loading && <LoadingSpinner size="sm" />}
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </div>
  )
}
