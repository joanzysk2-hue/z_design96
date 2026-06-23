import { useState, type FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';

export function AdminLogin() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
    } catch {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-dark)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
    }}>
      {/* Grid de fondo */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(hsla(0,0%,75%,0.05) 1px,transparent 1px),linear-gradient(90deg,hsla(0,0%,75%,0.05) 1px,transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '440px',
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '48px 40px',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div className="mono" style={{ color: 'var(--accent-cyan)', marginBottom: '16px', fontSize: '0.7rem' }}>
            Z_DESIGN96 // ACCESO RESTRINGIDO
          </div>
          <h1 style={{
            fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #fff 0%, var(--accent-cyan) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            STUDIO ADMIN
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '10px', fontSize: '0.85rem' }}>
            Panel de gestión de contenidos
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="mono" style={{ fontSize: '0.65rem', display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              EMAIL
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 16px',
                background: 'var(--bg-dark)', border: '1px solid var(--border-color)',
                borderRadius: '4px', color: 'var(--text-primary)',
                fontFamily: 'var(--font-main)', fontSize: '0.9rem',
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent-cyan)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border-color)')}
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="mono" style={{ fontSize: '0.65rem', display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              CONTRASEÑA
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 16px',
                background: 'var(--bg-dark)', border: '1px solid var(--border-color)',
                borderRadius: '4px', color: 'var(--text-primary)',
                fontFamily: 'var(--font-main)', fontSize: '0.9rem',
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent-cyan)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border-color)')}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{
              padding: '12px 16px', background: 'hsla(0,70%,50%,0.1)',
              border: '1px solid hsla(0,70%,50%,0.3)', borderRadius: '4px',
              color: 'hsl(0,80%,70%)', fontSize: '0.85rem',
            }}>
              {error}
            </div>
          )}

          <button
            id="admin-login-btn"
            type="submit"
            disabled={loading}
            style={{
              padding: '14px', marginTop: '8px',
              background: loading ? 'transparent' : 'var(--accent-cyan)',
              border: '1px solid var(--accent-cyan)',
              borderRadius: '4px',
              color: loading ? 'var(--accent-cyan)' : 'var(--bg-dark)',
              fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
              letterSpacing: '0.15em', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'VERIFICANDO...' : 'ACCEDER AL STUDIO'}
          </button>
        </form>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--border-focus)', letterSpacing: '0.1em' }}>
            ACCESO RESTRINGIDO // ANDY MASTER + OWNER
          </span>
        </div>
      </div>
    </div>
  );
}
