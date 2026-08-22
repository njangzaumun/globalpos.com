"use client";
import { useState, useMemo } from "react";

// --- Types ---
type Product = { id: string; name: string; priceUSD: number; category: string; image: string; stock: number };
type CartItem = Product & { qty: number };
type Tab = "POS" | "ORDERS" | "REPORTS" | "SETTINGS";

type ShiftMetrics = {
  gross: number;
  net: number;
  tax: number;
  discount: number;
  cash: number;
  card: number;
  wallet: number;
  orders: number;
};

export default function PremiumPOS() {
  // --- Core State Management ---
  const [activeTab, setActiveTab] = useState<Tab>("POS"); 
  const [isShiftOpen, setIsShiftOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);

  // --- Reports & Shift State ---
  const initialShift: ShiftMetrics = { gross: 0, net: 0, tax: 0, discount: 0, cash: 0, card: 0, wallet: 0, orders: 0 };
  const [currentShift, setCurrentShift] = useState<ShiftMetrics>(initialShift);
  const [pastShifts, setPastShifts] = useState<(ShiftMetrics & { id: string, date: string })[]>([]);
  const [ordersList, setOrdersList] = useState<{id: string, time: string, total: number, method: string}[]>([]);

  // --- Settings State ---
  const [storeName, setStoreName] = useState("GlobalPOS");
  const [taxRate, setTaxRate] = useState(5);
  const [currency, setCurrency] = useState<"USD" | "MMK" | "MYR" | "THB" | "SGD">("USD");
  const [lang, setLang] = useState("EN");
  const [newProd, setNewProd] = useState({ name: "", price: "", cat: "Meals", image: "" });

  const rates = { USD: 1, MMK: 4500, MYR: 4.7, THB: 35, SGD: 1.35 };
  const symbols = { USD: "$", MMK: "Ks ", MYR: "RM", THB: "฿", SGD: "S$" };

  // --- Mock Data ---
  const categories = ["All", "Coffee", "Pastry", "Meals", "Beverages"];
  const [products, setProducts] = useState<Product[]>([
    { id: "P1", name: "Caramel Macchiato", priceUSD: 4.5, category: "Coffee", stock: 50, image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=300&q=80" },
    { id: "P2", name: "Espresso Roast", priceUSD: 3.0, category: "Coffee", stock: 100, image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=300&q=80" },
    { id: "P3", name: "Butter Croissant", priceUSD: 2.5, category: "Pastry", stock: 20, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&q=80" },
    { id: "P4", name: "Avocado Toast", priceUSD: 6.5, category: "Meals", stock: 15, image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=300&q=80" },
    { id: "P5", name: "Grilled Chicken", priceUSD: 9.0, category: "Meals", stock: 10, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80" },
    { id: "P6", name: "Matcha Latte", priceUSD: 5.0, category: "Beverages", stock: 40, image: "https://images.unsplash.com/photo-1536935338773-84642228f257?w=300&q=80" },
  ]);

  // --- Logic & Helpers ---
  const getPrice = (priceUSD: number) => {
    const converted = priceUSD * rates[currency];
    return currency === "MMK" ? Math.round(converted).toLocaleString() : converted.toFixed(2);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery, products]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const exist = prev.find(item => item.id === product.id);
      if (exist) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const subTotalUSD = cart.reduce((sum, item) => sum + (item.priceUSD * item.qty), 0);
  const taxAmountUSD = subTotalUSD * (taxRate / 100);
  const discountUSD = discount / rates[currency];
  const grandTotalUSD = subTotalUSD + taxAmountUSD - discountUSD;

  const handlePay = (method: string) => {
    // 1. Update Shift Metrics
    setCurrentShift(prev => ({
      gross: prev.gross + subTotalUSD,
      tax: prev.tax + taxAmountUSD,
      discount: prev.discount + discountUSD,
      net: prev.net + grandTotalUSD,
      orders: prev.orders + 1,
      cash: method === "Cash" ? prev.cash + grandTotalUSD : prev.cash,
      card: method === "Credit Card" ? prev.card + grandTotalUSD : prev.card,
      wallet: method === "E-Wallet" ? prev.wallet + grandTotalUSD : prev.wallet,
    }));

    // 2. Add to Orders List
    const orderId = "INV-" + Math.floor(Math.random() * 10000);
    setOrdersList([{ id: orderId, time: new Date().toLocaleTimeString(), total: grandTotalUSD, method }, ...ordersList]);

    alert(`✅ Payment Success!\nOrder ID: ${orderId}\nTotal: ${symbols[currency]}${getPrice(grandTotalUSD)}`);
    setCart([]);
    setDiscount(0);
  };

  const handleShiftToggle = () => {
    if (isShiftOpen) {
      if (currentShift.orders > 0) {
        setPastShifts([{ 
          id: "Z-" + Math.floor(Math.random() * 1000), 
          date: new Date().toLocaleString(), 
          ...currentShift 
        }, ...pastShifts]);
        alert("📊 Shift Closed. Z-Report generated successfully.");
      } else {
        alert("Shift closed with no sales.");
      }
      setCurrentShift(initialShift);
      setIsShiftOpen(false);
    } else {
      setIsShiftOpen(true);
      setActiveTab("POS");
    }
  };

  const handleAddProduct = () => {
    if (newProd.name && newProd.price) {
      setProducts([...products, {
        id: "P" + Date.now(),
        name: newProd.name,
        priceUSD: parseFloat(newProd.price) / rates[currency],
        category: newProd.cat,
        stock: 50,
        image: newProd.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80"
      }]);
      setNewProd({ name: "", price: "", cat: "Meals", image: "" });
      alert("✅ Product Added to Menu!");
    }
  };

  // --- SVGs ---
  const IconHome = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2h-2a2 2 0 01-2-2v-2z" /></svg>;
  const IconOrders = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
  const IconReports = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
  const IconSettings = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {/* --- 1. LEFT SIDEBAR --- */}
      <aside className="w-20 lg:w-24 bg-slate-900 flex flex-col items-center py-6 shadow-2xl z-20 shrink-0">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl mb-8 shadow-lg shadow-indigo-600/30">
          {storeName.charAt(0).toUpperCase()}
        </div>
        <nav className="flex-1 flex flex-col gap-6 w-full">
          {[
            { id: "POS", icon: <IconHome />, label: "POS" },
            { id: "ORDERS", icon: <IconOrders />, label: "Orders" },
            { id: "REPORTS", icon: <IconReports />, label: "Reports" },
            { id: "SETTINGS", icon: <IconSettings />, label: "Settings" }
          ].map(tab => (
            <button 
              key={tab.id} onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex flex-col items-center justify-center w-full py-3 border-r-4 transition-all ${activeTab === tab.id ? "text-indigo-400 border-indigo-500 bg-slate-800" : "text-slate-500 border-transparent hover:text-slate-300"}`}
            >
              {tab.icon}
              <span className="text-[10px] uppercase font-bold mt-2 tracking-widest">{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* --- 2. MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
        
        {/* Header */}
        <header className="h-20 bg-white border-b px-6 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{storeName}</h1>
            <p className="text-xs font-bold text-slate-400">by njangzaumun</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 w-64 border focus-within:border-indigo-400 focus-within:bg-white transition-all">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Search products..." className="bg-transparent border-none outline-none text-sm ml-2 w-full font-medium" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            
            <button onClick={handleShiftToggle} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-colors ${isShiftOpen ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100" : "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${isShiftOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></div>
              {isShiftOpen ? "Close Shift" : "Open Shift"}
            </button>
          </div>
        </header>

        {/* --- POS VIEW --- */}
        {activeTab === "POS" && (
          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            {!isShiftOpen ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm">🔒</div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">Register is Closed</h2>
                <p className="text-slate-500 font-medium mb-6">Open your shift to start processing sales.</p>
                <button onClick={handleShiftToggle} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">Open Shift Now</button>
              </div>
            ) : (
              <>
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide shrink-0 mb-2">
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCategory === cat ? "bg-slate-900 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"}`}>
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex-1 overflow-y-auto pb-32 lg:pb-0 pr-2">
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {filteredProducts.map((product) => (
                      <button key={product.id} onClick={() => addToCart(product)} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-300 active:scale-95 transition-all text-left flex flex-col">
                        <div className="w-full h-36 md:h-44 relative overflow-hidden bg-slate-100">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-black text-slate-700">{product.stock} IN STOCK</div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <h3 className="font-bold text-slate-800 text-sm leading-snug mb-1">{product.name}</h3>
                          <p className="text-indigo-600 font-black text-lg">{symbols[currency]}{getPrice(product.priceUSD)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* --- ORDERS VIEW --- */}
        {activeTab === "ORDERS" && (
          <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-slate-50">
            <h2 className="text-3xl font-black text-slate-800 mb-8 flex justify-between items-center">
              Transaction History
              <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">{ordersList.length} Orders Today</span>
            </h2>
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b text-slate-500 text-sm">
                    <th className="p-4 font-bold">Order ID</th>
                    <th className="p-4 font-bold">Time</th>
                    <th className="p-4 font-bold">Payment Method</th>
                    <th className="p-4 font-bold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersList.length === 0 ? (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-400">No transactions yet.</td></tr>
                  ) : (
                    ordersList.map(o => (
                      <tr key={o.id} className="border-b hover:bg-slate-50">
                        <td className="p-4 font-bold text-indigo-600">{o.id}</td>
                        <td className="p-4 text-sm text-slate-600">{o.time}</td>
                        <td className="p-4 text-sm"><span className="bg-slate-100 px-2 py-1 rounded text-slate-700 border">{o.method}</span></td>
                        <td className="p-4 font-black text-right">{symbols[currency]}{getPrice(o.total)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- REPORTS & Z-REPORT VIEW --- */}
        {activeTab === "REPORTS" && (
          <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-slate-50">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-slate-800">Daily Closing Reports</h2>
              <button onClick={handleShiftToggle} disabled={!isShiftOpen} className="bg-slate-900 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-slate-800 disabled:opacity-50">Generate Z-Report Now</button>
            </div>
            
            {/* Live Current Shift Stats */}
            <h3 className="text-lg font-black text-slate-700 mb-4 flex items-center gap-2">
              <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span>
              Live Shift Analytics (Not Closed)
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <div className="bg-white p-5 rounded-2xl border shadow-sm">
                <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Net Sales</p>
                <p className="text-3xl font-black text-emerald-600">{symbols[currency]}{getPrice(currentShift.net)}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border shadow-sm">
                <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Gross Sales</p>
                <p className="text-2xl font-bold text-slate-800">{symbols[currency]}{getPrice(currentShift.gross)}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border shadow-sm">
                <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Total Tax Collected</p>
                <p className="text-2xl font-bold text-slate-800">{symbols[currency]}{getPrice(currentShift.tax)}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border shadow-sm">
                <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Transactions</p>
                <p className="text-2xl font-bold text-slate-800">{currentShift.orders} Orders</p>
              </div>
            </div>

            {/* Past Z-Reports */}
            <h3 className="text-lg font-black text-slate-700 mb-4">Past Z-Reports</h3>
            <div className="space-y-4">
              {pastShifts.length === 0 ? (
                <div className="p-8 bg-white border border-dashed rounded-2xl text-center text-slate-400 font-medium">No past closing reports available.</div>
              ) : (
                pastShifts.map((shift, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row justify-between gap-4 md:items-center">
                    <div>
                      <h4 className="font-black text-lg text-slate-800">{shift.id}</h4>
                      <p className="text-sm text-slate-500">Closed on: {shift.date}</p>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <div><p className="text-slate-400">Cash</p><p className="font-bold text-slate-700">{symbols[currency]}{getPrice(shift.cash)}</p></div>
                      <div><p className="text-slate-400">Card</p><p className="font-bold text-slate-700">{symbols[currency]}{getPrice(shift.card)}</p></div>
                      <div><p className="text-slate-400">Wallet</p><p className="font-bold text-slate-700">{symbols[currency]}{getPrice(shift.wallet)}</p></div>
                      <div className="pl-6 border-l"><p className="text-slate-400">Net Total</p><p className="font-black text-indigo-600 text-lg">{symbols[currency]}{getPrice(shift.net)}</p></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* --- SETTINGS VIEW --- */}
        {activeTab === "SETTINGS" && (
          <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-slate-50">
            <h2 className="text-3xl font-black text-slate-800 mb-8">System Settings</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">🏢 Store Profile</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Store Name</label>
                    <input type="text" className="w-full border p-3 rounded-xl bg-slate-50 font-bold outline-none" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Language</label>
                      <select className="w-full border p-3 rounded-xl bg-slate-50 font-bold outline-none" value={lang} onChange={(e) => setLang(e.target.value)}>
                        <option value="EN">🇺🇸 English</option>
                        <option value="MM">🇲🇲 Myanmar</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Default Currency</label>
                      <select className="w-full border p-3 rounded-xl bg-slate-50 font-bold outline-none" value={currency} onChange={(e) => setCurrency(e.target.value as any)}>
                        <option value="USD">🇺🇸 USD ($)</option>
                        <option value="MMK">🇲🇲 MMK (Ks)</option>
                        <option value="MYR">🇲🇾 MYR (RM)</option>
                        <option value="THB">🇹🇭 THB (฿)</option>
                        <option value="SGD">🇸🇬 SGD (S$)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">💰 Financial Setup</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Tax Rate (%)</label>
                    <div className="flex items-center gap-4">
                      <input type="range" min="0" max="20" className="w-full accent-indigo-600" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
                      <span className="font-black text-xl text-indigo-600 w-12">{taxRate}%</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* --- 3. RIGHT SIDEBAR (Cart) --- */}
      <aside className={`w-full lg:w-96 bg-white border-l shadow-2xl flex flex-col absolute lg:relative right-0 bottom-0 top-0 lg:top-auto transform transition-transform duration-300 z-30 ${activeTab === "POS" ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        
        <div className="p-5 border-b bg-slate-50 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</p>
              <p className="font-bold text-slate-800 text-sm">Walk-in Client</p>
            </div>
          </div>
          <button onClick={() => setCart([])} className="text-rose-500 font-bold text-sm bg-rose-50 px-3 py-1.5 rounded-lg hover:bg-rose-100">Clear</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 bg-white">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <p className="font-medium text-lg">Cart is empty</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.map((item) => (
                <li key={item.id} className="flex flex-col gap-2 pb-4 border-b border-slate-100">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800 text-sm leading-tight pr-4">{item.name}</h4>
                    <span className="font-black text-slate-800">{symbols[currency]}{getPrice(item.priceUSD * item.qty)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-400 font-medium">{symbols[currency]}{getPrice(item.priceUSD)} / each</p>
                    <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                      <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white rounded-md shadow-sm font-bold">−</button>
                      <span className="w-8 text-center text-sm font-bold text-slate-800">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white rounded-md shadow-sm font-bold">+</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-slate-50 p-5 border-t shrink-0">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm font-bold text-slate-500">
              <span>Subtotal</span><span>{symbols[currency]}{getPrice(subTotalUSD)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-500">
              <span>Tax ({taxRate}%)</span><span>{symbols[currency]}{getPrice(taxAmountUSD)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-emerald-500 cursor-pointer" onClick={() => setDiscount(discount === 0 ? 5000 : 0)}>
              <span>Discount {discount > 0 && "(Applied)"}</span><span>-{symbols[currency]}{currency === "MMK" ? discount.toLocaleString() : (discount / rates[currency]).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6 pt-4 border-t border-slate-200">
            <span className="text-xl font-bold text-slate-800">Total</span>
            <span className="text-3xl font-black text-indigo-600">{symbols[currency]}{getPrice(grandTotalUSD)}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <button onClick={() => handlePay("Cash")} disabled={cart.length === 0 || !isShiftOpen} className="bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-50">💵 Cash</button>
            <button onClick={() => handlePay("E-Wallet")} disabled={cart.length === 0 || !isShiftOpen} className="bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-50">📱 Wallet</button>
          </div>
          <button onClick={() => handlePay("Credit Card")} disabled={cart.length === 0 || !isShiftOpen} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-lg shadow-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:shadow-none flex items-center justify-center gap-2">
            Pay with Card
          </button>
        </div>
      </aside>

    </div>
  );
}
