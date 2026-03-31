import { useCart } from '../context/CartContext.jsx';
import { formatAED } from '../utils/money.js';
import { getProductImage } from '../utils/productImages.js';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="card-premium h-100 border-0 p-2">
      <img
        src={getProductImage(product)}
        alt={product.name}
        className="product-card-image"
        loading="lazy"
      />
      <div className="card-body d-flex flex-column">
        <span className="filli-badge align-self-start mb-3">{product.category}</span>
        <h5 className="card-title fw-bold">{product.name}</h5>
        <p className="card-text text-muted mb-4 flex-grow-1">{product.description}</p>
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className="fw-bolder fs-5 text-dark">{formatAED(product.price)}</span>
          <button type="button" className="btn btn-orange btn-sm shadow-sm" onClick={() => addToCart(product)}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
