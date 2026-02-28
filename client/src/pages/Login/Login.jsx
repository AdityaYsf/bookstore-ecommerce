import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowRight, BookOpen } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

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
    --bg-page:     #f5f7ff;
    --bg-card:     #ffffff;
    --bg-soft:     #eef1fb;
    --border:      rgba(15,30,66,0.1);
    --ink2:        #3a4a6e;
    --ink3:        #6272a0;
    --ink4:        #9aa3c2;
  }

  .login-root {
    font-family: 'Poppins', sans-serif;
    min-height: 100svh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: var(--bg-page);
  }
  @media (max-width: 768px) { .login-root { grid-template-columns: 1fr; } }

  /* ══ LEFT PANEL ══ */
  .login-left {
    position: relative;
    display: flex; flex-direction: column;
    justify-content: space-between;
    padding: clamp(2.5rem, 5vw, 4rem);
    overflow: hidden;
    background: linear-gradient(160deg, var(--navy) 0%, var(--navy-mid) 50%, var(--navy-lt) 100%);
  }
  @media (max-width: 768px) { .login-left { display: none; } }

  /* Background glow */
  .login-left::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 70% 50% at 20% 10%, rgba(212,130,58,0.15) 0%, transparent 60%),
      radial-gradient(ellipse 50% 60% at 85% 90%, rgba(100,150,255,0.08) 0%, transparent 55%);
    pointer-events: none;
  }

  /* Decorative large letter */
  .login-left-deco {
    position: absolute; bottom: -4rem; right: -2rem;
    font-family: 'Poppins', sans-serif;
    font-size: 22rem; font-weight: 900; line-height: 1;
    color: rgba(255,255,255,0.03);
    pointer-events: none; user-select: none;
  }

  /* Decorative circle ring */
  .login-left::after {
    content: '';
    position: absolute; bottom: 10%; right: -80px;
    width: 300px; height: 300px; border-radius: 50%;
    border: 1px solid rgba(212,130,58,0.12);
    pointer-events: none;
  }

  .login-logo {
    display: flex; align-items: center; gap: 0.65rem;
    text-decoration: none; position: relative; z-index: 2;
  }
  .login-logo-icon {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, var(--copper), var(--copper-dk));
    display: flex; align-items: center; justify-content: center;
    border-radius: 9px;
    box-shadow: 0 4px 12px rgba(212,130,58,0.4);
    transition: all 0.25s;
  }
  .login-logo:hover .login-logo-icon { transform: scale(1.08) rotate(-3deg); }
  .login-logo-icon svg { color: #fff; }
  .login-logo-name { font-size: 1.25rem; font-weight: 800; color: #fff; letter-spacing: -0.01em; }
  .login-logo-name span { color: var(--copper-lt); }

  /* Left body */
  .login-left-body { position: relative; z-index: 2; }
  .login-left-tag {
    font-size: 0.67rem; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--copper-lt);
    margin-bottom: 1.25rem;
    display: flex; align-items: center; gap: 0.65rem;
  }
  .login-left-tag::before { content: ''; display: block; width: 2rem; height: 1px; background: var(--copper-lt); }

  .login-left-title {
    font-size: clamp(2rem, 3.5vw, 3rem);
    font-weight: 800; color: #fff; line-height: 1.1; margin-bottom: 1.2rem;
  }
  .login-left-title em { font-style: italic; color: var(--copper-lt); }

  .login-left-desc {
    font-size: 0.88rem; color: rgba(200,215,255,0.6);
    line-height: 1.75; font-weight: 300; max-width: 36ch;
  }

  /* Stats row */
  .login-left-stats {
    display: flex; gap: 2rem;
    padding: 1.5rem 0;
    border-top: 1px solid rgba(255,255,255,0.08);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    margin-top: 2rem;
    position: relative; z-index: 2;
  }
  .lstat-num { font-size: 1.5rem; font-weight: 800; color: #fff; line-height: 1; }
  .lstat-num em { color: var(--copper-lt); font-style: normal; font-size: 0.9rem; }
  .lstat-lbl { font-size: 0.65rem; color: rgba(200,215,255,0.45); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 0.15rem; }

  /* Quote */
  .login-left-quote {
    position: relative; z-index: 2;
    border-left: 2px solid rgba(212,130,58,0.4);
    padding-left: 1.2rem;
  }
  .login-left-quote-text {
    font-size: 0.88rem; font-style: italic;
    color: rgba(200,215,255,0.5); line-height: 1.65; margin-bottom: 0.5rem;
  }
  .login-left-quote-author {
    font-size: 0.67rem; letter-spacing: 0.12em;
    text-transform: uppercase; color: rgba(200,215,255,0.3);
  }

  /* ══ RIGHT PANEL ══ */
  .login-right {
    background: var(--bg-card);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: clamp(2.5rem, 5vw, 4rem) clamp(2rem, 6vw, 5rem);
    position: relative;
    box-shadow: -8px 0 40px rgba(15,30,66,0.06);
  }

  /* Mobile logo */
  .login-mobile-logo {
    display: none; align-items: center; gap: 0.6rem;
    text-decoration: none; margin-bottom: 2.5rem;
  }
  @media (max-width: 768px) { .login-mobile-logo { display: flex; } }
  .login-mobile-logo-icon {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, var(--copper), var(--copper-dk));
    display: flex; align-items: center; justify-content: center;
    border-radius: 8px; box-shadow: 0 3px 8px rgba(212,130,58,0.3);
  }
  .login-mobile-logo-icon svg { color: #fff; }
  .login-mobile-logo-name { font-size: 1.15rem; font-weight: 800; color: var(--navy); }
  .login-mobile-logo-name span { color: var(--copper); }

  /* Form wrap */
  .login-form-wrap {
    width: 100%; max-width: 400px;
    animation: formIn 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes formIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  .login-form-eyebrow {
    font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--copper-dk); margin-bottom: 0.6rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .login-form-eyebrow::before { content: ''; display: block; width: 1.5rem; height: 1px; background: var(--copper); }

  .login-form-title {
    font-size: 2rem; font-weight: 800;
    color: var(--navy); margin-bottom: 0.4rem; line-height: 1.1;
  }
  .login-form-subtitle {
    font-size: 0.85rem; color: var(--ink3); font-weight: 400; margin-bottom: 2.2rem;
  }
  .login-form-subtitle a { color: var(--copper-dk); font-weight: 600; text-decoration: none; }
  .login-form-subtitle a:hover { color: var(--copper); text-decoration: underline; }

  /* Error */
  .login-error {
    background: #fff5f5;
    border: 1px solid rgba(220,38,38,0.2);
    border-left: 3px solid #dc2626;
    color: #dc2626;
    padding: 0.8rem 1rem;
    font-size: 0.8rem;
    margin-bottom: 1.5rem;
    border-radius: 8px;
    animation: formIn 0.3s ease;
  }

  /* Field */
  .login-field { margin-bottom: 1.2rem; }
  .login-label {
    display: block; font-size: 0.7rem; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--ink2); margin-bottom: 0.45rem;
  }
  .login-input-wrap { position: relative; }
  .login-input-icon {
    position: absolute; left: 0.95rem; top: 50%;
    transform: translateY(-50%);
    color: var(--ink4); pointer-events: none;
    transition: color 0.2s;
  }
  .login-input {
    width: 100%;
    background: var(--bg-soft);
    border: 1.5px solid var(--border);
    color: var(--navy);
    font-family: 'Poppins', sans-serif;
    font-size: 0.88rem; font-weight: 400;
    padding: 0.82rem 1rem 0.82rem 2.75rem;
    border-radius: 9px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    box-sizing: border-box;
  }
  .login-input::placeholder { color: var(--ink4); }
  .login-input:focus {
    background: #fff;
    border-color: var(--copper);
    box-shadow: 0 0 0 3px rgba(212,130,58,0.12);
  }
  .login-input:focus ~ .login-input-icon,
  .login-input-wrap:focus-within .login-input-icon { color: var(--copper); }
  .login-input.has-right { padding-right: 3rem; }

  .login-eye-btn {
    position: absolute; right: 0.95rem; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--ink4); padding: 0;
    display: flex; align-items: center;
    transition: color 0.2s;
  }
  .login-eye-btn:hover { color: var(--navy); }

  /* Forgot */
  .login-forgot {
    display: block; text-align: right;
    font-size: 0.73rem; color: var(--ink3);
    text-decoration: none; margin-top: 0.4rem;
    transition: color 0.2s; font-weight: 500;
  }
  .login-forgot:hover { color: var(--copper-dk); }

  /* Submit */
  .login-submit {
    width: 100%;
    display: inline-flex; align-items: center; justify-content: center; gap: 0.6rem;
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    color: #fff;
    font-family: 'Poppins', sans-serif;
    font-size: 0.875rem; font-weight: 700;
    letter-spacing: 0.04em;
    border: none; cursor: pointer;
    padding: 0.92rem 1rem;
    border-radius: 9px;
    margin-top: 1.8rem;
    transition: all 0.25s;
    box-shadow: 0 4px 16px rgba(15,30,66,0.22);
    position: relative; overflow: hidden;
  }
  .login-submit::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--copper), var(--copper-dk));
    opacity: 0; transition: opacity 0.25s;
  }
  .login-submit:hover:not(:disabled)::before { opacity: 1; }
  .login-submit > * { position: relative; z-index: 1; }
  .login-submit:hover:not(:disabled) {
    box-shadow: 0 8px 24px rgba(212,130,58,0.4);
    transform: translateY(-1px);
  }
  .login-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Spinner */
  .login-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff; border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to{transform:rotate(360deg)} }

  /* Divider */
  .login-divider {
    display: flex; align-items: center; gap: 1rem;
    margin: 1.75rem 0;
    font-size: 0.68rem; color: var(--ink4);
    letter-spacing: 0.08em; text-transform: uppercase;
  }
  .login-divider::before, .login-divider::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }

  /* Register row */
  .login-register-row {
    text-align: center; font-size: 0.82rem; color: var(--ink3);
  }
  .login-register-link {
    color: var(--navy); font-weight: 700;
    text-decoration: none;
    border-bottom: 1.5px solid var(--navy-pale);
    padding-bottom: 1px;
    transition: color 0.2s, border-color 0.2s;
  }
  .login-register-link:hover { color: var(--copper-dk); border-color: var(--copper); }
`

const Login = () => {
  const [formData, setFormData]       = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]             = useState('')
  const [loading, setLoading]         = useState(false)

  const { login }  = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(formData.email, formData.password)
      const from = location.state?.from?.pathname || (user.role === 'ADMIN' ? '/admin' : '/')
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Email atau password salah.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-root">
      <style>{styles}</style>

      {/* ══ LEFT PANEL ══ */}
      <div className="login-left">
        <div className="login-left-deco">B</div>

        {/* Logo */}
        <Link to="/" className="login-logo">
          <div className="login-logo-icon"><BookOpen size={17} /></div>
          <span className="login-logo-name">Book<span>Store</span></span>
        </Link>

        {/* Body */}
        <div className="login-left-body">
          <div className="login-left-tag">Masuk ke Akun</div>
          <h2 className="login-left-title">
            Dunia Buku<br />Ada di <em>Sini.</em>
          </h2>
          <p className="login-left-desc">
            Temukan ribuan judul pilihan, lacak pesananmu, dan nikmati pengalaman belanja buku yang menyenangkan.
          </p>
          <div className="login-left-stats">
            {[['10K','+','Judul Buku'],['50K','+','Pembaca'],['4.9','★','Rating']].map(([n,s,l]) => (
              <div key={l}>
                <div className="lstat-num">{n}<em>{s}</em></div>
                <div className="lstat-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="login-left-quote">
          <div className="login-left-quote-text">
            "A reader lives a thousand lives before he dies. The man who never reads lives only one."
          </div>
          <div className="login-left-quote-author">— George R.R. Martin</div>
        </div>
      </div>

      {/* ══ RIGHT PANEL ══ */}
      <div className="login-right">
        {/* Mobile logo */}
        <Link to="/" className="login-mobile-logo">
          <div className="login-mobile-logo-icon"><BookOpen size={16} /></div>
          <span className="login-mobile-logo-name">Book<span>Store</span></span>
        </Link>

        <div className="login-form-wrap">
          <div className="login-form-eyebrow">Selamat Datang Kembali</div>
          <h1 className="login-form-title">Masuk</h1>
          <p className="login-form-subtitle">
            Belum punya akun?{' '}
            <Link to="/register">Daftar gratis</Link>
          </p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="login-field">
              <label className="login-label">Email</label>
              <div className="login-input-wrap">
                <input
                  type="email" required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="login-input"
                  placeholder="email@example.com"
                  autoComplete="email"
                />
                <Mail size={15} className="login-input-icon" />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <label className="login-label">Password</label>
              <div className="login-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'} required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="login-input has-right"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <Lock size={15} className="login-input-icon" />
                <button
                  type="button" className="login-eye-btn"
                  onClick={() => setShowPassword(!showPassword)} tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <a href="#" className="login-forgot">Lupa password?</a>
            </div>

            {/* Submit */}
            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? (
                <><span className="login-spinner" /> Memproses...</>
              ) : (
                <>Masuk <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <div className="login-divider">atau</div>

          <div className="login-register-row">
            Belum punya akun?{' '}
            <Link to="/register" className="login-register-link">Daftar sekarang</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login