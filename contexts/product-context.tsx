import { createContext, useContext, useReducer, ReactNode, Dispatch } from "react";

export type TypeCompra = {
  cantidad: number;
  id: string;
  title: string;
  price: number;
  img: string;
  size: string;
};

type ShoppingCartState = {
  cart: TypeCompra[];
  isOpen: boolean;
};

type ShoppingCartAction =
  | { type: "SET_CART"; payload: TypeCompra[] }
  | { type: "ADD_ITEM"; payload: TypeCompra }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; cantidad: number } }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "CLEAR_CART" };

const initialState: ShoppingCartState = {
  cart: [],
  isOpen: false,
};

const ShoppingCartContext = createContext<
  | {
      state: ShoppingCartState;
      dispatch: Dispatch<ShoppingCartAction>;
    }
  | undefined
>(undefined);

function shoppingCartReducer(
  state: ShoppingCartState,
  action: ShoppingCartAction
): ShoppingCartState {
  switch (action.type) {
    case "SET_CART":
      return { ...state, cart: action.payload };

    case "ADD_ITEM":
      const existingItemIndex = state.cart.findIndex(
        (item) => item.id === action.payload.id && item.size === action.payload.size
      );
      if (existingItemIndex > -1) {
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].cantidad += action.payload.cantidad;
        return { ...state, cart: updatedCart };
      }
      return { ...state, cart: [...state.cart, action.payload] };

    case "REMOVE_ITEM":
      return {
        ...state,
        cart: state.cart.filter(
          (item) => !(item.id === action.payload && item.size === action.payload)
        ),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id ? { ...item, cantidad: action.payload.cantidad } : item
        ),
      };

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "OPEN_CART":
      return { ...state, isOpen: true };

    case "CLOSE_CART":
      return { ...state, isOpen: false };

    case "CLEAR_CART":
      return { ...state, cart: [] };

    default:
      return state;
  }
}

export function ShoppingCartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(shoppingCartReducer, initialState);

  return (
    <ShoppingCartContext.Provider value={{ state, dispatch }}>
      {children}
    </ShoppingCartContext.Provider>
  );
}

export function useShoppingCart() {
  const context = useContext(ShoppingCartContext);
  if (context === undefined) {
    throw new Error("useShoppingCart must be used within a ShoppingCartProvider");
  }
  return context;
}

// Hook de conveniencia para acciones comunes
export function useShoppingCartActions() {
  const { dispatch } = useShoppingCart();

  return {
    addItem: (item: TypeCompra) => dispatch({ type: "ADD_ITEM", payload: item }),
    removeItem: (id: string) => dispatch({ type: "REMOVE_ITEM", payload: id }),
    updateQuantity: (id: string, cantidad: number) =>
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, cantidad } }),
    toggleCart: () => dispatch({ type: "TOGGLE_CART" }),
    openCart: () => dispatch({ type: "OPEN_CART" }),
    closeCart: () => dispatch({ type: "CLOSE_CART" }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
    setCart: (cart: TypeCompra[]) => dispatch({ type: "SET_CART", payload: cart }),
  };
}
