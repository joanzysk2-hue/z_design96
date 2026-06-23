import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LogIn } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Credenciales inválidas. Inténtalo de nuevo.');
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'var(--bg-primary)',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ 
        width: '100%', 
        maxWidth: '400px', 
        padding: '40px', 
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="mono" style={{ color: 'var(--accent-cyan)', marginBottom: '10px', fontSize: '0.8rem' }}>
          Z_DESIGN // ACCESO RESTRINGIDO
        </div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '30px', fontWeight: 500 }}>SISTEMA DE GESTIÓN</h2>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label className="mono" style={{ display: 'block', fontSize: '0.7rem', marginBottom: '8px', opacity: 0.6 }}>EMAIL</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ 
                width: '100%', 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                padding: '12px', 
                borderRadius: '4px',
                color: 'white',
                outline: 'none',
                fontFamily: 'inherit'
              }} 
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label className="mono" style={{ display: 'block', fontSize: '0.7rem', marginBottom: '8px', opacity: 0.6 }}>CONTRASEÑA</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ 
                width: '100%', 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                padding: '12px', 
                borderRadius: '4px',
                color: 'white',
                outline: 'none',
                fontFamily: 'inherit'
              }} 
            />
          </div>

          {error && (
            <div style={{ color: '#ff4b4b', fontSize: '0.8rem', marginBottom: '20px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-outline" 
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            {loading ? 'CARGANDO...' : (
              <>
                <LogIn size={18} />
                ENTRAR AL PANEL
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
