import { useEffect, useState, useRef, useCallback, type DragEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchProjectById, upsertProject, uploadFile,
  deleteGalleryItem, deleteDocument, upsertDocument,
  type ProjectDB, type GalleryItem, type DocumentItem,
} from '../../lib/api';
import { supabase } from '../../lib/supabase';

/* ─── Imagen de galería editable ──────────────────────────────────────────── */
function GalleryCard({
  item, index, total,
  onDelete, onMove,
}: {
  item: GalleryItem; index: number; total: number;
  onDelete: (id: number) => void;
  onMove: (from: number, to: number) => void;
}) {
  return (
    <div style={{
      position: 'relative', borderRadius: '4px', overflow: 'hidden',
      border: '1px solid var(--border-color)', aspectRatio: '1',
      background: 'var(--bg-dark)',
    }}>
      <img src={item.img_url} alt={`galeria-${index}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      
      {/* Overlay con controles */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '10px', gap: '6px',
        opacity: 0, transition: 'opacity 0.2s',
      }}
        className="gallery-overlay"
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => onMove(index, index - 1)} disabled={index === 0}
            title="Mover izquierda"
            style={btnStyle}
          >◀</button>
          <button
            onClick={() => onMove(index, index + 1)} disabled={index === total - 1}
            title="Mover derecha"
            style={btnStyle}
          >▶</button>
          <button
            onClick={() => item.id && onDelete(item.id)}
            title="Eliminar"
            style={{ ...btnStyle, marginLeft: 'auto', color: 'hsl(0,80%,70%)', borderColor: 'hsl(0,70%,50%)' }}
          >✕</button>
        </div>
        <span className="mono" style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.5)' }}>
          POS {index + 1}/{total}
        </span>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '4px 8px', background: 'rgba(0,0,0,0.6)',
  border: '1px solid rgba(255,255,255,0.2)', borderRadius: '3px',
  color: '#fff', cursor: 'pointer', fontSize: '0.7rem',
};

/* ─── Editor Principal ────────────────────────────────────────────────────── */
export function ProjectEditor() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isNew = id === 'nuevo' || !id;

  // Datos del formulario
  const [form, setForm] = useState<Partial<ProjectDB>>({
    id: '', title: '', category: '', year: new Date().getFullYear().toString(),
    img: '', description: '', is_hero: false,
  });
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  // Estados UI
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // ── Cargar datos si es edición ──
  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const { project, gallery: g, documents: d } = await fetchProjectById(id!);
        setForm(project);
        setGallery(g);
        setDocuments(d);
      } catch {
        setFeedback({ type: 'err', msg: 'Error al cargar el proyecto.' });
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew]);

  // ── Guardar proyecto ──
  const handleSave = async () => {
    if (!form.id || !form.title) {
      setFeedback({ type: 'err', msg: 'El ID y el Título son obligatorios.' });
      return;
    }
    setSaving(true);
    try {
      await upsertProject(form as ProjectDB & { id: string });
      // Guardar galería con orden actualizado
      if (gallery.length > 0) {
        const { error } = await supabase.from('project_gallery').upsert(
          gallery.map((g, i) => ({ ...g, display_order: i }))
        );
        if (error) throw error;
      }
      setFeedback({ type: 'ok', msg: '✓ Proyecto guardado correctamente.' });
      setTimeout(() => navigate('/admin'), 1200);
    } catch (err: unknown) {
      setFeedback({ type: 'err', msg: `Error al guardar: ${err}` });
    } finally {
      setSaving(false);
    }
  };

  // ── Subir imagen de portada ──
  const handleCoverUpload = async (file: File) => {
    setUploadingCover(true);
    try {
      const path = `covers/${form.id || 'draft'}_${Date.now()}_${file.name}`;
      const url = await uploadFile('project-assets', path, file);
      setForm(f => ({ ...f, img: url }));
    } catch {
      setFeedback({ type: 'err', msg: 'Error subiendo portada.' });
    } finally {
      setUploadingCover(false);
    }
  };

  // ── Subir imágenes a galería ──
  const handleGalleryUpload = async (files: FileList) => {
    setUploadingGallery(true);
    try {
      const projectId = form.id || 'draft';
      const newItems: GalleryItem[] = [];
      for (const file of Array.from(files)) {
        const path = `gallery/${projectId}_${Date.now()}_${file.name}`;
        const url = await uploadFile('project-assets', path, file);
        const { data } = await supabase.from('project_gallery').insert({
          project_id: projectId, img_url: url, display_order: gallery.length + newItems.length,
        }).select().single();
        if (data) newItems.push(data as GalleryItem);
      }
      setGallery(g => [...g, ...newItems]);
      setFeedback({ type: 'ok', msg: `✓ ${newItems.length} imagen(es) añadida(s) a la galería.` });
    } catch {
      setFeedback({ type: 'err', msg: 'Error subiendo imágenes a galería.' });
    } finally {
      setUploadingGallery(false);
    }
  };

  // ── Subir PDF / Documento ──
  const handleDocUpload = async (file: File) => {
    setUploadingDoc(true);
    try {
      const projectId = form.id || 'draft';
      const path = `docs/${projectId}_${Date.now()}_${file.name}`;
      const url = await uploadFile('project-assets', path, file);
      const newDoc: DocumentItem = { project_id: projectId, doc_name: file.name, doc_url: url };
      await upsertDocument(newDoc);
      const { data } = await supabase.from('project_documents')
        .select('*').eq('doc_url', url).single();
      if (data) setDocuments(d => [...d, data as DocumentItem]);
      setFeedback({ type: 'ok', msg: `✓ Documento "${file.name}" adjuntado.` });
    } catch {
      setFeedback({ type: 'err', msg: 'Error subiendo documento.' });
    } finally {
      setUploadingDoc(false);
    }
  };

  // ── Mover imagen en galería ──
  const handleMoveGallery = useCallback((from: number, to: number) => {
    if (to < 0 || to >= gallery.length) return;
    setGallery(g => {
      const arr = [...g];
      [arr[from], arr[to]] = [arr[to], arr[from]];
      return arr;
    });
  }, [gallery.length]);

  // ── Eliminar imagen de galería ──
  const handleDeleteGalleryItem = async (itemId: number) => {
    if (!confirm('¿Eliminar esta imagen de la galería?')) return;
    await deleteGalleryItem(itemId);
    setGallery(g => g.filter(i => i.id !== itemId));
  };

  // ── Eliminar documento ──
  const handleDeleteDoc = async (docId: number) => {
    if (!confirm('¿Eliminar este documento?')) return;
    await deleteDocument(docId);
    setDocuments(d => d.filter(i => i.id !== docId));
  };

  // ── Drag & Drop sobre galería ──
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleGalleryUpload(files);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
        <div className="mono" style={{ color: 'var(--accent-cyan)' }}>CARGANDO PROYECTO...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}>
      
      {/* Barra de acción superior */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-color)',
        padding: '0 32px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/admin')}
            style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}
          >
            ← DASHBOARD
          </button>
          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }} />
          <div>
            <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>
              {isNew ? 'NUEVO PROYECTO' : `EDITANDO // ${form.id}`}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {feedback && (
            <span style={{
              fontSize: '0.8rem', padding: '6px 12px', borderRadius: '4px',
              background: feedback.type === 'ok' ? 'hsla(160,80%,40%,0.15)' : 'hsla(0,70%,50%,0.15)',
              color: feedback.type === 'ok' ? 'hsl(160,80%,60%)' : 'hsl(0,80%,70%)',
              border: `1px solid ${feedback.type === 'ok' ? 'hsl(160,70%,40%)' : 'hsl(0,70%,50%)'}`,
            }}>
              {feedback.msg}
            </span>
          )}
          <button
            id="editor-save-btn"
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '10px 24px',
              background: saving ? 'transparent' : 'var(--accent-cyan)',
              border: '1px solid var(--accent-cyan)', borderRadius: '4px',
              color: saving ? 'var(--accent-cyan)' : 'var(--bg-dark)',
              fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
              letterSpacing: '0.15em', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {saving ? 'GUARDANDO...' : 'GUARDAR PROYECTO'}
          </button>
        </div>
      </header>

      {/* Layout de dos columnas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '0', maxWidth: '1600px', margin: '0 auto', minHeight: 'calc(100vh - 64px)' }}>
        
        {/* ── Columna izquierda: datos textuales ── */}
        <div style={{ padding: '48px 40px', borderRight: '1px solid var(--border-color)' }}>
          <section style={{ padding: 0, minHeight: 'unset', display: 'block' }}>
            <div className="mono" style={{ marginBottom: '32px', fontSize: '0.65rem' }}>INFORMACIÓN DEL PROYECTO</div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <Field label="ID DEL PROYECTO" required>
                <input
                  id="field-id"
                  value={form.id || ''} onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                  disabled={!isNew}
                  placeholder="P-08"
                  style={{ ...inputStyle, opacity: isNew ? 1 : 0.5, cursor: isNew ? 'text' : 'not-allowed' }}
                />
              </Field>
              <Field label="AÑO" required>
                <input
                  id="field-year"
                  value={form.year || ''} onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                  placeholder="2024" style={inputStyle}
                />
              </Field>
            </div>

            <Field label="TÍTULO DEL PROYECTO" required style={{ marginBottom: '20px' }}>
              <input
                id="field-title"
                value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="08_Nombre_Proyecto" style={inputStyle}
              />
            </Field>

            <Field label="CATEGORÍA" style={{ marginBottom: '20px' }}>
              <input
                id="field-category"
                value={form.category || ''} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                placeholder="Ej: Mobiliario Minimalista" style={inputStyle}
              />
            </Field>

            <Field label="DESCRIPCIÓN" style={{ marginBottom: '28px' }}>
              <textarea
                id="field-description"
                value={form.description || ''}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={6}
                placeholder="Descripción del proyecto, materiales, proceso de diseño..."
                style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.7' }}
              />
            </Field>

            {/* Toggle HERO */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', background: 'var(--bg-panel)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
              <div
                id="toggle-hero"
                onClick={() => setForm(f => ({ ...f, is_hero: !f.is_hero }))}
                style={{
                  width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer',
                  background: form.is_hero ? 'var(--accent-cyan)' : 'var(--border-focus)',
                  position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                }}
              >
                <div style={{
                  position: 'absolute', top: '3px',
                  left: form.is_hero ? '23px' : '3px',
                  width: '18px', height: '18px', borderRadius: '50%',
                  background: '#fff', transition: 'left 0.2s',
                }} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Proyecto Hero</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 300, textTransform: 'none' }}>
                  Los proyectos Hero aparecen destacados en la página principal.
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── Columna derecha: assets visuales ── */}
        <div style={{ padding: '48px 32px', background: 'var(--bg-panel)', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* Imagen de portada */}
          <div>
            <div className="mono" style={{ marginBottom: '16px', fontSize: '0.65rem' }}>IMAGEN DE PORTADA</div>
            <div
              id="cover-upload-zone"
              onClick={() => coverInputRef.current?.click()}
              style={{
                width: '100%', aspectRatio: '4/3',
                background: form.img ? 'transparent' : 'var(--bg-dark)',
                border: `2px dashed ${form.img ? 'transparent' : 'var(--border-focus)'}`,
                borderRadius: '4px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', position: 'relative', transition: 'all 0.2s',
              }}
            >
              {form.img ? (
                <>
                  <img src={form.img} alt="portada" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 0.2s',
                  }}
                    className="cover-overlay"
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                  >
                    <span className="mono" style={{ fontSize: '0.7rem' }}>CAMBIAR PORTADA</span>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px', opacity: 0.3 }}>📷</div>
                  <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                    {uploadingCover ? 'SUBIENDO...' : 'CLICK PARA SUBIR PORTADA'}
                  </div>
                </div>
              )}
            </div>
            <input
              ref={coverInputRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => e.target.files?.[0] && handleCoverUpload(e.target.files[0])}
            />
            <p style={{ marginTop: '8px', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 300, textTransform: 'none' }}>
              O introduce la URL manualmente:
            </p>
            <input
              id="field-img-url"
              value={form.img || ''} onChange={e => setForm(f => ({ ...f, img: e.target.value }))}
              placeholder="https://..." style={{ ...inputStyle, marginTop: '6px', fontSize: '0.75rem' }}
            />
          </div>

          {/* Galería de imágenes */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div className="mono" style={{ fontSize: '0.65rem' }}>GALERÍA ({gallery.length} imágenes)</div>
              <button
                id="add-gallery-btn"
                onClick={() => galleryInputRef.current?.click()}
                style={{
                  padding: '5px 12px', background: 'transparent',
                  border: '1px solid var(--accent-cyan)', borderRadius: '3px',
                  color: 'var(--accent-cyan)', cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                }}
              >
                + AÑADIR
              </button>
            </div>
            <input
              ref={galleryInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
              onChange={e => e.target.files && handleGalleryUpload(e.target.files)}
            />

            {/* Zona de drag & drop */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                minHeight: gallery.length ? 'auto' : '120px',
                border: `2px dashed ${dragOver ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                borderRadius: '4px', padding: gallery.length ? '0' : '20px',
                background: dragOver ? 'var(--accent-cyan-glow)' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              {gallery.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '6px', opacity: 0.3 }}>🖼️</div>
                  <div className="mono" style={{ fontSize: '0.6rem' }}>
                    {uploadingGallery ? 'SUBIENDO IMÁGENES...' : 'ARRASTRA IMÁGENES AQUÍ'}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '8px' }}>
                  {gallery.map((item, i) => (
                    <GalleryCard
                      key={item.id ?? i} item={item} index={i} total={gallery.length}
                      onDelete={handleDeleteGalleryItem}
                      onMove={handleMoveGallery}
                    />
                  ))}
                  {uploadingGallery && (
                    <div style={{
                      aspectRatio: '1', borderRadius: '4px', border: '1px dashed var(--border-focus)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--accent-cyan)' }}>SUBIENDO...</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Documentos */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div className="mono" style={{ fontSize: '0.65rem' }}>DOCUMENTOS ({documents.length})</div>
              <button
                id="add-doc-btn"
                onClick={() => docInputRef.current?.click()}
                style={{
                  padding: '5px 12px', background: 'transparent',
                  border: '1px solid var(--border-focus)', borderRadius: '3px',
                  color: 'var(--text-secondary)', cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                }}
              >
                + PDF/DOC
              </button>
            </div>
            <input
              ref={docInputRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: 'none' }}
              onChange={e => e.target.files?.[0] && handleDocUpload(e.target.files[0])}
            />

            {documents.length === 0 ? (
              <div style={{
                padding: '20px', textAlign: 'center',
                border: '1px dashed var(--border-color)', borderRadius: '4px',
              }}>
                <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>
                  {uploadingDoc ? 'SUBIENDO DOCUMENTO...' : 'SIN DOCUMENTOS ADJUNTOS'}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {documents.map(doc => (
                  <div key={doc.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 14px', background: 'var(--bg-dark)',
                    border: '1px solid var(--border-color)', borderRadius: '4px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                      <span style={{ fontSize: '1rem' }}>📄</span>
                      <span style={{ fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {doc.doc_name}
                      </span>
                    </div>
                    <button
                      onClick={() => doc.id && handleDeleteDoc(doc.id)}
                      style={{
                        background: 'none', border: 'none', color: 'hsl(0,70%,60%)',
                        cursor: 'pointer', padding: '4px', flexShrink: 0, fontSize: '0.8rem',
                      }}
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Componente auxiliar Field ──
function Field({ label, children, required, style }: {
  label: string; children: React.ReactNode; required?: boolean; style?: React.CSSProperties;
}) {
  return (
    <div style={style}>
      <label className="mono" style={{ fontSize: '0.6rem', display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
        {label}{required && <span style={{ color: 'var(--accent-cyan)' }}> *</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px',
  background: 'var(--bg-dark)', border: '1px solid var(--border-color)',
  borderRadius: '4px', color: 'var(--text-primary)',
  fontFamily: 'var(--font-main)', fontSize: '0.9rem',
  outline: 'none', transition: 'border-color 0.2s',
};
