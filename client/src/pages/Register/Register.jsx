import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, BookOpen, Check } from 'lucide-react'
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
    --green:       #2d6a4f;
    --green-pale:  #d8f3e8;
    --bg-page:     #f5f7ff;
    --bg-card:     #ffffff;
    --bg-soft:     #eef1fb;
    --border:      rgba(15,30,66,0.1);
    --ink2:        #3a4a6e;
    --ink3:        #6272a0;
    --ink4:        #9aa3c2;
  }

  .reg-root {
    font-family: 'Poppins', sans-serif;
    min-height: 100svh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: var(--bg-page);
  }
  @media (max-width: 768px) { .reg-root { grid-template-columns: 1fr; } }

  /* ══ FORM PANEL (RIGHT) ══ */
  .reg-right {
    background: var(--bg-card);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: clamp(2rem, 4vw, 4rem) clamp(2rem, 6vw, 5rem);
    order: 1;
    box-shadow: -8px 0 40px rgba(15,30,66,0.06);
    overflow-y: auto;
  }
  @media (max-width: 768px) { .reg-right { order: 0; } }

  /* Mobile logo */
  .reg-mobile-logo {
    display: none; align-items: center; gap: 0.6rem;
    text-decoration: none; margin-bottom: 2rem;
  }
  @media (max-width: 768px) { .reg-mobile-logo { display: flex; } }
  .reg-mobile-logo-icon {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, var(--copper), var(--copper-dk));
    display: flex; align-items: center; justify-content: center;
    border-radius: 8px; box-shadow: 0 3px 8px rgba(212,130,58,0.3);
  }
  .reg-mobile-logo-icon svg { color: #fff; }
  .reg-mobile-logo-name { font-size: 1.15rem; font-weight: 800; color: var(--navy); }
  .reg-mobile-logo-name span { color: var(--copper); }

  /* Form wrap */
  .reg-form-wrap {
    width: 100%; max-width: 420px;
    animation: formIn 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes formIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  .reg-eyebrow {
    font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--copper-dk); margin-bottom: 0.6rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .reg-eyebrow::before { content: ''; display: block; width: 1.5rem; height: 1px; background: var(--copper); }

  .reg-title {
    font-size: 2rem; font-weight: 800;
    color: var(--navy); margin-bottom: 0.4rem; line-height: 1.1;
  }
  .reg-subtitle {
    font-size: 0.85rem; color: var(--ink3);
    font-weight: 400; margin-bottom: 1.5rem;
  }
  .reg-subtitle a { color: var(--copper-dk); font-weight: 600; text-decoration: none; }
  .reg-subtitle a:hover { color: var(--copper); text-decoration: underline; }

  /* Benefits strip */
  .reg-benefits {
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0.9rem 1.1rem;
    margin-bottom: 1.5rem;
    display: flex; flex-direction: column; gap: 0.45rem;
  }
  .reg-benefit-item {
    display: flex; align-items: center; gap: 0.6rem;
    font-size: 0.77rem; color: var(--ink2);
  }
  .reg-benefit-icon {
    width: 18px; height: 18px;
    background: linear-gradient(135deg, var(--copper), var(--copper-dk));
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; color: #fff;
  }

  /* Error */
  .reg-error {
    background: #fff5f5;
    border: 1px solid rgba(220,38,38,0.2);
    border-left: 3px solid #dc2626;
    color: #dc2626;
    padding: 0.8rem 1rem;
    font-size: 0.8rem; margin-bottom: 1.25rem;
    border-radius: 8px;
    animation: formIn 0.3s ease;
  }

  /* Fields */
  .reg-field { margin-bottom: 1rem; }
  .reg-label {
    display: block; font-size: 0.7rem; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--ink2); margin-bottom: 0.42rem;
  }
  .reg-input-wrap { position: relative; }
  .reg-input-icon {
    position: absolute; left: 0.95rem; top: 50%;
    transform: translateY(-50%);
    color: var(--ink4); pointer-events: none; transition: color 0.2s;
  }
  .reg-input {
    width: 100%;
    background: var(--bg-soft);
    border: 1.5px solid var(--border);
    color: var(--navy);
    font-family: 'Poppins', sans-serif;
    font-size: 0.88rem; font-weight: 400;
    padding: 0.8rem 1rem 0.8rem 2.75rem;
    border-radius: 9px; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    box-sizing: border-box;
  }
  .reg-input::placeholder { color: var(--ink4); }
  .reg-input:focus {
    background: #fff;
    border-color: var(--copper);
    box-shadow: 0 0 0 3px rgba(212,130,58,0.12);
  }
  .reg-input-wrap:focus-within .reg-input-icon { color: var(--copper); }
  .reg-input.has-right { padding-right: 3rem; }

  /* Eye button */
  .reg-eye-btn {
    position: absolute; right: 0.95rem; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--ink4); padding: 0;
    display: flex; align-items: center; transition: color 0.2s;
  }
  .reg-eye-btn:hover { color: var(--navy); }

  /* Password strength */
  .reg-strength {
    margin-top: 0.5rem; display: flex; gap: 4px; align-items: center;
  }
  .reg-strength-bar {
    height: 3px; flex: 1; border-radius: 999px;
    background: var(--border); transition: background 0.3s;
  }
  .reg-strength-bar.active-weak   { background: #dc2626; }
  .reg-strength-bar.active-medium { background: var(--copper); }
  .reg-strength-bar.active-strong { background: var(--green); }
  .reg-strength-label {
    font-size: 0.67rem; letter-spacing: 0.06em;
    color: var(--ink4); margin-left: 0.4rem;
    min-width: 4rem; text-align: right; font-weight: 500;
  }
  .reg-strength-label.weak   { color: #dc2626; }
  .reg-strength-label.medium { color: var(--copper-dk); }
  .reg-strength-label.strong { color: var(--green); }

  /* Password match */
  .reg-match {
    margin-top: 0.4rem; font-size: 0.72rem;
    display: flex; align-items: center; gap: 0.35rem; font-weight: 500;
  }
  .reg-match.ok   { color: var(--green); }
  .reg-match.fail { color: #dc2626; }

  /* Submit */
  .reg-submit {
    width: 100%;
    display: inline-flex; align-items: center; justify-content: center; gap: 0.6rem;
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    color: #fff;
    font-family: 'Poppins', sans-serif;
    font-size: 0.875rem; font-weight: 700;
    letter-spacing: 0.04em;
    border: none; cursor: pointer;
    padding: 0.92rem 1rem; border-radius: 9px;
    margin-top: 1.5rem;
    transition: all 0.25s;
    box-shadow: 0 4px 16px rgba(15,30,66,0.22);
    position: relative; overflow: hidden;
  }
  .reg-submit::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--copper), var(--copper-dk));
    opacity: 0; transition: opacity 0.25s;
  }
  .reg-submit:hover:not(:disabled)::before { opacity: 1; }
  .reg-submit > * { position: relative; z-index: 1; }
  .reg-submit:hover:not(:disabled) {
    box-shadow: 0 8px 24px rgba(212,130,58,0.4);
    transform: translateY(-1px);
  }
  .reg-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  .reg-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff; border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to{transform:rotate(360deg)} }

  .reg-divider {
    display: flex; align-items: center; gap: 1rem;
    margin: 1.5rem 0;
    font-size: 0.68rem; color: var(--ink4); letter-spacing: 0.08em; text-transform: uppercase;
  }
  .reg-divider::before, .reg-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .reg-login-row { text-align: center; font-size: 0.82rem; color: var(--ink3); }
  .reg-login-link {
    color: var(--navy); font-weight: 700;
    text-decoration: none;
    border-bottom: 1.5px solid var(--navy-pale); padding-bottom: 1px;
    transition: color 0.2s, border-color 0.2s;
  }
  .reg-login-link:hover { color: var(--copper-dk); border-color: var(--copper); }

  /* ══ LEFT DECORATIVE PANEL ══ */
  .reg-left {
    position: relative;
    display: flex; flex-direction: column;
    justify-content: space-between;
    padding: clamp(2.5rem, 5vw, 4rem);
    overflow: hidden;
    background: linear-gradient(160deg, var(--navy) 0%, var(--navy-mid) 50%, var(--navy-lt) 100%);
    order: 2;
  }
  @media (max-width: 768px) { .reg-left { display: none; } }

  /* Glow */
  .reg-left::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 65% 50% at 85% 10%, rgba(212,130,58,0.14) 0%, transparent 60%),
      radial-gradient(ellipse 50% 65% at 15% 90%, rgba(100,150,255,0.07) 0%, transparent 55%);
    pointer-events: none;
  }
  /* Circle ring */
  .reg-left::after {
    content: '';
    position: absolute; bottom: 10%; left: -80px;
    width: 300px; height: 300px; border-radius: 50%;
    border: 1px solid rgba(212,130,58,0.1);
    pointer-events: none;
  }

  .reg-left-deco {
    position: absolute; bottom: -4rem; left: -2rem;
    font-family: 'Poppins', sans-serif;
    font-size: 22rem; font-weight: 900; line-height: 1;
    color: rgba(255,255,255,0.03);
    pointer-events: none; user-select: none;
  }

  /* Logo */
  .reg-logo {
    display: flex; align-items: center; gap: 0.65rem;
    text-decoration: none; position: relative; z-index: 2;
  }
  .reg-logo-icon {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, var(--copper), var(--copper-dk));
    display: flex; align-items: center; justify-content: center;
    border-radius: 9px; box-shadow: 0 4px 12px rgba(212,130,58,0.4);
    transition: all 0.25s;
  }
  .reg-logo:hover .reg-logo-icon { transform: scale(1.08) rotate(-3deg); }
  .reg-logo-icon svg { color: #fff; }
  .reg-logo-name { font-size: 1.25rem; font-weight: 800; color: #fff; letter-spacing: -0.01em; }
  .reg-logo-name span { color: var(--copper-lt); }

  /* Left body */
  .reg-left-body { position: relative; z-index: 2; }
  .reg-left-tag {
    font-size: 0.67rem; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--copper-lt); margin-bottom: 1.25rem;
    display: flex; align-items: center; gap: 0.65rem;
  }
  .reg-left-tag::before { content: ''; display: block; width: 2rem; height: 1px; background: var(--copper-lt); }

  .reg-left-title {
    font-size: clamp(2rem, 3.5vw, 3rem);
    font-weight: 800; color: #fff; line-height: 1.1; margin-bottom: 1.2rem;
  }
  .reg-left-title em { font-style: italic; color: var(--copper-lt); }

  .reg-left-desc {
    font-size: 0.88rem; color: rgba(200,215,255,0.55);
    line-height: 1.75; font-weight: 300; max-width: 36ch;
  }

  /* Perks */
  .reg-left-perks {
    position: relative; z-index: 2;
    display: flex; flex-direction: column; gap: 0.75rem;
  }
  .reg-left-perk {
    display: flex; align-items: flex-start; gap: 0.9rem;
    padding: 1rem 1.1rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    transition: background 0.25s, border-color 0.25s;
  }
  .reg-left-perk:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(212,130,58,0.2);
  }
  .reg-left-perk-icon {
    width: 30px; height: 30px;
    background: rgba(212,130,58,0.15);
    border: 1px solid rgba(212,130,58,0.2);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: var(--copper-lt); flex-shrink: 0;
    font-size: 0.9rem;
    transition: all 0.25s;
  }
  .reg-left-perk:hover .reg-left-perk-icon {
    background: linear-gradient(135deg, var(--copper), var(--copper-dk));
    border-color: transparent;
  }
  .reg-left-perk-title {
    font-size: 0.83rem; font-weight: 700;
    color: #fff; margin-bottom: 0.15rem;
  }
  .reg-left-perk-desc {
    font-size: 0.72rem; color: rgba(200,215,255,0.45); line-height: 1.5;
  }
`

const getStrength = (pw) => {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 6) s++
  if (pw.length >= 10) s++
  if (/[A-Z]/.test(pw) || /[0-9]/.test(pw)) s++
  return s
}
const strengthLabel = ['', 'Lemah', 'Sedang', 'Kuat']
const strengthClass = ['', 'weak', 'medium', 'strong']

const Register = () => {
  const [formData, setFormData]           = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword]   = useState(false)
  const [showConfirm,  setShowConfirm]    = useState(false)
  const [error,  setError]                = useState('')
  const [loading, setLoading]             = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const strength = getStrength(formData.password)
  const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.confirmPassword) { setError('Password tidak cocok.'); return }
    if (formData.password.length < 6) { setError('Password minimal 6 karakter.'); return }
    setLoading(true)
    try {
      await register(formData.name, formData.email, formData.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="reg-root">
      <style>{styles}</style>

      {/* ══ FORM PANEL ══ */}
      <div className="reg-right">
        <Link to="/" className="reg-mobile-logo">
          <div className="reg-mobile-logo-icon"><BookOpen size={16} /></div>
          <span className="reg-mobile-logo-name">Book<span>Store</span></span>
        </Link>

        <div className="reg-form-wrap">
          <div className="reg-eyebrow">Buat Akun Baru</div>
          <h1 className="reg-title">Daftar</h1>
          <p className="reg-subtitle">
            Sudah punya akun?{' '}<Link to="/login">Masuk di sini</Link>
          </p>

          {/* Benefits */}
          <div className="reg-benefits">
            {['Akses ribuan koleksi buku pilihan', 'Lacak pesanan secara real-time', 'Penawaran eksklusif untuk member'].map(b => (
              <div key={b} className="reg-benefit-item">
                <div className="reg-benefit-icon"><Check size={10} /></div>
                {b}
              </div>
            ))}
          </div>

          {error && <div className="reg-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="reg-field">
              <label className="reg-label">Nama Lengkap</label>
              <div className="reg-input-wrap">
                <input type="text" required value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="reg-input" placeholder="Nama kamu" autoComplete="name" />
                <User size={15} className="reg-input-icon" />
              </div>
            </div>

            {/* Email */}
            <div className="reg-field">
              <label className="reg-label">Email</label>
              <div className="reg-input-wrap">
                <input type="email" required value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="reg-input" placeholder="email@example.com" autoComplete="email" />
                <Mail size={15} className="reg-input-icon" />
              </div>
            </div>

            {/* Password */}
            <div className="reg-field">
              <label className="reg-label">Password</label>
              <div className="reg-input-wrap">
                <input type={showPassword ? 'text' : 'password'} required value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="reg-input has-right" placeholder="Min. 6 karakter" autoComplete="new-password" />
                <Lock size={15} className="reg-input-icon" />
                <button type="button" className="reg-eye-btn" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {formData.password && (
                <div className="reg-strength">
                  {[1,2,3].map(i => (
                    <div key={i} className={`reg-strength-bar ${strength >= i ? `active-${strengthClass[strength]}` : ''}`} />
                  ))}
                  <span className={`reg-strength-label ${strengthClass[strength]}`}>{strengthLabel[strength]}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="reg-field">
              <label className="reg-label">Konfirmasi Password</label>
              <div className="reg-input-wrap">
                <input type={showConfirm ? 'text' : 'password'} required value={formData.confirmPassword}
                  onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="reg-input has-right" placeholder="Ulangi password" autoComplete="new-password" />
                <Lock size={15} className="reg-input-icon" />
                <button type="button" className="reg-eye-btn" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className={`reg-match ${passwordsMatch ? 'ok' : 'fail'}`}>
                  {passwordsMatch
                    ? <><Check size={12} /> Password cocok</>
                    : <><span style={{fontSize:'0.9rem'}}>✕</span> Password belum cocok</>
                  }
                </div>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className="reg-submit" disabled={loading}>
              {loading
                ? <><span className="reg-spinner" /> Memproses...</>
                : <>Buat Akun <ArrowRight size={15} /></>
              }
            </button>
          </form>

          <div className="reg-divider">atau</div>
          <div className="reg-login-row">
            Sudah punya akun?{' '}
            <Link to="/login" className="reg-login-link">Masuk sekarang</Link>
          </div>
        </div>
      </div>

      {/* ══ LEFT DECORATIVE PANEL ══ */}
      <div className="reg-left">
        <div className="reg-left-deco">D</div>

        <Link to="/" className="reg-logo">
          <div className="reg-logo-icon"><BookOpen size={17} /></div>
          <span className="reg-logo-name">Book<span>Store</span></span>
        </Link>

        <div className="reg-left-body">
          <div className="reg-left-tag">Bergabung Sekarang</div>
          <h2 className="reg-left-title">
            Mulai<br />Perjalanan<br /><em>Membacamu.</em>
          </h2>
          <p className="reg-left-desc">
            Daftar gratis dan jadilah bagian dari komunitas pembaca terbaik Indonesia.
          </p>
        </div>

        <div className="reg-left-perks">
          {[
            { icon: '📚', title: '10.000+ Judul Buku',    desc: 'Dari penulis lokal hingga internasional' },
            { icon: '🚚', title: 'Gratis Ongkir',         desc: 'Untuk pembelian di atas Rp 150.000' },
            { icon: '⭐', title: 'Penawaran Eksklusif',   desc: 'Diskon khusus setiap bulan untuk member' },
          ].map(p => (
            <div key={p.title} className="reg-left-perk">
              <div className="reg-left-perk-icon">{p.icon}</div>
              <div>
                <div className="reg-left-perk-title">{p.title}</div>
                <div className="reg-left-perk-desc">{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Register