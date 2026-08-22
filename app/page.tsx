"use client";
import { useState } from "react";

// --- Types ---
type Product = { id: number; name: string; priceUSD: number; category: string; image: string };
type CartItem = Product & { qty: number };
type Order = { id: string; total: number; method: string; time: string; items: number };
type PaymentMethod = "Cash" | "Card" | "E-Wallet";
type RightTab = "CART" | "SHIFT" | "ORDERS" | "SETTINGS";

export default function GlobalPOS() {
  // --- States ---
  const [activeRightTab, setActiveRightTab] = useState<RightTab>("CART");
  const [isShiftOpen, setIsShiftOpen] = useState(false);
  const [shiftSales, setShiftSales] = useState(0);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Settings & Menu Edit
  const [lang, setLang] = useState<"EN" | "MM">("EN");
  const [currency, setCurrency] = useState<"USD" | "MMK">("USD");
  const [newProd, setNewProd] = useState({ name: "", price: "", cat: "Food", image: "" });

  const rates = { USD: 1, MMK: 4500 };
  const symbols = { USD: "$", MMK: "Ks " };

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Chicken Burger", priceUSD: 3.5, category: "Food", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80" },
    { id: 2, name: "Cheese Pizza", priceUSD: 8.0, category: "Food", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&q=80" },
    { id: 3, name: "French Fries", priceUSD: 2.0, category: "Food", image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=300&q=80" },
    { id: 4, name: "Coca Cola", priceUSD: 1.0, category: "Drinks", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&q=80" },
  ]);

  const categories = ["All", "Food", "Drinks", "Dessert"];

  const filteredProducts = activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory);

  // --- Helpers ---
  const getPrice = (priceUSD: number) => {
    const converted = priceUSD * rates[currency];
    return currency === "MMK" ? Math.round(converted).toLocaleString() : converted.toFixed(2);
  };

  const totalUSD = cart.reduce((sum, item) => sum + item.priceUSD * item.qty, 0);

  const handleCheckout = () => {
    if (cart.length > 0) {
      const newOrder = {
        id: "ORD-" + Math.floor(Math.random() * 10000),
        total: totalUSD,
        method: paymentMethod,
        time: new Date().toLocaleTimeString(),
        items: cart.reduce((sum, item) => sum + item.qty, 0)
      };
      setOrders([newOrder, ...orders]);
      setShiftSales(shiftSales + totalUSD);
      alert(`✅ Payment Successful!\nOrder ID: ${newOrder.id}`);
      setCart([]);
    }
  };

  const handleAddProduct = () => {
    if (newProd.name && newProd.price) {
      setProducts([...products, {
        id: Date.now(),
        name: newProd.name,
        priceUSD: parseFloat(newProd.price),
        category: newProd.cat,
        image: newProd.image || "https://placehold.co/300x300?text=No+Image"
      }]);
      setNewProd({ name: "", price: "", cat: "Food", image: "" });
      alert("✅ Product Added!");
    }
  };

  return (
    <div className="bg-slate-100 font-sans min-h-screen flex flex-col lg:flex-row overflow-hidden h-screen">
      
      {/* ========================================== */}
      {/* LEFT SIDE: MAIN ORDERING SCREEN */}
      {/* ========================================== */}
      <main className="flex-1 flex flex-col h-full overflow-hidden p-4 lg:p-6">
        
        {/* Top Logo & Header */}
        <header className="mb-6 border-b-2 border-indigo-200 pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-indigo-700 tracking-tight">GlobalPOS</h1>
            <p className="text-sm font-bold text-gray-500 mt-1">by <span className="text-indigo-500">njangzaumun</span></p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isShiftOpen ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></div>
            <span className="text-sm font-bold text-gray-600">{isShiftOpen ? "Shift Open" : "Shift Closed"}</span>
          </div>
        </header>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-xl font-bold whitespace-nowrap transition-all shadow-sm ${
                activeCategory === cat ? "bg-indigo-600 text-white" : "bg-white text-gray-600 hover:bg-indigo-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto pr-2 pb-20 lg:pb-0">
          {!isShiftOpen ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-red-50 rounded-2xl border-2 border-dashed border-red-200">
              <span className="text-6xl mb-4">🔒</span>
              <h2 className="text-2xl font-black text-red-600 mb-2">Shift is Closed</h2>
              <p className="text-red-500 font-medium">Please open your shift in the right menu to start selling.</p>
              <button onClick={() => setActiveRightTab("SHIFT")} className="mt-6 bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700">Go to Shift Menu</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    const exist = cart.find(c => c.id === product.id);
                    if (exist) setCart(cart.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c));
                    else setCart([...cart, { ...product, qty: 1 }]);
                    setActiveRightTab("CART"); // Auto switch to cart
                  }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-indigo-500 border-2 border-transparent active:scale-95 transition-all text-left flex flex-col"
                >
                  <img src={product.image} alt={product.name} className="w-full h-32 object-cover bg-gray-200" />
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <h3 className="font-bold text-gray-800 text-sm leading-tight mb-2">{product.name}</h3>
                    <p className="text-indigo-600 font-black">{symbols[currency]}{getPrice(product.priceUSD)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ========================================== */}
      {/* RIGHT SIDE: SIDEBAR (Cart, Shift, Settings) */}
      {/* ========================================== */}
      <aside className="w-full lg:w-[400px] bg-white border-l shadow-2xl flex flex-col h-[60vh] lg:h-full z-20 absolute lg:relative bottom-0 lg:bottom-auto">
        
        {/* Right Sidebar Top Menu Icons */}
        <div className="flex bg-gray-900 text-gray-400">
          {[
            { id: "CART", icon: "🛒", label: "Cart" },
            { id: "SHIFT", icon: "⏱️", label: "Shift" },
            { id: "ORDERS", icon: "🧾", label: "Orders" },
            { id: "SETTINGS", icon: "⚙️", label: "Settings" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveRightTab(tab.id as RightTab)}
              className={`flex-1 flex flex-col items-center justify-center py-3 border-b-4 transition-all ${activeRightTab === tab.id ? "border-indigo-500 text-white bg-gray-800" : "border-transparent hover:text-white hover:bg-gray-800"}`}
            >
              <span className="text-xl mb-1">{tab.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right Sidebar Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
          
          {/* 1. CART & SUMMARY VIEW */}
          {activeRightTab === "CART" && (
            <div className="flex flex-col h-full">
              <div className="p-4 bg-white border-b flex justify-between items-center shadow-sm z-10">
                <h2 className="font-black text-gray-800 text-lg">Order Summary</h2>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold py-1 px-3 rounded-full">{cart.length} Items</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <span className="text-5xl mb-4">🛒</span>
                    <p className="font-medium">No items in cart</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-xl border shadow-sm">
                      <div className="text-sm">
                        <p className="font-bold text-gray-800">{item.name}</p>
                        <p className="text-gray-500">{symbols[currency]}{getPrice(item.priceUSD)} x {item.qty}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-indigo-700">{symbols[currency]}{getPrice(item.priceUSD * item.qty)}</span>
                        <button onClick={() => setCart(cart.filter(c => c.id !== item.id))} className="bg-red-100 text-red-600 w-7 h-7 rounded-full font-bold">✕</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-4 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex gap-2 mb-4">
                  {["Cash", "Card", "E-Wallet"].map(m => (
                    <button key={m} onClick={() => setPaymentMethod(m as PaymentMethod)} className={`flex-1 py-2 text-xs font-bold rounded-lg border-2 ${paymentMethod === m ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-500"}`}>{m}</button>
                  ))}
                </div>
                <div className="flex justify-between font-black text-2xl mb-4">
                  <span>Total:</span><span className="text-indigo-600">{symbols[currency]}{getPrice(totalUSD)}</span>
                </div>
                <button onClick={handleCheckout} disabled={cart.length === 0 || !isShiftOpen} className={`w-full py-4 rounded-xl font-black text-lg transition-all ${cart.length > 0 && isShiftOpen ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-300 text-gray-500"}`}>PAY NOW</button>
              </div>
            </div>
          )}

          {/* 2. SHIFT VIEW */}
          {activeRightTab === "SHIFT" && (
            <div className="p-6 flex flex-col h-full justify-center text-center">
              <span className="text-6xl mb-4">{isShiftOpen ? "🟢" : "🔴"}</span>
              <h2 className="text-2xl font-black mb-2">{isShiftOpen ? "Shift is Open" : "Shift is Closed"}</h2>
              <p className="text-gray-500 mb-8">Manage your cashier session.</p>
              
              {isShiftOpen ? (
                <>
                  <div className="bg-green-100 p-6 rounded-2xl border border-green-200 mb-6">
                    <p className="font-bold text-green-700 mb-1">Total Shift Sales</p>
                    <p className="text-4xl font-black text-green-800">{symbols[currency]}{getPrice(shiftSales)}</p>
                  </div>
                  <button onClick={() => { setIsShiftOpen(false); setShiftSales(0); }} className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 text-lg">Close Shift</button>
                </>
              ) : (
                <button onClick={() => setIsShiftOpen(true)} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 text-lg">Open Shift to Start</button>
              )}
            </div>
          )}

          {/* 3. ORDERS VIEW */}
          {activeRightTab === "ORDERS" && (
            <div className="p-4 h-full flex flex-col">
              <h2 className="font-black text-lg mb-4">Recent Orders</h2>
              <div className="flex-1 overflow-y-auto space-y-3">
                {orders.length === 0 ? <p className="text-center text-gray-400 mt-10">No orders today.</p> : (
                  orders.map(o => (
                    <div key={o.id} className="bg-white p-4 border rounded-xl shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-indigo-700">{o.id}</p>
                        <p className="font-black">{symbols[currency]}{getPrice(o.total)}</p>
                      </div>
                      <p className="text-xs text-gray-500">{o.time} • {o.items} items • Paid via {o.method}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 4. SETTINGS VIEW (Menus, Config, Plans) */}
          {activeRightTab === "SETTINGS" && (
            <div className="p-4 overflow-y-auto space-y-6">
              
              {/* App Config */}
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <h3 className="font-black text-gray-800 mb-3 flex items-center gap-2">⚙️ Preferences</h3>
                <div className="flex gap-2">
                  <select className="border p-2 rounded-lg text-sm w-full font-bold" value={lang} onChange={(e) => setLang(e.target.value as any)}>
                    <option value="EN">🇺🇸 English</option><option value="MM">🇲🇲 Myanmar</option>
                  </select>
                  <select className="border p-2 rounded-lg text-sm w-full font-bold" value={currency} onChange={(e) => setCurrency(e.target.value as any)}>
                    <option value="USD">USD ($)</option><option value="MMK">MMK (Ks)</option>
                  </select>
                </div>
              </div>

              {/* Add Product Menu */}
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <h3 className="font-black text-gray-800 mb-3 flex items-center gap-2">📦 Add New Menu</h3>
                <div className="space-y-3">
                  <input type="text" placeholder="Product Name" className="border p-3 rounded-lg w-full text-sm font-medium bg-gray-50" value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} />
                  <div className="flex gap-2">
                    <input type="number" placeholder="Price ($)" className="border p-3 rounded-lg w-1/2 text-sm font-medium bg-gray-50" value={newProd.price} onChange={e => setNewProd({...newProd, price: e.target.value})} />
                    <select className="border p-3 rounded-lg w-1/2 text-sm font-medium bg-gray-50" value={newProd.cat} onChange={e => setNewProd({...newProd, cat: e.target.value})}>
                      <option value="Food">Food</option><option value="Drinks">Drinks</option><option value="Dessert">Dessert</option>
                    </select>
                  </div>
                  <input type="text" placeholder="Image URL" className="border p-3 rounded-lg w-full text-sm font-medium bg-gray-50" value={newProd.image} onChange={e => setNewProd({...newProd, image: e.target.value})} />
                  <button onClick={handleAddProduct} className="bg-gray-900 text-white font-bold py-3 px-4 rounded-lg w-full hover:bg-black text-sm">Add to Menu</button>
                </div>
              </div>

              {/* SaaS Plans */}
              <div className="bg-indigo-600 text-white p-5 rounded-xl shadow-lg">
                <h3 className="font-black text-lg mb-1 flex items-center gap-2">👑 Premium Plan</h3>
                <p className="text-indigo-200 text-xs mb-4">Upgrade for unlimited branches & AI features.</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-3xl font-black">$49<span className="text-sm font-normal">/mo</span></span>
                </div>
                <button className="bg-white text-indigo-700 w-full py-2 rounded-lg font-bold text-sm hover:bg-gray-100">Upgrade Now</button>
              </div>

            </div>
          )}

        </div>
      </aside>

    </div>
  );
}
