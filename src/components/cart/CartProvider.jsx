"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { calcDelivery } from "@/lib/utils";

const STORAGE_KEY = "tohfa.cart.v1";
const CartContext = createContext(null);

export const lineIdFor = (slug, personalisation = "") =>
  personalisation ? `${slug}::${personalisation.trim().toLowerCase()}` : slug;

const clampQty = (qty, stock) => Math.max(1, Math.min(Math.floor(qty) || 1, stock > 0 ? stock : 1));

function reducer(state, action) {
  switch (action.type) {
    case "hydrate":
      return { items: action.items, hydrated: true };
    case "add": {
      const { item, qty } = action;
      const existing = state.items.find((i) => i.lineId === item.lineId);
      if (existing) {
        return { ...state, items: state.items.map((i) => (i.lineId === item.lineId ? { ...i, ...item, qty: clampQty(i.qty + qty, item.stock) } : i)) };
      }
      return { ...state, items: [...state.items, { ...item, qty: clampQty(qty, item.stock) }] };
    }
    case "setQty":
      return { ...state, items: state.items.map((i) => (i.lineId === action.lineId ? { ...i, qty: clampQty(action.qty, i.stock) } : i)) };
    case "remove":
      return { ...state, items: state.items.filter((i) => i.lineId !== action.lineId) };
    case "replace":
      return { ...state, items: action.items };
    case "clear":
      return { ...state, items: [] };
    default:
      return state;
  }
}

const isValidItem = (i) => i && typeof i.slug === "string" && typeof i.lineId === "string" && Number.isFinite(i.price) && Number.isFinite(i.qty) && i.qty > 0;

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [], hydrated: false });
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Load from localStorage once on the client
  useEffect(() => {
    let items = [];
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(parsed)) items = parsed.filter(isValidItem);
    } catch { /* corrupted storage: start empty */ }
    dispatch({ type: "hydrate", items });
  }, []);

  // Persist
  useEffect(() => {
    if (!state.hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items)); } catch { /* storage full or blocked */ }
  }, [state.items, state.hydrated]);

  // Keep tabs in sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY) return;
      try { dispatch({ type: "replace", items: JSON.parse(e.newValue || "[]").filter(isValidItem) }); } catch { /* ignore */ }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addItem = useCallback((product, qty = 1, personalisation = "", { openDrawer = true } = {}) => {
    if (!product || product.stock <= 0) return false;
    const p = personalisation.trim();
    dispatch({
      type: "add",
      qty,
      item: {
        lineId: lineIdFor(product.slug, p), slug: product.slug, name: product.name, price: product.price,
        image: product.images?.[0] || "", stock: product.stock, personalisation: p, categorySlug: product.categorySlug,
      },
    });
    if (openDrawer) setDrawerOpen(true);
    return true;
  }, []);

  const value = useMemo(() => {
    const subtotal = state.items.reduce((s, i) => s + i.price * i.qty, 0);
    const delivery = calcDelivery(subtotal);
    return {
      items: state.items,
      hydrated: state.hydrated,
      count: state.items.reduce((s, i) => s + i.qty, 0),
      subtotal, delivery, total: subtotal + delivery,
      addItem,
      setQty: (lineId, qty) => dispatch({ type: "setQty", lineId, qty }),
      remove: (lineId) => dispatch({ type: "remove", lineId }),
      replaceItems: (items) => dispatch({ type: "replace", items }),
      clear: () => dispatch({ type: "clear" }),
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    };
  }, [state, drawerOpen, addItem]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};
