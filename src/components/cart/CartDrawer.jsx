"use client";
import { FiShoppingBag } from "react-icons/fi";
import Drawer from "@/components/ui/Drawer";
import Button from "@/components/ui/Button";
import CartItem from "./CartItem";
import FreeShippingBar from "./FreeShippingBar";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { items, drawerOpen, closeDrawer, setQty, remove, subtotal, count } = useCart();
  const empty = items.length === 0;
  return (
    <Drawer
      open={drawerOpen} onClose={closeDrawer} title={empty ? "Your cart" : `Your cart (${count})`}
      footer={!empty && (
        <div className="space-y-4">
          <FreeShippingBar subtotal={subtotal} />
          <div className="flex items-baseline justify-between">
            <span className="text-ink-soft">Subtotal</span>
            <span className="text-xl font-medium">{formatPrice(subtotal)}</span>
          </div>
          <Button href="/checkout" onClick={closeDrawer} size="lg" className="w-full">Checkout</Button>
          <Button href="/cart" onClick={closeDrawer} variant="ghost" className="w-full">View full cart</Button>
        </div>
      )}
    >
      {empty ? (
        <div className="flex h-full flex-col items-center justify-center px-8 py-16 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-blush text-rani"><FiShoppingBag size={26} /></div>
          <p className="mt-5 text-display-sm">Nothing here yet</p>
          <p className="mt-2 text-ink-soft">Gifts you add will wait here for you.</p>
          <Button href="/shop" onClick={closeDrawer} className="mt-6">Browse gifts</Button>
        </div>
      ) : (
        <div className="divide-y divide-line px-5">
          {items.map((item) => <CartItem key={item.lineId} item={item} compact onQty={setQty} onRemove={remove} onNavigate={closeDrawer} />)}
        </div>
      )}
    </Drawer>
  );
}
