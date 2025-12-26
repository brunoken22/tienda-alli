import { ShoppingCart, ShoppingCartState } from "@/types/shopping-cart";
import { createContext, useContext, useReducer, ReactNode, Dispatch } from "react";

// Definición de tipos de acción corregidos
type ShoppingCartAction =
  | { type: "SET_CART"; payload: Omit<ShoppingCart, "variant">[] }
  | { type: "ADD_ITEM"; payload: Omit<ShoppingCart, "variant"> }
  | {
      type: "REMOVE_ITEM";
      payload: {
        id: string;
        variantId: string;
        variantSize: string;
        variantColorName: string;
        variantColorHex: string;
      };
    }
  | {
      type: "UPDATE_QUANTITY";
      payload: {
        quantity: number;
        id: string;
        variantId: string;
        variantSize: string;
        variantColorName: string;
        variantColorHex: string;
      };
    }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "CLEAR_CART" };

// Estado inicial
const initialState: ShoppingCartState = {
  cart: [],
  isOpen: false,
};

// Contexto
const ShoppingCartContext = createContext<
  | {
      state: ShoppingCartState;
      dispatch: Dispatch<ShoppingCartAction>;
    }
  | undefined
>(undefined);

// Función helper para identificar items únicos
function getItemUniqueKey(item: Omit<ShoppingCart, "variant">): string {
  return `${item.id}-${item.variantId}-${item.variantSize}`;
}

// Reducer corregido
function shoppingCartReducer(
  state: ShoppingCartState,
  action: ShoppingCartAction
): ShoppingCartState {
  switch (action.type) {
    case "SET_CART":
      return { ...state, cart: action.payload };

    case "ADD_ITEM":
      // Usar la función helper para comparar
      const existingItemIndex = state.cart.findIndex(
        (item) => getItemUniqueKey(item) === getItemUniqueKey(action.payload)
      );

      if (existingItemIndex > -1) {
        // Si ya existe, actualizar cantidad
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + action.payload.quantity,
        };

        // Actualizar localStorage
        const updatedLocalCart = updatedCart.map((item) => {
          const { images, price, priceOffer, title, ...data } = item;
          return data;
        });
        localStorage.setItem("shoppingCart", JSON.stringify(updatedLocalCart));

        return { ...state, cart: updatedCart };
      }

      // Si no existe, agregar nuevo item
      const { images, price, priceOffer, title, ...data } = action.payload;
      const currentLocalCart = state.cart.map((item) => {
        const { images, price, priceOffer, title, ...itemData } = item;
        return itemData;
      });

      localStorage.setItem("shoppingCart", JSON.stringify([...currentLocalCart, data]));

      return {
        ...state,
        cart: [...state.cart, action.payload],
      };

    case "REMOVE_ITEM":
      // Filtrar usando todos los identificadores
      const filteredCart = state.cart.filter(
        (item) =>
          !(
            item.id === action.payload.id &&
            item.variantId === action.payload.variantId &&
            item.variantColorHex === action.payload.variantColorHex &&
            item.variantColorName === action.payload.variantColorName &&
            item.variantSize === action.payload.variantSize
          )
      );

      // Actualizar localStorage
      const filteredLocalCart = filteredCart.map((item) => {
        const { images, price, priceOffer, title, ...data } = item;
        return data;
      });
      localStorage.setItem("shoppingCart", JSON.stringify(filteredLocalCart));

      return {
        ...state,
        cart: filteredCart,
      };

    case "UPDATE_QUANTITY":
      const updatedCart = state.cart
        .map((item) =>
          item.id === action.payload.id &&
          item.variantId === action.payload.variantId &&
          item.variantColorHex === action.payload.variantColorHex &&
          item.variantColorName === action.payload.variantColorName &&
          item.variantSize === action.payload.variantSize
            ? { ...item, quantity: Math.max(0, action.payload.quantity) } // Evitar cantidades negativas
            : item
        )
        .filter((item) => item.quantity > 0); // Eliminar items con cantidad 0

      const updatedLocalCartForQuantity = updatedCart.map((item) => {
        const { images, price, priceOffer, title, ...data } = item;
        return data;
      });
      localStorage.setItem("shoppingCart", JSON.stringify(updatedLocalCartForQuantity));

      return {
        ...state,
        cart: updatedCart,
      };

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "OPEN_CART":
      return { ...state, isOpen: true };

    case "CLOSE_CART":
      return { ...state, isOpen: false };

    case "CLEAR_CART":
      localStorage.removeItem("shoppingCart");
      return { ...state, cart: [] };

    default:
      return state;
  }
}

// Provider
export function ShoppingCartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(shoppingCartReducer, initialState);

  return (
    <ShoppingCartContext.Provider value={{ state, dispatch }}>
      {children}
    </ShoppingCartContext.Provider>
  );
}

// Hook principal
export function useShoppingCart() {
  const context = useContext(ShoppingCartContext);
  if (context === undefined) {
    throw new Error("useShoppingCart must be used within a ShoppingCartProvider");
  }
  return context;
}

// Hook de conveniencia para acciones comunes (CORREGIDO)
export function useShoppingCartActions() {
  const { dispatch } = useShoppingCart();

  return {
    // Agregar item al carrito
    addItem: (item: Omit<ShoppingCart, "variant">) => dispatch({ type: "ADD_ITEM", payload: item }),

    // Eliminar item específico por sus identificadores únicos
    removeItem: (
      id: string,
      variantId: string,
      variantSize: string,
      variantColorName: string,
      variantColorHex: string
    ) =>
      dispatch({
        type: "REMOVE_ITEM",
        payload: { id, variantId, variantSize, variantColorName, variantColorHex },
      }),

    // Actualizar cantidad de un item específico
    updateQuantity: (
      id: string,
      variantId: string,
      variantSize: string,
      variantColorHex: string,
      variantColorName: string,
      quantity: number
    ) =>
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id, variantId, variantSize, quantity, variantColorHex, variantColorName },
      }),

    // Alternar visibilidad del carrito
    toggleCart: () => dispatch({ type: "TOGGLE_CART" }),

    // Abrir carrito
    openCart: () => dispatch({ type: "OPEN_CART" }),

    // Cerrar carrito
    closeCart: () => dispatch({ type: "CLOSE_CART" }),

    // Vaciar carrito completamente
    clearCart: () => dispatch({ type: "CLEAR_CART" }),

    // Establecer carrito completo (útil para sincronización)
    setCart: (cart: Omit<ShoppingCart, "variant">[]) =>
      dispatch({ type: "SET_CART", payload: cart }),
  };
}

// Hook adicional para cálculos comunes (OPCIONAL pero útil)
export function useShoppingCartCalculations() {
  const { state } = useShoppingCart();

  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = state.cart.reduce((sum, item) => {
    const price = item.priceOffer || item.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const uniqueItems = state.cart.length;

  return {
    totalItems,
    subtotal,
    uniqueItems,
    isEmpty: state.cart.length === 0,
  };
}
