"use client";
import { useState, useMemo, useEffect } from "react";

// --- Types ---
type Product = { id: string; name: string; price: number; category: string; stock: number; barcode: string; image: string };
type CartItem = Product & { qty: number };
type Tab = "POS" | "TABLES" | "DASHBOARD" | "INVENTORY" | "REPORTS" | "SETTINGS";
type Role = "Admin" | "Cashier";
type Lang = "EN" | "MM" | "ZH" | "MS";
type TableStatus = "Available" | "Occupied";
type DineInTable = { id: number; name: string; status: TableStatus; bill: number };

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

  // --- Data States (LocalStorage) ---
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [shift, setShift] = useState({ gross: 0, net: 0, tax: 0, discount: 0, cash: 0, card: 0, wallet: 0, orders: 0 });

  // --- POS States ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [discountVal, setDiscountVal] = useState(0);
  const [lastReceipt, setLastReceipt] = useState<any>(null);
  
  // --- Tables State ---
  const [tables, setTables] = useState<DineInTable[]>(Array.from({length: 12}, (_, i) => ({ id: i+1, name: `T-${i+1}`, status: "Available", bill: 0 })));
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  // --- Inventory State ---
  const [newProd, setNewProd] = useState({ name: "", price: "", cat: "Meals", stock: "50", barcode: "", image: "" });

  const rates: Record<string, number> = { USD: 1, MMK: 4500, MYR: 4.7, THB: 35, SGD: 1.35, CNY: 7.2 };
  const symbols: Record<string, string> = { USD: "$", MMK: "Ks ", MYR: "RM", THB: "฿", SGD: "S$", CNY: "¥" };

  // --- 100% Full Translation Dictionary ---
  const dict = {
    EN: { pos: "POS", tables: "Tables", dash: "Dashboard", inv: "Inventory", rep: "Reports", set: "Settings", search: "Search or scan barcode...", open: "Open Shift", close: "Close Shift", pay: "Pay", total: "Total", sub: "Subtotal", tax: "Tax", disc: "Discount", clear: "Clear All", cash: "Cash", card: "Card", wallet: "E-Wallet", print: "Print Receipt", admin: "Admin", cashier: "Cashier", add: "Add Product", name: "Product Name", price: "Price", stock: "Stock", barcode: "Barcode", image: "Image URL", save: "Save", del: "Delete", avail: "Available", occ: "Occupied", selTable: "Select Table", walkin: "Walk-in Customer", regClosed: "Register Closed", openRegAlert: "Please open your shift to start selling." },
    MM: { pos: "အရောင်း", tables: "စားပွဲများ", dash: "အနှစ်ချုပ်", inv: "ကုန်ပစ္စည်းစာရင်း", rep: "စာရင်းစစ်", set: "ဆက်တင်", search: "ဘားကုဒ် သို့ ရှာရန်...", open: "ဆိုင်ဖွင့်မည်", close: "ဆိုင်ပိတ်မည်", pay: "ငွေရှင်းမည်", total: "စုစုပေါင်း", sub: "ကျသင့်ငွေ", tax: "အခွန်", disc: "လျှော့စျေး", clear: "ဖျက်မည်", cash: "ငွေသား", card: "ကတ်", wallet: "E-Wallet", print: "ဘေလ်ထုတ်မည်", admin: "အက်ဒမင် (Admin)", cashier: "ငွေရှင်းစာရေး (Cashier)", add: "ပစ္စည်းအသစ်ထည့်ရန်", name: "ပစ္စည်းအမည်", price: "စျေးနှုန်း", stock: "လက်ကျန်", barcode: "ဘားကုဒ်", image: "ပုံလင့်ခ် (Image URL)", save: "သိမ်းမည်", del: "ဖျက်မည်", avail: "အားလပ်", occ: "လူရှိ", selTable: "စားပွဲရွေးပါ", walkin: "ဆိုင်လာဝယ်သူ", regClosed: "ဆိုင်ပိတ်ထားသည်", openRegAlert: "အရောင်းစတင်ရန် ဆိုင်ဖွင့်မည်ကို နှိပ်ပါ။" },
    ZH: { pos: "收银", tables: "餐桌", dash: "仪表板", inv: "库存", rep: "报告", set: "设置", search: "搜索或扫描...", open: "开班", close: "结班", pay: "付款", total: "总计", sub: "小计", tax: "税", disc: "折扣", clear: "清除", cash: "现金", card: "刷卡", wallet: "电子钱包", print: "打印收据", admin: "管理员", cashier: "收银员", add: "添加产品", name: "产品名称", price: "价格", stock: "库存", barcode: "条码", image: "图片链接", save: "保存", del: "删除", avail: "空闲", occ: "占用", selTable: "选桌", walkin: "散客", regClosed: "收银机已关闭", openRegAlert: "请开班以开始销售。" },
    MS: { pos: "Jualan", tables: "Meja", dash: "Dashboard", inv: "Inventori", rep: "Laporan", set: "Tetapan", search: "Cari atau imbas...", open: "Buka Shift", close: "Tutup Shift", pay: "Bayar", total: "Jumlah", sub: "Subjumlah", tax: "Cukai", disc: "Diskaun", clear: "Kosongkan", cash: "Tunai", card: "Kad", wallet: "E-Dompet", print: "Cetak Resit", admin: "Admin", cashier: "Juruwang", add: "Tambah Produk", name: "Nama Produk", price: "Harga", stock: "Stok", barcode: "Kod Bar", image: "URL Imej", save: "Simpan", del: "Padam", avail: "Kosong", occ: "Penuh", selTable: "Pilih Meja", walkin: "Pelanggan Biasa", regClosed: "Daftar Ditutup", openRegAlert: "Sila buka shift anda." }
  };
  const t = dict[lang];
  const categories = ["All", "Coffee", "Meals", "Beverage"];

  // --- Initialization (Local Storage) ---
  useEffect(() => {
    const savedProducts = localStorage.getItem("pos_prods_v2");
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    else setProducts([
      { id: "P1", name: "Premium Espresso", price: 3.5, category: "Coffee", stock: 100, barcode: "111", image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=300&q=80" },
      { id: "P2", name: "Avocado Toast", price: 6.5, category: "Meals", stock: 50, barcode: "222", image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=300&q=80" }
    ]);
    const savedOrders = localStorage.getItem("pos_orders_v2");
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("pos_prods_v2", JSON.stringify(products));
      localStorage.setItem("pos_orders_v2", JSON.stringify(orders));
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
      if (product) { addToCart(product); setSearchQuery(""); }
    }
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return alert("Out of stock!");
    setCart(prev => {
      const exist = prev.find(item => item.id === product.id);
      if (exist) {
        if (exist.qty >= product.stock) return prev;
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
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

  const handlePay = (method: string) => {
    // 1. Deduct Stock
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(c => c.id === p.id);
      return cartItem ? { ...p, stock: p.stock - cartItem.qty } : p;
    });
    setProducts(updatedProducts);

    // 2. Free up Table if selected
    if (selectedTable) {
      setTables(tables.map(tb => tb.id === selectedTable ? { ...tb, status: "Available", bill: 0 } : tb));
      setSelectedTable(null);
    }

    // 3. Update Shift & Orders
    setShift(prev => ({
      ...prev, gross: prev.gross + subTotalUSD, tax: prev.tax + taxAmountUSD, discount: prev.discount + discountUSD, net: prev.net + grandTotalUSD, orders: prev.orders + 1,
      cash: method === "Cash" ? prev.cash + grandTotalUSD : prev.cash,
      card: method === "Card" ? prev.card + grandTotalUSD : prev.card,
      wallet: method === "Wallet" ? prev.wallet + grandTotalUSD : prev.wallet,
    }));

    const newOrder = { id: "INV" + Date.now(), time: new Date().toLocaleString(), total: grandTotalUSD, method, items: cart, table: selectedTable ? `T-${selectedTable}` : "Walk-in" };
    setOrders([newOrder, ...orders]);
    setLastReceipt(newOrder);

    setCart([]); setDiscountVal(0);
  };

  const handleAddProduct = () => {
    if (newProd.name && newProd.price) {
      setProducts([...products, { id: "P"+Date.now(), name: newProd.name, price: parseFloat(newProd.price)/rates[currency], stock: parseInt(newProd.stock||"0"), barcode: newProd.barcode, category: newProd.cat, image: newProd.image || "https://placehold.co/300x300?text=No+Image" }]);
      setNewProd({ name: "", price: "", cat: "Meals", stock: "50", barcode: "", image: "" });
    }
  };

  if (!isLoaded) return <div className="flex h-screen items-center justify-center font-bold">Loading POS...</div>;

  return (
    <div className={`${isDarkMode ? "dark" : ""} select-none`}>
      
      {/* ==================== PRINT RECEIPT ==================== */}
      <div className="hidden print:block p-8 text-black bg-white w-full h-full font-mono">
        {lastReceipt && (
          <div className="max-w-xs mx-auto text-sm">
            <h2 className="text-center font-black text-2xl mb-1">GLOBAL POS</h2>
            <p className="text-center text-xs mb-4">World Class System</p>
            <p className="text-xs mb-1">Receipt: {lastReceipt.id}</p>
            <p className="text-xs mb-1">Table: {lastReceipt.table}</p>
            <p className="text-xs mb-4">Date: {lastReceipt.time}</p>
            <div className="border-t border-b border-dashed border-black py-2 mb-2">
              {lastReceipt.items.map((item: any) => (
                <div key={item.id} className="flex justify-between mb-1">
                  <span>{item.qty}x {item.name}</span>
                  <span>{symbols[currency]}{getPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-lg"><span>TOTAL</span><span>{symbols[currency]}{getPrice(lastReceipt.total)}</span></div>
            <p className="text-xs mt-1">Paid via: {lastReceipt.method}</p>
            <p className="text-center mt-6">Thank you!</p>
          </div>
        )}
      </div>

      {/* ==================== MAIN UI ==================== */}
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white print:hidden transition-colors">
        
        {/* --- SIDEBAR --- */}
        <aside className="w-20 lg:w-24 bg-white dark:bg-slate-950 border-r dark:border-slate-800 flex flex-col items-center py-4 shadow-xl z-20 shrink-0">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-2xl mb-6">G</div>
          <nav className="flex-1 flex flex-col gap-2 w-full">
            {[
              { id: "POS", icon: "🛒", label: t.pos, reqAdmin: false },
              { id: "TABLES", icon: "🪑", label: t.tables, reqAdmin: false },
              { id: "DASHBOARD", icon: "📊", label: t.dash, reqAdmin: true },
              { id: "INVENTORY", icon: "📦", label: t.inv, reqAdmin: true },
              { id: "REPORTS", icon: "🧾", label: t.rep, reqAdmin: true },
              { id: "SETTINGS", icon: "⚙️", label: t.set, reqAdmin: true }
            ].map(tab => {
              if (tab.reqAdmin && role !== "Admin") return null;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex flex-col items-center justify-center w-full py-3 border-r-4 ${activeTab === tab.id ? "text-indigo-600 dark:text-indigo-400 border-indigo-600 bg-indigo-50 dark:bg-slate-800" : "border-transparent opacity-60 hover:opacity-100"}`}>
                  <span className="text-2xl mb-1">{tab.icon}</span>
                  <span className="text-[10px] uppercase font-bold">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* --- CONTENT --- */}
        <main className="flex-1 flex flex-col min-w-0 relative">
          
          {/* Header */}
          <header className="h-16 bg-white dark:bg-slate-950 border-b dark:border-slate-800 px-4 flex items-center justify-between shrink-0">
            <div className="flex gap-4 items-center">
              <select className="bg-slate-100 dark:bg-slate-800 text-sm font-bold p-2 rounded-lg outline-none" value={role} onChange={e=>setRole(e.target.value as Role)}>
                <option value="Admin">👑 {t.admin}</option><option value="Cashier">👤 {t.cashier}</option>
              </select>
            </div>
            <div className="flex gap-4 items-center w-1/2">
              <input type="text" placeholder={t.search} className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full text-sm w-full outline-none focus:ring-2 focus:ring-indigo-500" 
                     value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleBarcodeScan} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsShiftOpen(!isShiftOpen)} className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${isShiftOpen ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                {isShiftOpen ? t.close : t.open}
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            
            {/* 1. POS View */}
            {activeTab === "POS" && (
              !isShiftOpen ? (
                <div className="m-auto mt-20 text-center p-10 bg-white dark:bg-slate-800 rounded-3xl max-w-sm shadow-xl">
                  <div className="text-6xl mb-4">🔐</div><h2 className="text-2xl font-bold mb-4">{t.regClosed}</h2>
                  <p className="text-slate-500 mb-6">{t.openRegAlert}</p>
                  <button onClick={()=>setIsShiftOpen(true)} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">{t.open}</button>
                </div>
              ) : (
                <div className="flex gap-6 h-full">
                  <div className="flex-1 flex flex-col">
                    <div className="flex gap-2 overflow-x-auto pb-4 shrink-0">
                      {categories.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2.5 rounded-full text-sm font-bold border ${activeCategory === cat ? "bg-slate-900 dark:bg-indigo-600 text-white border-transparent shadow-md" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}>{cat === "All" ? "All" : cat}</button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-20 pr-2">
                      {filteredProducts.map(p => (
                        <button key={p.id} onClick={() => addToCart(p)} className="bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 text-left hover:shadow-xl hover:border-indigo-500 transition-all flex flex-col h-48 overflow-hidden group">
                          <div className="h-28 w-full bg-slate-200 relative overflow-hidden">
                            <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">{p.stock} Left</div>
                          </div>
                          <div className="p-3 flex flex-col justify-between flex-1">
                            <h3 className="font-bold text-sm leading-tight">{p.name}</h3>
                            <p className="text-indigo-600 dark:text-indigo-400 font-black">{symbols[currency]}{getPrice(p.price)}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cart Sidebar */}
                  <div className="w-[350px] bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-3xl flex flex-col shadow-2xl shrink-0 overflow-hidden">
                    <div className="p-4 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">{selectedTable ? t.tables : "Customer"}</p>
                        <p className="font-bold text-indigo-600">{selectedTable ? `Table - ${selectedTable}` : t.walkin}</p>
                      </div>
                      <button onClick={()=>{setCart([]); setSelectedTable(null);}} className="text-rose-500 font-bold text-xs bg-rose-50 dark:bg-rose-900/30 px-3 py-1.5 rounded-lg">{t.clear}</button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {cart.map(c => (
                        <div key={c.id} className="text-sm border-b dark:border-slate-800 pb-3 border-dashed">
                          <div className="flex justify-between font-bold mb-2"><span className="pr-2 leading-tight">{c.name}</span><span className="text-indigo-600">{symbols[currency]}{getPrice(c.price * c.qty)}</span></div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400">{symbols[currency]}{getPrice(c.price)} / ea</span>
                            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                              <button onClick={()=>updateQty(c.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white dark:bg-slate-700 rounded shadow-sm font-bold">-</button>
                              <span className="w-6 text-center font-bold">{c.qty}</span>
                              <button onClick={()=>updateQty(c.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white dark:bg-slate-700 rounded shadow-sm font-bold">+</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-5 bg-slate-50 dark:bg-slate-900 border-t dark:border-slate-800">
                      <div className="flex justify-between text-sm font-bold mb-2 text-slate-500"><span>{t.sub}</span><span>{symbols[currency]}{getPrice(subTotalUSD)}</span></div>
                      <div className="flex justify-between text-sm font-bold mb-2 text-slate-500"><span>{t.tax} ({taxRate}%)</span><span>{symbols[currency]}{getPrice(taxAmountUSD)}</span></div>
                      <div className="flex justify-between text-sm font-bold mb-4 text-emerald-500 cursor-pointer" onClick={() => setDiscountVal(discountVal === 0 ? 5*rates[currency] : 0)}><span>{t.disc}</span><span>-{symbols[currency]}{currency === "MMK" ? discountVal.toLocaleString() : discountUSD.toFixed(2)}</span></div>
                      <div className="flex justify-between text-2xl font-black mb-4 pt-4 border-t dark:border-slate-700"><span>{t.total}</span><span className="text-indigo-600">{symbols[currency]}{getPrice(grandTotalUSD)}</span></div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <button onClick={()=>handlePay("Cash")} disabled={!cart.length} className="bg-white dark:bg-slate-800 border dark:border-slate-700 p-3 rounded-xl text-xs font-bold shadow-sm hover:border-indigo-500 disabled:opacity-50 flex flex-col items-center"><span className="text-lg mb-1">💵</span>{t.cash}</button>
                        <button onClick={()=>handlePay("Card")} disabled={!cart.length} className="bg-white dark:bg-slate-800 border dark:border-slate-700 p-3 rounded-xl text-xs font-bold shadow-sm hover:border-indigo-500 disabled:opacity-50 flex flex-col items-center"><span className="text-lg mb-1">💳</span>{t.card}</button>
                        <button onClick={()=>handlePay("Wallet")} disabled={!cart.length} className="bg-white dark:bg-slate-800 border dark:border-slate-700 p-3 rounded-xl text-xs font-bold shadow-sm hover:border-indigo-500 disabled:opacity-50 flex flex-col items-center"><span className="text-lg mb-1">📱</span>{t.wallet}</button>
                      </div>
                      <button onClick={handlePrint} disabled={!lastReceipt} className="w-full bg-slate-800 dark:bg-slate-700 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-50 shadow-md">🖨️ {t.print}</button>
                    </div>
                  </div>
                </div>
              )
            )}

            {/* 2. DINE-IN TABLES View */}
            {activeTab === "TABLES" && (
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-black mb-8">{t.selTable}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {tables.map(tb => (
                    <button key={tb.id} onClick={() => { setSelectedTable(tb.id); setActiveTab("POS"); }} 
                      className={`relative p-6 rounded-3xl border-2 text-center transition-all shadow-sm hover:shadow-lg hover:-translate-y-1 ${tb.status === "Occupied" ? "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800" : "bg-white dark:bg-slate-800 border-emerald-200 dark:border-emerald-800"}`}>
                      <div className="text-4xl mb-4">🪑</div>
                      <h3 className="text-2xl font-black mb-2">{tb.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${tb.status === "Occupied" ? "bg-rose-200 text-rose-800" : "bg-emerald-100 text-emerald-700"}`}>
                        {tb.status === "Occupied" ? t.occ : t.avail}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. INVENTORY View */}
            {activeTab === "INVENTORY" && role === "Admin" && (
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-black mb-6">{t.inv}</h2>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border dark:border-slate-700 mb-8">
                  <h3 className="font-bold mb-4">➕ {t.add}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input type="text" placeholder={t.name} className="border dark:border-slate-600 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-sm font-medium outline-none" value={newProd.name} onChange={e=>setNewProd({...newProd, name: e.target.value})} />
                    <input type="number" placeholder={t.price} className="border dark:border-slate-600 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-sm font-medium outline-none" value={newProd.price} onChange={e=>setNewProd({...newProd, price: e.target.value})} />
                    <select className="border dark:border-slate-600 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-sm font-medium outline-none" value={newProd.cat} onChange={e=>setNewProd({...newProd, cat: e.target.value})}>
                      {categories.filter(c=>c!=="All").map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input type="number" placeholder={t.stock} className="border dark:border-slate-600 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-sm font-medium outline-none" value={newProd.stock} onChange={e=>setNewProd({...newProd, stock: e.target.value})} />
                    <input type="text" placeholder={t.barcode} className="border dark:border-slate-600 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-sm font-medium outline-none" value={newProd.barcode} onChange={e=>setNewProd({...newProd, barcode: e.target.value})} />
                    
                    {/* Added Image URL Input here */}
                    <input type="text" placeholder={t.image} className="border dark:border-slate-600 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-sm font-medium outline-none" value={newProd.image} onChange={e=>setNewProd({...newProd, image: e.target.value})} />
                  
                  </div>
                  <button onClick={handleAddProduct} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-md">{t.save}</button>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border dark:border-slate-700 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-700 text-xs uppercase font-bold text-slate-500">
                      <tr><th className="p-4">Image</th><th className="p-4">{t.name}</th><th className="p-4">{t.barcode}</th><th className="p-4">{t.stock}</th><th className="p-4">{t.price}</th><th className="p-4">Action</th></tr>
                    </thead>
                    <tbody className="text-sm divide-y dark:divide-slate-700">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                          <td className="p-4"><img src={p.image} className="w-12 h-12 object-cover rounded-lg shadow-sm" alt="product" /></td>
                          <td className="p-4 font-bold">{p.name}</td><td className="p-4 text-slate-400">{p.barcode}</td><td className="p-4 font-bold text-emerald-600">{p.stock}</td><td className="p-4 font-black">{symbols[currency]}{getPrice(p.price)}</td>
                          <td className="p-4"><button onClick={() => setProducts(products.filter(x=>x.id!==p.id))} className="text-rose-500 font-bold bg-rose-50 dark:bg-rose-900/30 px-3 py-1 rounded">{t.del}</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. SETTINGS View */}
            {activeTab === "SETTINGS" && role === "Admin" && (
              <div className="max-w-4xl mx-auto space-y-8">
                <h2 className="text-3xl font-black">{t.set}</h2>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-500">{t.lang || "Language"}</label>
                    <select className="w-full border dark:border-slate-600 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 font-bold outline-none" value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
                      <option value="EN">🇺🇸 English</option><option value="MM">🇲🇲 Myanmar (မြန်မာ)</option><option value="ZH">🇨🇳 Chinese (中文)</option><option value="MS">🇲🇾 Malay (Melayu)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-500">Currency</label>
                    <select className="w-full border dark:border-slate-600 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 font-bold outline-none" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                      <option value="USD">USD ($)</option><option value="MMK">MMK (Ks)</option><option value="MYR">MYR (RM)</option><option value="THB">THB (฿)</option><option value="SGD">SGD (S$)</option><option value="CNY">CNY (¥)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-500">{t.tax || "Tax Rate"}</label>
                    <input type="number" className="w-full border dark:border-slate-600 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 font-bold outline-none" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-500">Theme</label>
                    <button onClick={()=>setIsDarkMode(!isDarkMode)} className={`w-full py-4 rounded-xl font-bold transition-all shadow-sm ${isDarkMode ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700"}`}>{isDarkMode ? "Dark Mode ON 🌙" : "Light Mode ON ☀️"}</button>
                  </div>
                </div>
              </div>
            )}

            {/* Other Placeholder Modules */}
            {["DASHBOARD", "REPORTS"].includes(activeTab) && role === "Admin" && (
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-black mb-6">{t[activeTab.toLowerCase().substring(0,3) as keyof typeof t] || activeTab}</h2>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border dark:border-slate-700">
                  <h3 className="font-bold text-lg mb-4">Transaction Logs</h3>
                  <div className="space-y-3">
                    {orders.length === 0 ? <p className="text-slate-400">No transactions recorded.</p> : 
                      orders.map((o:any) => (
                      <div key={o.id} className="p-4 border dark:border-slate-700 rounded-xl flex justify-between bg-slate-50 dark:bg-slate-900 shadow-sm">
                        <div><p className="font-bold text-indigo-600">{o.id}</p><p className="text-xs text-slate-500">{o.time} • {o.table}</p></div>
                        <div className="text-right"><p className="font-black text-lg">{symbols[currency]}{getPrice(o.total)}</p><p className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded uppercase inline-block">{o.method}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
