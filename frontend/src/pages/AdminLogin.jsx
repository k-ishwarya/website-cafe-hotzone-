import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../api.js'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [panel, setPanel] = useState('login') // 'login' | 'forgot'

  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginError, setLoginError] = useState('')
  const [showLoginPass, setShowLoginPass] = useState(false)

  const [fpUsername, setFpUsername] = useState('')
  const [fpPin, setFpPin] = useState('')
  const [fpNewPass, setFpNewPass] = useState('')
  const [fpConfirmPass, setFpConfirmPass] = useState('')
  const [fpError, setFpError] = useState('')
  const [fpSuccess, setFpSuccess] = useState('')
  const [showFpPin, setShowFpPin] = useState(false)
  const [showFpNew, setShowFpNew] = useState(false)
  const [showFpConfirm, setShowFpConfirm] = useState(false)

  const switchPanel = (id) => {
    setPanel(id)
    setLoginError('')
    setFpError('')
    setFpSuccess('')
  }

  const doLogin = async () => {
    setLoginError('')
    if (!loginUser.trim() || !loginPass) {
      setLoginError('Please fill in all fields')
      return
    }
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUser.trim(), password: loginPass }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.token)
        navigate('/admin/dashboard')
      } else {
        setLoginError(data.msg || 'Invalid credentials')
      }
    } catch {
      setLoginError('Cannot connect to server')
    }
  }

  const doForgotPassword = async () => {
    setFpError('')
    setFpSuccess('')
    if (!fpUsername.trim() || !fpPin || !fpNewPass || !fpConfirmPass) {
      setFpError('Please fill in all fields')
      return
    }
    if (fpNewPass.length < 8) {
      setFpError('New password must be at least 8 characters')
      return
    }
    if (fpNewPass !== fpConfirmPass) {
      setFpError('Passwords do not match')
      return
    }
    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: fpUsername.trim(), recoveryPin: fpPin, newPassword: fpNewPass }),
      })
      const data = await res.json()
      if (res.ok) {
        setFpSuccess('✅ Password reset! Redirecting to login…')
        setFpUsername(''); setFpPin(''); setFpNewPass(''); setFpConfirmPass('')
        setTimeout(() => switchPanel('login'), 2000)
      } else {
        setFpError(data.msg || 'Reset failed')
      }
    } catch {
      setFpError('Cannot connect to server')
    }
  }

  const bodyBg = {
    minHeight: '100vh',
    background:
      'linear-gradient(rgba(0,0,0,0.72), rgba(0,0,0,0.82)), url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600") center/cover no-repeat fixed',
  }

  return (
    <div className="login-wrap" style={bodyBg}>
      <div className="login-card">
        {panel === 'login' && (
          <div>
            <div className="login-title">Admin Login</div>
            <div className="login-sub">HotZone Management Panel</div>
            {loginError && <div className="login-error">{loginError}</div>}

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="admin"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && doLogin()}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 6 }}>
              <label>Password</label>
              <div className="password-wrap">
                <input
                  type={showLoginPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && doLogin()}
                />
                <span
                  className="toggle-pass"
                  style={{ color: showLoginPass ? '#ff6200' : '#888' }}
                  onClick={() => setShowLoginPass((s) => !s)}
                >
                  <i className={`fa-solid ${showLoginPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: 22 }}>
              <button className="link-btn" onClick={() => switchPanel('forgot')}>Forgot password?</button>
            </div>

            <button className="btn btn-primary full-btn" onClick={doLogin}>Login</button>
          </div>
        )}

        {panel === 'forgot' && (
          <div>
            <div className="login-title" style={{ fontSize: '1.6rem' }}>Reset Password</div>
            <div className="login-sub">Enter your username and secret recovery PIN</div>
            {fpError && <div className="login-error">{fpError}</div>}
            {fpSuccess && <div className="login-success">{fpSuccess}</div>}

            <div className="form-group">
              <label>Username</label>
              <input type="text" placeholder="admin" value={fpUsername} onChange={(e) => setFpUsername(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Recovery PIN</label>
              <div className="password-wrap">
                <input
                  type={showFpPin ? 'text' : 'password'}
                  placeholder="Secret PIN"
                  value={fpPin}
                  onChange={(e) => setFpPin(e.target.value)}
                />
                <span
                  className="toggle-pass"
                  style={{ color: showFpPin ? '#ff6200' : '#888' }}
                  onClick={() => setShowFpPin((s) => !s)}
                >
                  <i className={`fa-solid ${showFpPin ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>New Password</label>
              <div className="password-wrap">
                <input
                  type={showFpNew ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={fpNewPass}
                  onChange={(e) => setFpNewPass(e.target.value)}
                />
                <span
                  className="toggle-pass"
                  style={{ color: showFpNew ? '#ff6200' : '#888' }}
                  onClick={() => setShowFpNew((s) => !s)}
                >
                  <i className={`fa-solid ${showFpNew ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </span>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 22 }}>
              <label>Confirm New Password</label>
              <div className="password-wrap">
                <input
                  type={showFpConfirm ? 'text' : 'password'}
                  placeholder="Repeat new password"
                  value={fpConfirmPass}
                  onChange={(e) => setFpConfirmPass(e.target.value)}
                />
                <span
                  className="toggle-pass"
                  style={{ color: showFpConfirm ? '#ff6200' : '#888' }}
                  onClick={() => setShowFpConfirm((s) => !s)}
                >
                  <i className={`fa-solid ${showFpConfirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary full-btn" onClick={doForgotPassword}>Reset Password</button>
              <button className="btn btn-ghost" style={{ minWidth: 80 }} onClick={() => switchPanel('login')}>Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
