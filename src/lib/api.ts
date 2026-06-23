import { supabase } from './supabase';

// ─── TIPOS ────────────────────────────────────────────────────────────────────
export interface ProjectDB {
  id: string;
  title: string;
  category: string;
  year: string;
  img: string;
  description: string;
  is_hero: boolean;
  created_at?: string;
}

export interface GalleryItem {
  id?: number;
  project_id: string;
  img_url: string;
  display_order: number;
}

export interface DocumentItem {
  id?: number;
  project_id: string;
  doc_name: string;
  doc_url: string;
}

// ─── PROYECTOS ────────────────────────────────────────────────────────────────
export async function fetchAllProjects(): Promise<ProjectDB[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchProjectById(id: string) {
  const [projectRes, galleryRes, docsRes] = await Promise.all([
    supabase.from('projects').select('*').eq('id', id).single(),
    supabase.from('project_gallery').select('*').eq('project_id', id).order('display_order'),
    supabase.from('project_documents').select('*').eq('project_id', id),
  ]);
  if (projectRes.error) throw projectRes.error;
  return {
    project: projectRes.data as ProjectDB,
    gallery: (galleryRes.data || []) as GalleryItem[],
    documents: (docsRes.data || []) as DocumentItem[],
  };
}

export async function upsertProject(project: Partial<ProjectDB> & { id: string }) {
  const { error } = await supabase.from('projects').upsert(project);
  if (error) throw error;
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

// ─── GALERÍA ──────────────────────────────────────────────────────────────────
export async function upsertGallery(items: GalleryItem[]) {
  const { error } = await supabase.from('project_gallery').upsert(items);
  if (error) throw error;
}

export async function deleteGalleryItem(id: number) {
  const { error } = await supabase.from('project_gallery').delete().eq('id', id);
  if (error) throw error;
}

// ─── DOCUMENTOS ───────────────────────────────────────────────────────────────
export async function upsertDocument(doc: DocumentItem) {
  const { error } = await supabase.from('project_documents').upsert(doc);
  if (error) throw error;
}

export async function deleteDocument(id: number) {
  const { error } = await supabase.from('project_documents').delete().eq('id', id);
  if (error) throw error;
}

// ─── STORAGE (subida de archivos) ─────────────────────────────────────────────
export async function uploadFile(bucket: string, path: string, file: File): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteStorageFile(bucket: string, path: string) {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}

// ─── CONTENIDO DE PÁGINAS ─────────────────────────────────────────────────────
export async function fetchPageContent(key: string): Promise<string> {
  const { data } = await supabase.from('page_content').select('content').eq('key', key).single();
  return data?.content || '';
}

export async function setPageContent(key: string, content: string) {
  const { error } = await supabase.from('page_content').upsert({ key, content });
  if (error) throw error;
}
