const categoryFallback = {
  COFFEE:
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
  FOOD:
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80',
  CYCLING_GEAR:
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
  APPAREL:
    'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?auto=format&fit=crop&w=1200&q=80',
  NUTRITION:
    'https://images.unsplash.com/photo-1579722821273-0f6c6b1d34b6?auto=format&fit=crop&w=1200&q=80',
};

const productOverrides = {
  espresso:
    'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=80',
  'oat flat white':
    'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1200&q=80',
  'avocado toast':
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80',
  'energy bar':
    'https://images.unsplash.com/photo-1622480916113-8f6f03cb4a3f?auto=format&fit=crop&w=1200&q=80',
  'cycling gloves':
    'https://images.unsplash.com/photo-1610384104075-e05c5e95d307?auto=format&fit=crop&w=1200&q=80',
  'club jersey':
    'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1200&q=80',
};

export function getProductImage(product) {
  if (product?.imageUrl) return product.imageUrl;
  const key = String(product?.name || '').trim().toLowerCase();
  if (productOverrides[key]) return productOverrides[key];
  return categoryFallback[product?.category] || categoryFallback.COFFEE;
}

