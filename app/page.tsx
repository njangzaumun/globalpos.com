"use client";
import { useState } from "react";

// --- Types ---
type Product = { id: number; name: string; priceUSD: number; category: string; image: string };
type CartItem = Product & { qty: number };
type Order = { id: string; total: number; method: string; time: string; items: number };
type PaymentMethod = "Cash" | "Card" | "E-Wallet";

export default function NjangPOS() {
  // --- States ---
  const [activeTab, setActiveTab] = useState<"SHIFT" | "POS" | "MENU" | "ORDERS" | "PLANS">("SHIFT");
  const [isShiftOpen, setIsShiftOpen] = useState(false);
  const [shiftSales, setShiftSales] = useState(0);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Settings
  const [lang, setLang] = useState<"EN" | "MM">("EN");
  const [currency, setCurrency] = useState<"USD" | "MMK">("USD");

  const rates = { USD: 1, MMK: 4500 };
  const symbols = { USD: "$", MMK: "Ks " };

  // --- Products State (Editable) ---
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Chicken Burger", priceUSD: 3.5, category: "Food", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80" },
    { id: 2, name: "Cheese Pizza", priceUSD: 8.0, category: "Food", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&q=80" },
    { id: 3, name: "Coca Cola", priceUSD: 1.0, category: "Drinks", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&q=80" },
  ]);

  // Form for New Product
  const [newProd, setNewProd] = useState({ name: "", price: "", cat: "Food", image: "" });

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

  // --- Views ---
  return (
    <div className="bg-slate-50 font-sans min-h-screen flex flex-col pb-20 md:pb-0">
      
      {/* Top Header & Navigation */}
      <header className="bg-indigo-700 text-white shadow-md sticky top-0 z-20">
        <div className="p-4 flex justify-between items-center max-w-7xl mx-auto w-full">
          <h1 className="text-xl font-black tracking-wider">NJANG POS</h1>
          <div className="flex gap-2">
            <select className="bg-indigo-800 border-none rounded px-2 py-1 text-sm outline-none" value={lang} onChange={(e) => setLang(e.target.value as any)}>
              <option value="EN">🇺🇸 EN</option><option value="MM">🇲🇲 MM</option>
            </select>
            <select className="bg-indigo-800 border-none rounded px-2 py-1 text-sm outline-none" value={currency} onChange={(e) => setCurrency(e.target.value as any)}>
              <option value="USD">USD</option><option value="MMK">MMK</option>
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto bg-indigo-800 px-2 scrollbar-hide text-sm md:text-base">
          {[
            { id: "SHIFT", label: "⏱️ Shift" },
            { id: "POS", label: "🛒 POS" },
            { id: "MENU", label: "📦 Menu Edit" },
            { id: "ORDERS", label: "🧾 Orders" },
            { id: "PLANS", label: "👑 Premium" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 font-bold whitespace-nowrap border-b-4 transition-all ${activeTab === tab.id ? "border-white text-white" : "border-transparent text-indigo-300 hover:text-white"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4">

        {/* 1. SHIFT VIEW */}
        {activeTab === "SHIFT" && (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
              <h2 className="text-2xl font-black mb-2">{isShiftOpen ? "Shift is OPEN 🟢" : "Shift is CLOSED 🔴"}</h2>
              <p className="text-gray-500 mb-6">Manage your daily cashier shift</p>
              
              {isShiftOpen ? (
                <>
                  <div className="bg-green-50 p-4 rounded-xl border border-green-200 mb-6">
                    <p className="text-sm font-bold text-green-700">Current Shift Sales</p>
                    <p className="text-3xl font-black text-green-700">{symbols[currency]}{getPrice(shiftSales)}</p>
                  </div>
                  <button onClick={() => { setIsShiftOpen(false); setShiftSales(0); }} className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700">
                    Close Shift
                  </button>
                </>
              ) : (
                <button onClick={() => setIsShiftOpen(true)} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700">
                  Open Shift & Start Selling
                </button>
              )}
            </div>
          </div>
        )}

        {/* 2. POS VIEW */}
        {activeTab === "POS" && (
          !isShiftOpen ? (
            <div className="text-center mt-20 p-4 bg-red-50 text-red-600 rounded-xl font-bold">
              Please Open Shift first to use POS! (Go to Shift Tab)
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Products List */}
              <section className="w-full lg:w-2/3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <button key={product.id} onClick={() => {
                      const exist = cart.find(c => c.id === product.id);
                      if (exist) setCart(cart.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c));
                      else setCart([...cart, { ...product, qty: 1 }]);
                    }} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-500 border-2 border-transparent active:scale-95 transition-all text-left">
                      <img src={product.image} alt={product.name} className="w-full h-32 object-cover" />
                      <div className="p-3">
                        <h3 className="font-bold text-gray-800 text-sm">{product.name}</h3>
                        <p className="text-indigo-600 font-black mt-1">{symbols[currency]}{getPrice(product.priceUSD)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Cart */}
              <section className="w-full lg:w-1/3 bg-white rounded-2xl shadow-lg flex flex-col h-[600px] border border-gray-200">
                <div className="p-4 bg-gray-50 border-b"><h2 className="font-black text-gray-800">Current Order ({cart.length})</h2></div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-xl border">
                      <div className="text-sm">
                        <p className="font-bold">{item.name}</p>
                        <p className="text-gray-500">{symbols[currency]}{getPrice(item.priceUSD)} x {item.qty}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black">{symbols[currency]}{getPrice(item.priceUSD * item.qty)}</span>
                        <button onClick={() => setCart(cart.filter(c => c.id !== item.id))} className="text-red-500 font-bold px-2">X</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t">
                  <div className="flex gap-2 mb-4">
                    {["Cash", "Card", "E-Wallet"].map(m => (
                      <button key={m} onClick={() => setPaymentMethod(m as PaymentMethod)} className={`flex-1 py-2 text-xs font-bold rounded-lg border-2 ${paymentMethod === m ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200"}`}>{m}</button>
                    ))}
                  </div>
                  <div className="flex justify-between font-black text-xl mb-4">
                    <span>Total:</span><span className="text-indigo-600">{symbols[currency]}{getPrice(totalUSD)}</span>
                  </div>
                  <button onClick={handleCheckout} disabled={cart.length === 0} className={`w-full py-4 rounded-xl font-black text-white ${cart.length > 0 ? "bg-indigo-600" : "bg-gray-300"}`}>PAY NOW</button>
                </div>
              </section>
            </div>
          )
        )}

        {/* 3. MENU EDIT VIEW */}
        {activeTab === "MENU" && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-black mb-4">Add New Menu Item</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input type="text" placeholder="Product Name" className="border p-3 rounded-xl w-full" value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} />
              <input type="number" placeholder="Price (USD)" className="border p-3 rounded-xl w-full" value={newProd.price} onChange={e => setNewProd({...newProd, price: e.target.value})} />
              <input type="text" placeholder="Image URL (Link)" className="border p-3 rounded-xl w-full" value={newProd.image} onChange={e => setNewProd({...newProd, image: e.target.value})} />
              <select className="border p-3 rounded-xl w-full" value={newProd.cat} onChange={e => setNewProd({...newProd, cat: e.target.value})}>
                <option value="Food">Food</option><option value="Drinks">Drinks</option><option value="Dessert">Dessert</option>
              </select>
            </div>
            <button onClick={handleAddProduct} className="bg-green-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-700 w-full md:w-auto">➕ Add Product</button>
            
            <h2 className="text-xl font-black mt-10 mb-4">Current Menu ({products.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map(p => (
                <div key={p.id} className="border p-3 rounded-xl flex items-center gap-3">
                  <img src={p.image} className="w-12 h-12 rounded object-cover" />
                  <div><p className="font-bold text-sm">{p.name}</p><p className="text-gray-500 text-xs">${p.priceUSD}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. ORDERS HISTORY VIEW */}
        {activeTab === "ORDERS" && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-black mb-4 flex justify-between">Order Summary <span>{orders.length} Orders</span></h2>
            {orders.length === 0 ? <p className="text-gray-400">No orders yet...</p> : (
              <div className="space-y-3">
                {orders.map(o => (
                  <div key={o.id} className="flex justify-between items-center p-4 border rounded-xl bg-gray-50">
                    <div>
                      <p className="font-bold text-indigo-700">{o.id}</p>
                      <p className="text-xs text-gray-500">{o.time} • {o.items} items • {o.method}</p>
                    </div>
                    <p className="font-black">{symbols[currency]}{getPrice(o.total)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. PLANS / SaaS VIEW */}
        {activeTab === "PLANS" && (
          <div className="text-center">
            <h2 className="text-3xl font-black mb-2">Upgrade NJANG POS</h2>
            <p className="text-gray-500 mb-8">Choose the perfect plan for your business</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              
              {/* Basic */}
              <div className="bg-white p-6 rounded-2xl shadow border-2 border-gray-100">
                <h3 className="text-xl font-bold">Basic Plan</h3>
                <p className="text-4xl font-black my-4">$19<span className="text-sm text-gray-500">/mo</span></p>
                <ul className="text-sm text-gray-600 text-left space-y-3 mb-6">
                  <li>✅ 1 Branch / Store</li>
                  <li>✅ Basic POS System</li>
                  <li>✅ 100 Products Limit</li>
                </ul>
                <button className="w-full border-2 border-indigo-600 text-indigo-600 font-bold py-2 rounded-xl">Current Plan</button>
              </div>

              {/* Premium */}
              <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-xl transform md:-translate-y-4">
                <div className="bg-indigo-400 text-xs font-bold inline-block px-3 py-1 rounded-full mb-2">MOST POPULAR</div>
                <h3 className="text-xl font-bold">Premium</h3>
                <p className="text-4xl font-black my-4">$49<span className="text-sm text-indigo-200">/mo</span></p>
                <ul className="text-sm text-indigo-100 text-left space-y-3 mb-6">
                  <li>✅ Up to 5 Branches</li>
                  <li>✅ Advanced Inventory</li>
                  <li>✅ Unlimited Products</li>
                  <li>✅ Multi-Language/Currency</li>
                </ul>
                <button className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-gray-100">Upgrade to Premium</button>
              </div>

              {/* Enterprise */}
              <div className="bg-gray-900 text-white p-6 rounded-2xl shadow">
                <h3 className="text-xl font-bold">Enterprise</h3>
                <p className="text-4xl font-black my-4">Custom</p>
                <ul className="text-sm text-gray-400 text-left space-y-3 mb-6">
                  <li>✅ Unlimited Branches</li>
                  <li>✅ AI Sales Predictions</li>
                  <li>✅ Custom Domain & Branding</li>
                  <li>✅ 24/7 Dedicated Support</li>
                </ul>
                <button className="w-full border-2 border-gray-600 font-bold py-2 rounded-xl hover:bg-gray-800">Contact Sales</button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
