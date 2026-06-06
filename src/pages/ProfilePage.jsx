import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { authService } from '@/services/authService'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { User, Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()

  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileErrors, setProfileErrors] = useState({})

  const [pwdForm, setPwdForm] = useState({ current: '', newPwd: '', confirm: '' })
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdErrors, setPwdErrors] = useState({})
  const [showPwds, setShowPwds] = useState({ current: false, newPwd: false, confirm: false })

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!profile.name.trim()) errs.name = 'Name is required'
    if (!profile.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(profile.email)) errs.email = 'Invalid email'
    if (Object.keys(errs).length) { setProfileErrors(errs); return }

    setProfileLoading(true)
    try {
      const updated = await authService.updateProfile(profile)
      updateUser({ ...user, ...updated })
      toast.success('Profile updated!')
    } catch {
      // handled by interceptor
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!pwdForm.current) errs.current = 'Current password is required'
    if (!pwdForm.newPwd) errs.newPwd = 'New password is required'
    else if (pwdForm.newPwd.length < 6) errs.newPwd = 'Minimum 6 characters'
    if (pwdForm.newPwd !== pwdForm.confirm) errs.confirm = 'Passwords do not match'
    if (Object.keys(errs).length) { setPwdErrors(errs); return }

    setPwdLoading(true)
    try {
      await authService.changePassword({ currentPassword: pwdForm.current, newPassword: pwdForm.newPwd })
      toast.success('Password changed!')
      setPwdForm({ current: '', newPwd: '', confirm: '' })
    } catch {
      // handled by interceptor
    } finally {
      setPwdLoading(false)
    }
  }

  const setP = (f) => (e) => { setProfile(p => ({ ...p, [f]: e.target.value })); setProfileErrors(er => ({ ...er, [f]: '' })) }
  const setPwd = (f) => (e) => { setPwdForm(p => ({ ...p, [f]: e.target.value })); setPwdErrors(er => ({ ...er, [f]: '' })) }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile header */}
      <div className="card p-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center shrink-0">
          <span className="text-primary-700 dark:text-primary-400 font-bold text-2xl">{initials}</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Edit profile */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <User className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
        </div>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={profile.name}
                onChange={setP('name')}
                className={`input pl-9 ${profileErrors.name ? 'border-red-400' : ''}`}
              />
            </div>
            {profileErrors.name && <p className="mt-1 text-xs text-red-500">{profileErrors.name}</p>}
          </div>
          <div>
            <label className="label">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={profile.email}
                onChange={setP('email')}
                className={`input pl-9 ${profileErrors.email ? 'border-red-400' : ''}`}
              />
            </div>
            {profileErrors.email && <p className="mt-1 text-xs text-red-500">{profileErrors.email}</p>}
          </div>
          <button type="submit" disabled={profileLoading} className="btn-primary flex items-center gap-2">
            {profileLoading && <LoadingSpinner size="sm" />}
            {profileLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h3>
        </div>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {[
            { key: 'current', label: 'Current Password' },
            { key: 'newPwd', label: 'New Password' },
            { key: 'confirm', label: 'Confirm New Password' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPwds[key] ? 'text' : 'password'}
                  value={pwdForm[key]}
                  onChange={setPwd(key)}
                  className={`input pl-9 pr-10 ${pwdErrors[key] ? 'border-red-400' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwds(s => ({ ...s, [key]: !s[key] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwds[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {pwdErrors[key] && <p className="mt-1 text-xs text-red-500">{pwdErrors[key]}</p>}
            </div>
          ))}
          <button type="submit" disabled={pwdLoading} className="btn-primary flex items-center gap-2">
            {pwdLoading && <LoadingSpinner size="sm" />}
            {pwdLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
