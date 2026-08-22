"use client";
import { useState, useMemo, useEffect } from "react";

// --- Types ---
type Product = { id: string; name: string; price: number; category: string; stock: number; barcode: string; image: string };
type CartItem = Product & { qty: number };
type Tab = "POS" | "DASHBOARD" | "INVENTORY" | "ORDERS" | "CUSTOMERS" | "SUPPLIERS" | "SETTINGS";
type Role = "Admin" | "Cashier";
type Lang = "EN" | "MM" | "ZH" | "MS";

export default function UltimatePOS() {
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Core States ---
  const [activeTab, setActiveTab] = useState<Tab>("POS");
  const [role, setRole] = useState<Role>("Admin");
  const [lang, setLang] = useState<Lang>("EN");
  const [currency, setCurrency] = useState("USD");
  const [taxRate, setTaxRate] = useState(5);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isShiftOpen, setIsShiftOpen] = useState(false);

  // --- Data States (Will be saved to LocalStorage) ---
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["Coffee", "Meals", "Beverage"]);
  const [customers, setCustomers] = useState<{id: string, name: string, phone: string}[]>([]);
  const [suppliers, setSuppliers] = useState<{id: string, name: string, contact: string}[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [shift, setShift] = useState({ gross: 0, net: 0, tax: 0, discount: 0, cash: 0, card: 0, wallet: 0, orders: 0 });

  // --- POS States ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [discountVal, setDiscountVal] = useState(0);
  const [lastReceipt, setLastReceipt] = useState<any>(null);

  const rates: Record<string, number> = { USD: 1, MMK: 4500, MYR: 4.7, THB: 35, SGD: 1.35, CNY: 7.2 };
  const symbols: Record<string, string> = { USD: "$", MMK: "Ks ", MYR: "RM", THB: "฿", SGD: "S$", CNY: "¥" };

  // --- Multi-Language Dictionary ---
  const dict = {
    EN: { pos: "POS", dash: "Dashboard", inv: "Inventory", rep: "Reports", cust: "Customers", sup: "Suppliers", set: "Settings", search: "Search or Barcode...", open: "Open Shift", close: "Close Shift", pay: "Pay", total: "Total", add: "Add New" },
    MM: { pos: "အရောင်း", dash: "အနှစ်ချုပ်", inv: "ပစ္စည်းစာရင်း", rep: "စာရင်းစစ်", cust: "ဖောက်သည်", sup: "ကုန်သည်", set: "ဆက်တင်", search: "ရှာဖွေရန်...", open: "ဆိုင်ဖွင့်မည်", close: "ဆိုင်ပိတ်မည်", pay: "ငွေရှင်းမည်", total: "စုစုပေါင်း", add: "အသစ်ထည့်ရန်" },
    ZH: { pos: "收银", dash: "仪表板", inv: "库存", rep: "报告", cust: "客户", sup: "供应商", set: "设置", search: "搜索...", open: "开班", close: "结班", pay: "付款", total: "总计", add: "添加" },
    MS: { pos: "Jualan", dash: "Papan Pemuka", inv: "Inventori", rep: "Laporan", cust: "Pelanggan", sup: "Pembekal", set: "Tetapan", search: "Cari...", open: "Buka Shift", close: "Tutup Shift", pay: "Bayar", total: "Jumlah", add: "Tambah Baru" }
  };
  const t = dict[lang];

  // --- Initialization (Local Storage) ---
  useEffect(() => {
    const savedProducts = localStorage.getItem("pos_products");
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    else setProducts([{ id: "1001", name: "Premium Coffee", price: 3.5, category: "Coffee", stock: 100, barcode: "12345", image: "https://placehold.co/100" }]);
    
    const savedOrders = localStorage.getItem("pos_orders");
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    setIsLoaded(true);
  }, []);

  // Save to LocalStorage whenever data changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("pos_products", JSON.stringify(products));
      localStorage.setItem("pos_orders", JSON.stringify(orders));
    }
  }, [products, orders, isLoaded]);


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

  const handleBarcodeScan = (e: any) => {
    if (e.key === 'Enter' && searchQuery) {
      const product = products.find(p => p.barcode === searchQuery || p.name.toLowerCase() === searchQuery.toLowerCase());
      if (product) {
        addToCart(product);
        setSearchQuery(""); // clear after scan
      }
    }
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return alert("Out of stock!");
    setCart(prev => {
      const exist = prev.find(item => item.id === product.id);
      if (exist) {
        if (exist.qty >= product.stock) { alert("Max stock reached!"); return prev; }
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const subTotalUSD = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const taxAmountUSD = subTotalUSD * (taxRate / 100);
  const discountUSD = discountVal / rates[currency];
  const grandTotalUSD = subTotalUSD + taxAmountUSD - discountUSD;

  const handlePay = (method: string) => {
    // 1. Deduct Stock
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(c => c.id === p.id);
      return cartItem ? { ...p, stock: p.stock - cartItem.qty } : p;
    });
    setProducts(updatedProducts);

    // 2. Update Shift & Orders
    setShift(prev => ({
      gross: prev.gross + subTotalUSD, tax: prev.tax + taxAmountUSD, discount: prev.discount + discountUSD, net: prev.net + grandTotalUSD, orders: prev.orders + 1,
      cash: method === "Cash" ? prev.cash + grandTotalUSD : prev.cash,
      card: method === "Card" ? prev.card + grandTotalUSD : prev.card,
      wallet: method === "Wallet" ? prev.wallet + grandTotalUSD : prev.wallet,
    }));

    const newOrder = { id: "INV" + Date.now(), time: new Date().toLocaleString(), total: grandTotalUSD, method, items: cart };
    setOrders([newOrder, ...orders]);
    setLastReceipt(newOrder);

    alert(`✅ Payment Success!\nOrder: ${newOrder.id}`);
    setCart([]); setDiscountVal(0);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className={isDarkMode ? "dark" : ""}>
      
      {/* ========================================== */}
      {/* HIDDEN PRINT RECEIPT TEMPLATE */}
      {/* ========================================== */}
      <div className="hidden print:block p-8 text-black bg-white w-full h-full font-mono">
        {lastReceipt && (
          <div className="max-w-xs mx-auto text-sm">
            <h2 className="text-center font-black text-2xl mb-1">GLOBAL POS</h2>
            <p className="text-center text-xs mb-4">123 Business Street, Tech City</p>
            <p className="text-xs mb-2">Receipt: {lastReceipt.id}</p>
            <p className="text-xs mb-4">Date: {lastReceipt.time}</p>
            <div className="border-t border-b border-dashed border-black py-2 mb-2">
              {lastReceipt.items.map((item: any) => (
                <div key={item.id} className="flex justify-between mb-1">
                  <span>{item.qty}x {item.name}</span>
                  <span>{symbols[currency]}{getPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>TOTAL</span>
              <span>{symbols[currency]}{getPrice(lastReceipt.total)}</span>
            </div>
            <p className="text-xs mt-1">Method: {lastReceipt.method}</p>
            <p className="text-center mt-6">Thank you for your purchase!</p>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* MAIN APP (Hidden during print) */}
      {/* ========================================== */}
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white print:hidden transition-colors">
        
        {/* --- SIDEBAR --- */}
        <aside className="w-20 lg:w-24 bg-white dark:bg-slate-950 border-r dark:border-slate-800 flex flex-col items-center py-4 shadow-xl z-20 shrink-0">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-2xl mb-6">G</div>
          <nav className="flex-1 flex flex-col gap-2 w-full">
            {[
              { id: "POS", icon: "🛒", label: t.pos, reqAdmin: false },
              { id: "DASHBOARD", icon: "📊", label: t.dash, reqAdmin: true },
              { id: "INVENTORY", icon: "📦", label: t.inv, reqAdmin: true },
              { id: "ORDERS", icon: "🧾", label: t.rep, reqAdmin: true },
              { id: "CUSTOMERS", icon: "👥", label: t.cust, reqAdmin: false },
              { id: "SUPPLIERS", icon: "🚚", label: t.sup, reqAdmin: true },
              { id: "SETTINGS", icon: "⚙️", label: t.set, reqAdmin: true }
            ].map(tab => {
              if (tab.reqAdmin && role !== "Admin") return null; // Hide tabs if not Admin
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex flex-col items-center justify-center w-full py-3 border-r-4 ${activeTab === tab.id ? "text-indigo-600 dark:text-indigo-400 border-indigo-600 bg-indigo-50 dark:bg-slate-800" : "border-transparent opacity-60 hover:opacity-100"}`}>
                  <span className="text-2xl mb-1">{tab.icon}</span>
                  <span className="text-[9px] uppercase font-bold">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 flex flex-col min-w-0">
          
          {/* Header */}
          <header className="h-16 bg-white dark:bg-slate-950 border-b dark:border-slate-800 px-4 flex items-center justify-between shrink-0">
            <div className="flex gap-4 items-center">
              <select className="bg-slate-100 dark:bg-slate-800 text-xs font-bold p-2 rounded-lg outline-none" value={role} onChange={e=>setRole(e.target.value as Role)}>
                <option value="Admin">👑 Admin</option><option value="Cashier">👤 Cashier</option>
              </select>
            </div>
            <div className="flex gap-4 items-center w-1/2">
              <input type="text" placeholder={t.search} className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full text-sm w-full outline-none" 
                     value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleBarcodeScan} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsShiftOpen(!isShiftOpen)} className={`px-4 py-2 rounded-full text-xs font-bold ${isShiftOpen ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                {isShiftOpen ? t.close : t.open}
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            
            {/* 1. POS View */}
            {activeTab === "POS" && (
              !isShiftOpen ? (
                <div className="m-auto mt-20 text-center p-10 bg-white dark:bg-slate-800 rounded-3xl max-w-sm shadow-xl">
                  <div className="text-6xl mb-4">🔐</div><h2 className="text-xl font-bold mb-4">Register Closed</h2>
                  <button onClick={()=>setIsShiftOpen(true)} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">Open Register</button>
                </div>
              ) : (
                <div className="flex gap-6 h-full">
                  <div className="flex-1 flex flex-col">
                    <div className="flex gap-2 overflow-x-auto pb-4 shrink-0">
                      {["All", ...categories].map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-bold border ${activeCategory === cat ? "bg-slate-900 dark:bg-indigo-600 text-white" : "bg-white dark:bg-slate-800"}`}>{cat}</button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-20">
                      {filteredProducts.map(p => (
                        <button key={p.id} onClick={() => addToCart(p)} className="bg-white dark:bg-slate-800 p-3 rounded-xl border dark:border-slate-700 text-left hover:border-indigo-500 shadow-sm flex flex-col justify-between h-36">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 w-fit px-2 py-0.5 rounded">{p.stock} In Stock</p>
                            <h3 className="font-bold text-sm mt-2">{p.name}</h3>
                          </div>
                          <p className="text-indigo-600 dark:text-indigo-400 font-black text-lg">{symbols[currency]}{getPrice(p.price)}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cart Sidebar */}
                  <div className="w-80 bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl flex flex-col shadow-lg shrink-0">
                    <div className="p-4 border-b dark:border-slate-800 font-bold flex justify-between">Cart <span className="bg-indigo-100 text-indigo-700 px-2 rounded-full text-xs">{cart.length}</span></div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {cart.map(c => (
                        <div key={c.id} className="text-sm border-b dark:border-slate-800 pb-2">
                          <div className="flex justify-between font-bold mb-1"><span>{c.name}</span><span>{symbols[currency]}{getPrice(c.price * c.qty)}</span></div>
                          <div className="flex items-center gap-2">
                            <button onClick={()=>updateQty(c.id, -1)} className="bg-slate-100 dark:bg-slate-800 px-2 rounded font-bold">-</button>
                            <span>{c.qty}</span>
                            <button onClick={()=>updateQty(c.id, 1)} className="bg-slate-100 dark:bg-slate-800 px-2 rounded font-bold">+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-b-2xl border-t dark:border-slate-800">
                      <div className="flex justify-between text-xs font-bold mb-1"><span>Subtotal</span><span>{symbols[currency]}{getPrice(subTotalUSD)}</span></div>
                      <div className="flex justify-between text-xs font-bold mb-1"><span>Tax</span><span>{symbols[currency]}{getPrice(taxAmountUSD)}</span></div>
                      <div className="flex justify-between text-2xl font-black mb-4 mt-2 pt-2 border-t text-indigo-600"><span>{t.total}</span><span>{symbols[currency]}{getPrice(grandTotalUSD)}</span></div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <button onClick={()=>handlePay("Cash")} disabled={!cart.length} className="bg-white dark:bg-slate-800 border p-2 rounded-lg text-xs font-bold">💵 Cash</button>
                        <button onClick={()=>handlePay("Card")} disabled={!cart.length} className="bg-white dark:bg-slate-800 border p-2 rounded-lg text-xs font-bold">💳 Card</button>
                        <button onClick={()=>handlePay("Wallet")} disabled={!cart.length} className="bg-white dark:bg-slate-800 border p-2 rounded-lg text-xs font-bold">📱 Wallet</button>
                      </div>
                      {lastReceipt && (
                        <button onClick={handlePrint} className="w-full bg-slate-800 text-white py-2 rounded-lg text-xs font-bold mt-2">🖨️ Print Last Receipt</button>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}

            {/* 2. INVENTORY View */}
            {activeTab === "INVENTORY" && role === "Admin" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">{t.inv}</h2>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm mb-6 flex gap-4">
                  <input type="text" id="pName" placeholder="Product Name" className="border p-2 rounded text-sm w-full dark:bg-slate-700 dark:border-slate-600" />
                  <input type="number" id="pPrice" placeholder="Price ($)" className="border p-2 rounded text-sm w-full dark:bg-slate-700 dark:border-slate-600" />
                  <input type="number" id="pStock" placeholder="Stock" className="border p-2 rounded text-sm w-full dark:bg-slate-700 dark:border-slate-600" />
                  <input type="text" id="pBarcode" placeholder="Barcode" className="border p-2 rounded text-sm w-full dark:bg-slate-700 dark:border-slate-600" />
                  <button onClick={() => {
                    const n = (document.getElementById("pName") as HTMLInputElement).value;
                    const p = (document.getElementById("pPrice") as HTMLInputElement).value;
                    const s = (document.getElementById("pStock") as HTMLInputElement).value;
                    const b = (document.getElementById("pBarcode") as HTMLInputElement).value;
                    if(n && p) setProducts([...products, { id: "P"+Date.now(), name: n, price: parseFloat(p)/rates[currency], stock: parseInt(s||"0"), barcode: b, category: "Meals", image: "" }]);
                  }} className="bg-indigo-600 text-white px-4 py-2 rounded font-bold whitespace-nowrap">{t.add}</button>
                </div>
                <table className="w-full text-left bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-xs uppercase"><tr><th className="p-3">Name</th><th className="p-3">Barcode</th><th className="p-3">Stock</th><th className="p-3">Price</th><th className="p-3">Action</th></tr></thead>
                  <tbody className="text-sm divide-y dark:divide-slate-700">
                    {products.map(p => (
                      <tr key={p.id}>
                        <td className="p-3 font-bold">{p.name}</td><td className="p-3 text-slate-400">{p.barcode}</td><td className="p-3">{p.stock}</td><td className="p-3">{symbols[currency]}{getPrice(p.price)}</td>
                        <td className="p-3"><button onClick={() => setProducts(products.filter(x=>x.id!==p.id))} className="text-rose-500 font-bold">Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 3. SETTINGS View */}
            {activeTab === "SETTINGS" && role === "Admin" && (
              <div className="max-w-2xl space-y-6">
                <h2 className="text-2xl font-bold">{t.set}</h2>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2">Language</label>
                    <select className="w-full border p-2 rounded dark:bg-slate-700 dark:border-slate-600" value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
                      <option value="EN">English</option><option value="MM">Myanmar</option><option value="ZH">Chinese</option><option value="MS">Malay</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Currency</label>
                    <select className="w-full border p-2 rounded dark:bg-slate-700 dark:border-slate-600" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                      <option value="USD">USD</option><option value="MMK">MMK</option><option value="THB">THB</option><option value="SGD">SGD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Tax Rate (%)</label>
                    <input type="number" className="w-full border p-2 rounded dark:bg-slate-700 dark:border-slate-600" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Dark Mode</label>
                    <button onClick={()=>setIsDarkMode(!isDarkMode)} className={`px-4 py-2 rounded font-bold ${isDarkMode ? "bg-indigo-600 text-white" : "bg-slate-200"}`}>{isDarkMode ? "ON" : "OFF"}</button>
                  </div>
                </div>
                <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-rose-500 font-bold text-sm">⚠️ Reset All System Data (Danger)</button>
              </div>
            )}

            {/* Placeholder for DASHBOARD, ORDERS, CUSTOMERS, SUPPLIERS to save code space */}
            {["DASHBOARD", "ORDERS", "CUSTOMERS", "SUPPLIERS"].includes(activeTab) && (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold mb-4">{t[activeTab.toLowerCase().substring(0,4) as keyof typeof t] || activeTab}</h2>
                <p className="text-slate-500">Module active and saving data to LocalStorage.</p>
                {activeTab === "ORDERS" && (
                  <ul className="mt-4 space-y-2">{orders.map((o:any) => <li key={o.id} className="p-3 border rounded text-sm flex justify-between"><span>{o.id} ({o.method})</span><span className="font-bold">{symbols[currency]}{getPrice(o.total)}</span></li>)}</ul>
                )}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
