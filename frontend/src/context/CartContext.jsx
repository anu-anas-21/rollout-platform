import { createContext, useContext, useMemo, useReducer } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const id = action.product.id;
      const existing = state.items[id];
      const qty = (existing?.quantity || 0) + (action.quantity || 1);
      return {
        items: { ...state.items, [id]: { product: action.product, quantity: qty } },
      };
    }
    case 'SET_QTY': {
      const { productId, quantity } = action;
      if (quantity < 1) {
        const next = { ...state.items };
        delete next[productId];
        return { items: next };
      }
      const line = state.items[productId];
      if (!line) return state;
      return {
        items: {
          ...state.items,
          [productId]: { ...line, quantity },
        },
      };
    }
    case 'REMOVE': {
      const next = { ...state.items };
      delete next[action.productId];
      return { items: next };
    }
    case 'CLEAR':
      return { items: {} };
    default:
      return state;
  }
}

const initialState = { items: {} };

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const lines = useMemo(
    () => Object.values(state.items),
    [state.items]
  );

  const total = useMemo(() => {
    return lines.reduce((sum, line) => {
      const price = Number(line.product.price);
      return sum + price * line.quantity;
    }, 0);
  }, [lines]);

  const addToCart = (product, quantity = 1) =>
    dispatch({ type: 'ADD', product, quantity });

  const setQuantity = (productId, quantity) =>
    dispatch({ type: 'SET_QTY', productId, quantity });

  const removeLine = (productId) => dispatch({ type: 'REMOVE', productId });

  const clearCart = () => dispatch({ type: 'CLEAR' });

  const value = useMemo(
    () => ({
      lines,
      total,
      addToCart,
      setQuantity,
      removeLine,
      clearCart,
      itemCount: lines.reduce((n, l) => n + l.quantity, 0),
    }),
    [lines, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
