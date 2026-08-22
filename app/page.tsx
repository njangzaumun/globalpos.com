"use client";
import { useState, useMemo, useEffect } from "react";

// --- Types ---
type Product = { id: string; name: string; price: number; category: string; image: string; stock: number; barcode: string };
type CartItem = Product & { qty: number };
type Tab = "DASHBOARD" | "POS" | "INVENTORY" | "ORDERS" | "CUSTOMERS" | "SUPPLIERS" | "SETTINGS";
type PaymentMethod = "Cash" | "Debit Card" | "E-Wallet";

type ShiftMetrics = { gross: number; net: number; tax: number; discount: number; cash: number; card: number; wallet: number; orders: number; };

export default function EnterprisePOS() {
  // --- System States ---
  const [activeTab, setActiveTab] = useState<Tab>("POS");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isShiftOpen, setIsShiftOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  // --- Config States ---
  const [lang, setLang] = useState<"EN" | "MM" | "MS" | "ZH">("EN");
  const [currency, setCurrency] = useState("USD");
  const [taxRate, setTaxRate] = useState(5);
  const [discountVal, setDiscountVal] = useState(0);
  const [currentUserRole, setCurrentUserRole] = useState("Admin"); // Admin, Manager, Cashier

  // --- Data States ---
  const initialShift: ShiftMetrics = { gross: 0, net: 0, tax: 0, discount: 0, cash: 0, card: 0, wallet: 0, orders: 0 };
  const [currentShift, setCurrentShift] = useState<ShiftMetrics>(initialShift);
  const [pastShifts, setPastShifts] = useState<(ShiftMetrics & { id: string, date: string })[]>([]);
  const [ordersList, setOrdersList] = useState<{id: string, time: string, total: number, method: string, items: number}[]>([]);

  const [newProd, setNewProd] = useState({ name: "", price: "", cat: "Meals", stock: "50", image: "", barcode: "" });

  const rates: Record<string, number> = { USD: 1, MMK: 4500, MYR: 4.7, THB: 35, SGD: 1.35, CNY: 7.2 };
  const symbols: Record<string, string> = { USD: "$", MMK: "Ks ", MYR: "RM", THB: "฿", SGD: "S$", CNY: "¥" };

  const categories = ["All", "Coffee", "Meals", "Dessert", "Beverage"];
  const [products, setProducts] = useState<Product[]>([
    { id: "1001", name: "Premium Espresso", price: 3.5, category: "Coffee", stock: 120, barcode: "89012345", image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=300&q=80" },
    { id: "1002", name: "Avocado Toast", price: 7.0, category: "Meals", stock: 45, barcode: "89012346", image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=300&q=80" },
    { id: "1003", name: "Matcha Latte", price: 5.5, category: "Beverage", stock: 80, barcode: "89012347", image: "https://images.unsplash.com/photo-1536935338773-84642228f257?w=300&q=80" },
    { id: "1004", name: "Grilled Salmon", price: 14.0, category: "Meals", stock: 20, barcode: "89012348", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&q=80" },
    { id: "1005", name: "Chocolate Cake", price: 6.0, category: "Dessert", stock: 35, barcode: "89012349", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80" },
  ]);

  // --- Logic ---
  const getPrice = (priceUSD: number) => {
    const converted = priceUSD * rates[currency];
    return currency === "MMK" ? Math.round(converted).toLocaleString() : converted.toFixed(2);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode.includes(searchQuery);
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
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty: item.qty + delta } : item).filter(item => item.qty > 0));
  };

  const subTotalUSD = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const taxAmountUSD = subTotalUSD * (taxRate / 100);
  const discountUSD = discountVal / rates[currency];
  const grandTotalUSD = subTotalUSD + taxAmountUSD - discountUSD;

  const handlePay = (method: PaymentMethod) => {
    setCurrentShift(prev => ({
      gross: prev.gross + subTotalUSD,
      tax: prev.tax + taxAmountUSD,
      discount: prev.discount + discountUSD,
      net: prev.net + grandTotalUSD,
      orders: prev.orders + 1,
      cash: method === "Cash" ? prev.cash + grandTotalUSD : prev.cash,
      card: method === "Debit Card" ? prev.card + grandTotalUSD : prev.card,
      wallet: method === "E-Wallet" ? prev.wallet + grandTotalUSD : prev.wallet,
    }));
    const orderId = "INV-" + Math.floor(Math.random() * 90000 + 10000);
    setOrdersList([{ id: orderId, time: new Date().toLocaleTimeString(), total: grandTotalUSD, method, items: cart.length }, ...ordersList]);
    alert(`✅ Receipt Printed!\nOrder: ${orderId}\nTotal: ${symbols[currency]}${getPrice(grandTotalUSD)}\nPaid by: ${method}`);
    setCart([]); setDiscountVal(0);
  };

  const handleShiftToggle = () => {
    if (isShiftOpen) {
      if (currentShift.orders > 0) {
        setPastShifts([{ id: "Z-" + Date.now().toString().slice(-6), date: new Date().toLocaleString(), ...currentShift }, ...pastShifts]);
        alert(`📊 Z-Report Generated!\nTotal Net Sales: ${symbols[currency]}${getPrice(currentShift.net)}`);
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
      setProducts([{
        id: Math.floor(Math.random() * 10000).toString(),
        name: newProd.name, price: parseFloat(newProd.price) / rates[currency],
        category: newProd.cat, stock: parseInt(newProd.stock), barcode: newProd.barcode || "N/A",
        image: newProd.image || "https://placehold.co/300x300?text=No+Image"
      }, ...products]);
      setNewProd({ name: "", price: "", cat: "Meals", stock: "50", image: "", barcode: "" });
      alert("✅ Product Added to Inventory!");
    }
  };

  // --- UI Components ---
  const navItems = [
    { id: "DASHBOARD", icon: "📊", label: "Dashboard" },
    { id: "POS", icon: "🛒", label: "Checkout" },
    { id: "INVENTORY", icon: "📦", label: "Inventory" },
    { id: "ORDERS", icon: "🧾", label: "Reports" },
    { id: "CUSTOMERS", icon: "👥", label: "Customers" },
    { id: "SUPPLIERS", icon: "🚚", label: "Suppliers" },
    { id: "SETTINGS", icon: "⚙️", label: "Settings" }
  ];

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300">
        
        {/* === 1. SIDEBAR === */}
        <aside className="w-20 lg:w-24 bg-white dark:bg-slate-900 border-r dark:border-slate-800 flex flex-col items-center py-6 shadow-xl z-20 shrink-0">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-2xl mb-8 shadow-lg">N</div>
          <nav className="flex-1 flex flex-col gap-4 w-full">
            {navItems.map(tab => (
              <button 
                key={tab.id} onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex flex-col items-center justify-center w-full py-3 border-r-4 transition-all ${activeTab === tab.id ? "text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-slate-800" : "text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200"}`}
              >
                <span className="text-2xl mb-1">{tab.icon}</span>
                <span className="text-[9px] uppercase font-bold tracking-widest">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* === 2. MAIN CONTENT === */}
        <main className="flex-1 flex flex-col min-w-0 relative">
          
          {/* Header */}
          <header className="h-20 bg-white dark:bg-slate-900 border-b dark:border-slate-800 px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
            <div>
              <h1 className="text-2xl font-black tracking-tight">NJANG <span className="text-indigo-600 dark:text-indigo-400">Enterprise</span></h1>
              <p className="text-xs font-bold text-slate-400">Global POS System</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 w-72 border dark:border-slate-700 focus-within:border-indigo-500 transition-all">
                <span>🔍</span>
                <input type="text" placeholder="Search product or scan barcode..." className="bg-transparent border-none outline-none text-sm ml-2 w-full font-medium dark:text-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <button onClick={handleShiftToggle} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border shadow-sm transition-all ${isShiftOpen ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400"}`}>
                <div className={`w-3 h-3 rounded-full ${isShiftOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></div>
                {isShiftOpen ? "Close Shift" : "Open Shift"}
              </button>
            </div>
          </header>

          {/* VIEWS */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-8">
            
            {/* --- DASHBOARD --- */}
            {activeTab === "DASHBOARD" && (
              <div className="space-y-6 max-w-6xl mx-auto">
                <h2 className="text-3xl font-black mb-6">Business Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: "Net Sales", val: currentShift.net, color: "text-indigo-600" },
                    { label: "Total Orders", val: currentShift.orders, prefix: "", color: "text-emerald-600" },
                    { label: "Discount Given", val: currentShift.discount, color: "text-rose-600" },
                    { label: "Tax Collected", val: currentShift.tax, color: "text-amber-600" }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border dark:border-slate-700 shadow-sm">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{stat.label}</p>
                      <p className={`text-3xl font-black ${stat.color}`}>{stat.prefix !== "" ? symbols[currency] : ""}{stat.prefix !== "" ? getPrice(stat.val) : stat.val}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white dark:bg-slate-800 h-64 rounded-2xl border dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-400 font-bold border-dashed">
                  📊 Sales Chart (AI Analytics Module) - Coming Soon
                </div>
              </div>
            )}

            {/* --- POS --- */}
            {activeTab === "POS" && (
              <div className="h-full flex flex-col">
                {!isShiftOpen ? (
                  <div className="m-auto text-center p-10 bg-white dark:bg-slate-800 rounded-3xl border dark:border-slate-700 shadow-xl max-w-md">
                    <div className="text-6xl mb-4">🔐</div>
                    <h2 className="text-2xl font-black mb-2">Register Closed</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">You must open a shift to process transactions.</p>
                    <button onClick={() => setIsShiftOpen(true)} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all text-lg">Open Register</button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide shrink-0 mb-2">
                      {categories.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${activeCategory === cat ? "bg-slate-900 dark:bg-indigo-600 text-white border-transparent shadow-md" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"}`}>
                          {cat}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-32 lg:pb-0">
                      {filteredProducts.map(product => (
                        <button key={product.id} onClick={() => addToCart(product)} className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500 active:scale-95 transition-all text-left flex flex-col">
                          <div className="w-full h-40 relative bg-slate-100 dark:bg-slate-700 overflow-hidden">
                            <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={product.name}/>
                            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-white px-2 py-1 rounded text-[10px] font-black">{product.stock} left</div>
                          </div>
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <h3 className="font-bold text-sm mb-1">{product.name}</h3>
                            <div className="flex justify-between items-center mt-2">
                              <p className="text-indigo-600 dark:text-indigo-400 font-black text-lg">{symbols[currency]}{getPrice(product.price)}</p>
                              <span className="text-[10px] text-slate-400">{product.barcode}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* --- INVENTORY (Product & Menu Management) --- */}
            {activeTab === "INVENTORY" && (
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex justify-between items-end mb-6">
                  <h2 className="text-3xl font-black">Inventory & Menu</h2>
                  <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-4 py-2 rounded-lg font-bold text-sm">Total: {products.length} Items</span>
                </div>
                
                {/* Add Product Form */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border dark:border-slate-700 shadow-sm">
                  <h3 className="font-bold mb-4 flex items-center gap-2">➕ Add New Product</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input type="text" placeholder="Product Name" className="border dark:border-slate-700 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-sm font-medium outline-none dark:text-white" value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} />
                    <input type="number" placeholder={`Price (${currency})`} className="border dark:border-slate-700 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-sm font-medium outline-none dark:text-white" value={newProd.price} onChange={e => setNewProd({...newProd, price: e.target.value})} />
                    <select className="border dark:border-slate-700 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-sm font-medium outline-none dark:text-white" value={newProd.cat} onChange={e => setNewProd({...newProd, cat: e.target.value})}>
                      {categories.filter(c=>c!=="All").map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input type="number" placeholder="Initial Stock" className="border dark:border-slate-700 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-sm font-medium outline-none dark:text-white" value={newProd.stock} onChange={e => setNewProd({...newProd, stock: e.target.value})} />
                    <input type="text" placeholder="Barcode / SKU" className="border dark:border-slate-700 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-sm font-medium outline-none dark:text-white" value={newProd.barcode} onChange={e => setNewProd({...newProd, barcode: e.target.value})} />
                    <input type="text" placeholder="Image URL (Link)" className="border dark:border-slate-700 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-sm font-medium outline-none dark:text-white" value={newProd.image} onChange={e => setNewProd({...newProd, image: e.target.value})} />
                  </div>
                  <button onClick={handleAddProduct} className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:bg-indigo-700">Save Product</button>
                </div>

                {/* Products Table */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                      <tr><th className="p-4">Image</th><th className="p-4">Name / Barcode</th><th className="p-4">Category</th><th className="p-4">Stock</th><th className="p-4 text-right">Price</th></tr>
                    </thead>
                    <tbody className="divide-y dark:divide-slate-700 text-sm">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-4"><img src={p.image} className="w-12 h-12 rounded-lg object-cover border dark:border-slate-600" /></td>
                          <td className="p-4"><p className="font-bold">{p.name}</p><p className="text-xs text-slate-400">{p.barcode}</p></td>
                          <td className="p-4"><span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-xs font-bold">{p.category}</span></td>
                          <td className="p-4 font-bold text-emerald-600">{p.stock}</td>
                          <td className="p-4 font-black text-right">{symbols[currency]}{getPrice(p.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --- REPORTS & Z-REPORT --- */}
            {activeTab === "ORDERS" && (
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex justify-between items-end mb-6">
                  <h2 className="text-3xl font-black">Z-Reports & Transactions</h2>
                </div>

                {/* Active Shift Z-Report Preview */}
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl">
                  <h3 className="text-xl font-black mb-6 border-b border-white/20 pb-4">Current Shift Summary (Live)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div><p className="text-indigo-300 text-xs font-bold uppercase mb-1">Cash</p><p className="text-2xl font-black">{symbols[currency]}{getPrice(currentShift.cash)}</p></div>
                    <div><p className="text-indigo-300 text-xs font-bold uppercase mb-1">Debit Card</p><p className="text-2xl font-black">{symbols[currency]}{getPrice(currentShift.card)}</p></div>
                    <div><p className="text-indigo-300 text-xs font-bold uppercase mb-1">E-Wallet</p><p className="text-2xl font-black">{symbols[currency]}{getPrice(currentShift.wallet)}</p></div>
                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm"><p className="text-emerald-300 text-xs font-bold uppercase mb-1">Net Total</p><p className="text-2xl font-black text-emerald-400">{symbols[currency]}{getPrice(currentShift.net)}</p></div>
                  </div>
                  <button onClick={handleShiftToggle} disabled={!isShiftOpen} className="bg-white text-slate-900 font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-slate-100 disabled:opacity-50">Print Z-Report & Close Shift</button>
                </div>

                {/* Transaction History Table */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="p-4 border-b dark:border-slate-700 font-bold">Recent Receipts</div>
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-700 text-slate-500 text-xs uppercase">
                      <tr><th className="p-4">Receipt No.</th><th className="p-4">Time</th><th className="p-4">Payment Type</th><th className="p-4 text-right">Total</th></tr>
                    </thead>
                    <tbody className="divide-y dark:divide-slate-700 text-sm">
                      {ordersList.length === 0 ? <tr><td colSpan={4} className="p-8 text-center text-slate-400">No transactions today.</td></tr> : 
                        ordersList.map(o => (
                        <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">{o.id}</td>
                          <td className="p-4 text-slate-500">{o.time}</td>
                          <td className="p-4"><span className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-xs font-bold">{o.method}</span></td>
                          <td className="p-4 font-black text-right">{symbols[currency]}{getPrice(o.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --- CUSTOMERS & SUPPLIERS (Placeholders for UI completeness) --- */}
            {(activeTab === "CUSTOMERS" || activeTab === "SUPPLIERS") && (
              <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                <span className="text-6xl mb-4">🚧</span>
                <h2 className="text-2xl font-bold">{activeTab} Module</h2>
                <p>Advanced CRM and Supply Chain features available in Enterprise v2.0</p>
              </div>
            )}

            {/* --- SETTINGS --- */}
            {activeTab === "SETTINGS" && (
              <div className="max-w-4xl mx-auto space-y-8">
                <h2 className="text-3xl font-black">System Preferences</h2>
                
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border dark:border-slate-700 shadow-sm space-y-8">
                  {/* Theme & Role */}
                  <div className="flex justify-between items-center border-b dark:border-slate-700 pb-6">
                    <div>
                      <h3 className="font-bold text-lg">Dark Mode</h3>
                      <p className="text-sm text-slate-500">Toggle dark interface for low-light environments.</p>
                    </div>
                    <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-14 h-8 rounded-full flex items-center transition-colors p-1 ${isDarkMode ? "bg-indigo-600" : "bg-slate-300"}`}>
                      <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${isDarkMode ? "translate-x-6" : ""}`}></div>
                    </button>
                  </div>
                  
                  {/* Currency & Language */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b dark:border-slate-700 pb-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-500 mb-2">System Language</label>
                      <select className="w-full border dark:border-slate-600 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 font-bold outline-none dark:text-white" value={lang} onChange={(e) => setLang(e.target.value as any)}>
                        <option value="EN">🇺🇸 English</option>
                        <option value="MM">🇲🇲 Myanmar</option>
                        <option value="MS">🇲🇾 Malay</option>
                        <option value="ZH">🇨🇳 Chinese</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-500 mb-2">Default Currency</label>
                      <select className="w-full border dark:border-slate-600 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 font-bold outline-none dark:text-white" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                        <option value="USD">🇺🇸 USD ($)</option><option value="MMK">🇲🇲 MMK (Ks)</option>
                        <option value="MYR">🇲🇾 MYR (RM)</option><option value="THB">🇹🇭 THB (฿)</option>
                        <option value="SGD">🇸🇬 SGD (S$)</option><option value="CNY">🇨🇳 CNY (¥)</option>
                      </select>
                    </div>
                  </div>

                  {/* Tax */}
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2">Tax Rate: {taxRate}%</label>
                    <input type="range" min="0" max="25" className="w-full accent-indigo-600" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>

        {/* === 3. RIGHT SIDEBAR (CART) - Only visible in POS === */}
        {activeTab === "POS" && (
          <aside className="w-full lg:w-[400px] bg-white dark:bg-slate-900 border-l dark:border-slate-800 shadow-2xl flex flex-col absolute lg:relative right-0 bottom-0 top-0 lg:top-auto z-30 shrink-0">
            
            <div className="p-6 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-xl font-bold shadow-sm">
                  👤
                </div>
                <div>
                  <p className="font-black text-slate-800 dark:text-white text-sm">Walk-in Customer</p>
                  <p className="text-xs font-bold text-indigo-500">Assign Member</p>
                </div>
              </div>
              <button onClick={() => setCart([])} className="text-rose-500 font-bold text-xs bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800 px-3 py-2 rounded-lg hover:bg-rose-100">Clear All</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-600">
                  <div className="text-6xl mb-4">🛍️</div>
                  <p className="font-bold text-lg">Cart is empty</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {cart.map(item => (
                    <li key={item.id} className="flex flex-col gap-2 pb-4 border-b dark:border-slate-800 border-dashed">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm leading-tight pr-4">{item.name}</h4>
                        <span className="font-black">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-slate-400 font-medium">${item.price.toFixed(2)} / ea</p>
                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border dark:border-slate-700">
                          <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-md font-bold shadow-sm">−</button>
                          <span className="w-8 text-center text-sm font-black">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-md font-bold shadow-sm">+</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-6 border-t dark:border-slate-800 shrink-0">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm font-bold text-slate-500 dark:text-slate-400"><span>Subtotal</span><span>{symbols[currency]}{getPrice(subTotalUSD)}</span></div>
                <div className="flex justify-between text-sm font-bold text-slate-500 dark:text-slate-400"><span>Tax ({taxRate}%)</span><span>{symbols[currency]}{getPrice(taxAmountUSD)}</span></div>
                <div className="flex justify-between text-sm font-bold text-emerald-500 cursor-pointer p-2 -mx-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors" onClick={() => setDiscountVal(discountVal === 0 ? 10 * rates[currency] : 0)}>
                  <span>Discount {discountVal > 0 && "(Click to remove)"}</span><span>-{symbols[currency]}{currency === "MMK" ? discountVal.toLocaleString() : discountUSD.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 pt-4 border-t border-dashed dark:border-slate-700">
                <span className="text-xl font-bold">Total Due</span>
                <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{symbols[currency]}{getPrice(grandTotalUSD)}</span>
              </div>

              {/* Advanced Payment Options */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <button onClick={() => handlePay("Cash")} disabled={cart.length === 0 || !isShiftOpen} className="bg-white dark:bg-slate-800 border dark:border-slate-700 py-4 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-indigo-500 dark:hover:border-indigo-400 disabled:opacity-50 transition-all shadow-sm">
                  <span className="text-xl">💵</span><span className="text-[10px] font-bold uppercase">Cash</span>
                </button>
                <button onClick={() => handlePay("Debit Card")} disabled={cart.length === 0 || !isShiftOpen} className="bg-white dark:bg-slate-800 border dark:border-slate-700 py-4 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-indigo-500 dark:hover:border-indigo-400 disabled:opacity-50 transition-all shadow-sm">
                  <span className="text-xl">💳</span><span className="text-[10px] font-bold uppercase">Card</span>
                </button>
                <button onClick={() => handlePay("E-Wallet")} disabled={cart.length === 0 || !isShiftOpen} className="bg-white dark:bg-slate-800 border dark:border-slate-700 py-4 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-indigo-500 dark:hover:border-indigo-400 disabled:opacity-50 transition-all shadow-sm">
                  <span className="text-xl">📱</span><span className="text-[10px] font-bold uppercase">Wallet</span>
                </button>
              </div>
              <button onClick={() => handlePay("Cash")} disabled={cart.length === 0 || !isShiftOpen} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:shadow-none flex items-center justify-center gap-2 transition-all">
                Complete Payment
              </button>
            </div>
          </aside>
        )}

      </div>
    </div>
  );
}
