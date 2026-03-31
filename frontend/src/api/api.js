import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '';
const apiOrigin = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

function withImageUrl(item) {
  if (!item) return item;
  const imageUrl = item.imageUrl;
  if (!imageUrl || imageUrl.startsWith('http')) return item;
  return { ...item, imageUrl: `${apiOrigin}${imageUrl}` };
}

export async function fetchProducts() {
  const { data } = await api.get('/products');
  return Array.isArray(data) ? data.map(withImageUrl) : [];
}

export async function fetchProductsByCategory(category) {
  const { data } = await api.get(`/products/category/${category}`);
  return data;
}

export async function createProduct(payload) {
  const { data } = await api.post('/products', payload);
  return withImageUrl(data);
}

export async function createProductForm(formData) {
  const { data } = await api.post('/products/form', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return withImageUrl(data);
}

export async function updateProductForm(id, formData) {
  // Use POST for updates to match backend's multipart-friendly endpoint.
  const { data } = await api.post(`/products/${id}/form`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return withImageUrl(data);
}

export async function deleteProduct(id) {
  await api.delete(`/products/${id}`);
}

export async function register(payload) {
  const { data } = await api.post('/auth/register', payload);
  return data;
}

export async function login(payload) {
  const { data } = await api.post('/auth/login', payload);
  return data;
}

export async function placeOrder(payload) {
  const { data } = await api.post('/orders', payload);
  return data;
}

export async function fetchEvents() {
  const { data } = await api.get('/events');
  return data;
}

export async function createEvent(payload) {
  const { data } = await api.post('/events', payload);
  return data;
}

export async function fetchGallery() {
  const { data } = await api.get('/gallery');
  return Array.isArray(data) ? data.map(withImageUrl) : [];
}

export async function createGalleryImage(formData) {
  const { data } = await api.post('/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return withImageUrl(data);
}

export async function deleteGalleryImage(id) {
  await api.delete(`/gallery/${id}`);
}
