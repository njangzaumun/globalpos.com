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

  // --- Data States ---
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["Coffee", "Meals", "Beverage"]);
  const [orders, setOrders] = useState<any[]>([]);

  // --- POS States ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [discountVal, setDiscountVal] = useState(0);
  const [lastReceipt, setLastReceipt] = useState<any>(null);

  const rates: Record<string, number> = { USD: 1, MMK: 4500, MYR: 4.7, THB: 35, SGD: 1.35, CNY: 7.2 };
  const symbols: Record<string, string> = { USD: "$", MMK: "Ks ", MYR: "RM", THB: "฿", SGD: "S$", CNY: "¥" };

  // --- 🌍 FULL MULTI-LANGUAGE DICTIONARY ---
  const dict = {
    EN: { 
      pos: "POS", dash: "Dashboard", inv: "Inventory", rep: "Reports", cust: "Customers", sup: "Suppliers", set: "Settings", 
      search: "Search or Barcode...", open: "Open Shift", close: "Close Shift", 
      cart: "Current Cart", clear: "Clear All", sub: "Subtotal", tax: "Tax", dist: "Discount", total: "Total Due", pay: "Pay", 
      cash: "Cash", card: "Card", wallet: "Wallet", print: "Print Receipt", 
      add: "Add Product", pName: "Product Name", pPrice: "Price", pStock: "Stock", pCode: "Barcode", act: "Action", del: "Delete",
      sLang: "System Language", sCurr: "Default Currency", sTax: "Tax Rate (%)", sDark: "Dark Mode", sReset: "Reset All Data",
      closed: "Register Closed", openReg: "Open Register to start selling", inStock: "In Stock"
    },
    MM: { 
      pos: "အရောင်း", dash: "အနှစ်ချုပ်", inv: "ပစ္စည်းစာရင်း", rep: "စာရင်းစစ်", cust: "ဖောက်သည်", sup: "ကုန်သည်", set: "ဆက်တင်", 
      search: "ရှာဖွေရန် / ဘားကုဒ်...", open: "ဆိုင်ဖွင့်မည်", close: "ဆိုင်ပိတ်မည်", 
      cart: "ခြင်းတောင်း", clear: "အကုန်ဖျက်မည်", sub: "ကျသင့်ငွေ", tax: "အခွန်", dist: "လျှော့စျေး", total: "စုစုပေါင်း", pay: "ငွေရှင်းမည်", 
      cash: "ငွေသား", card: "ကတ်", wallet: "KPay/Wave", print: "ဘေလ်ထုတ်မည်", 
      add: "အသစ်ထည့်ရန်", pName: "ပစ္စည်းအမည်", pPrice: "စျေးနှုန်း", pStock: "လက်ကျန်", pCode: "ဘားကုဒ်", act: "လုပ်ဆောင်ချက်", del: "ဖျက်မည်",
      sLang: "ဘာသာစကား", sCurr: "ငွေကြေး", sTax: "အခွန် ရာခိုင်နှုန်း (%)", sDark: "အမည်းရောင် ဒီဇိုင်း", sReset: "ဒေတာအားလုံး ဖျက်မည်",
      closed: "ဆိုင်ပိတ်ထားပါသည်", openReg: "အရောင်းစတင်ရန် ဆိုင်ဖွင့်ပါ", inStock: "ခု ကျန်သေးသည်"
    },
    ZH: { 
      pos: "收银", dash: "仪表板", inv: "库存", rep: "报告", cust: "客户", sup: "供应商", set: "设置", 
      search: "搜索 / 条码...", open: "开班", close: "结班", 
      cart: "购物车", clear: "清空", sub: "小计", tax: "税", dist: "折扣", total: "总计", pay: "付款", 
      cash: "现金", card: "刷卡", wallet: "钱包", print: "打印收据", 
      add: "添加产品", pName: "名称", pPrice: "价格", pStock: "库存", pCode: "条码", act: "操作", del: "删除",
      sLang: "系统语言", sCurr: "默认货币", sTax: "税率 (%)", sDark: "深色模式", sReset: "重置所有数据",
      closed: "收银台已关闭", openReg: "打开收银台开始销售", inStock: "库存"
    },
    MS: { 
      pos: "Jualan", dash: "Papan", inv: "Inventori", rep: "Laporan", cust: "Pelanggan", sup: "Pembekal", set: "Tetapan", 
      search: "Cari / Kod Bar...", open: "Buka Shift", close: "Tutup Shift", 
      cart: "Troli Semasa", clear: "Kosongkan", sub: "Subjumlah", tax: "Cukai", dist: "Diskaun", total: "Jumlah", pay: "Bayar", 
      cash: "Tunai", card: "Kad", wallet: "Dompet", print: "Cetak Resit", 
      add: "Tambah Produk", pName: "Nama Produk", pPrice: "Harga", pStock: "Stok", pCode: "Kod Bar", act: "Tindakan", del: "Padam",
      sLang: "Bahasa Sistem", sCurr: "Mata Wang", sTax: "Kadar Cukai (%)", sDark: "Mod Gelap", sReset: "Tetapkan Semula",
      closed: "Daftar Ditutup", openReg: "Buka daftar untuk mula", inStock: "Dalam Stok"
    }
  };
  const t = dict[lang];

  // --- Initialization (Local Storage) ---
  useEffect(() => {
    const savedLang = localStorage.getItem("pos_lang");
    if (savedLang) setLang(savedLang as Lang);

    const savedCurr = localStorage.getItem("pos_curr");
    if (savedCurr) setCurrency(savedCurr);

    const savedProducts = localStorage.getItem("pos_products");
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    else setProducts([{ id: "1001", name: "Premium Coffee", price: 3.5, category: "Coffee", stock: 100, barcode: "12345", image: "https://placehold.co/100" }]);
    
    const savedOrders = localStorage.getItem("pos_orders");
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    setIsLoaded(true);
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("pos_lang", lang);
      localStorage.setItem("pos_curr", currency);
      localStorage.setItem("pos_products", JSON.stringify(products));
      localStorage.setItem("pos_orders", JSON.stringify(orders));
    }
  }, [lang, currency, products, orders, isLoaded]);


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
        setSearchQuery(""); 
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
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(c => c.id === p.id);
      return cartItem ? { ...p, stock: p.stock - cartItem.qty } : p;
    });
    setProducts(updatedProducts);

    const newOrder = { id: "INV" + Date.now(), time: new Date().toLocaleString(), total: grandTotalUSD, method, items: cart };
    setOrders([newOrder, ...orders]);
    setLastReceipt(newOrder);

    alert(`✅ Payment Success!\nOrder: ${newOrder.id}`);
    setCart([]); setDiscountVal(0);
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
              <span>{t.total}</span>
              <span>{symbols[currency]}{getPrice(lastReceipt.total)}</span>
            </div>
            <p className="text-xs mt-1">Method: {lastReceipt.method}</p>
            <p className="text-center mt-6">Thank you for your purchase!</p>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* MAIN APP */}
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
              if (tab.reqAdmin && role !== "Admin") return null; 
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
                  <div className="text-6xl mb-4">🔐</div><h2 className="text-xl font-bold mb-4">{t.closed}</h2>
                  <button onClick={()=>setIsShiftOpen(true)} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">{t.openReg}</button>
                </div>
              ) : (
                <div className="flex gap-6 h-full">
                  <div className="flex-1 flex flex-col">
                    <div className="flex gap-2 overflow-x-auto pb-4 shrink-0">
                      {["All", ...categories].map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-bold border ${activeCategory === cat ? "bg-slate-900 dark:bg-indigo-600 text-white" : "bg-white dark:bg-slate-800"}`}>
                          {cat === "All" ? (lang === "MM" ? "အားလုံး" : "All") : cat}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-20">
                      {filteredProducts.map(p => (
                        <button key={p.id} onClick={() => addToCart(p)} className="bg-white dark:bg-slate-800 p-3 rounded-xl border dark:border-slate-700 text-left hover:border-indigo-500 shadow-sm flex flex-col justify-between h-36">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 w-fit px-2 py-0.5 rounded">{p.stock} {t.inStock}</p>
                            <h3 className="font-bold text-sm mt-2">{p.name}</h3>
                          </div>
                          <p className="text-indigo-600 dark:text-indigo-400 font-black text-lg">{symbols[currency]}{getPrice(p.price)}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cart Sidebar */}
                  <div className="w-80 bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl flex flex-col shadow-lg shrink-0">
                    <div className="p-4 border-b dark:border-slate-800 font-bold flex justify-between">{t.cart} <span className="bg-indigo-100 text-indigo-700 px-2 rounded-full text-xs">{cart.length}</span></div>
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
                      <div className="flex justify-between text-xs font-bold mb-1"><span>{t.sub}</span><span>{symbols[currency]}{getPrice(subTotalUSD)}</span></div>
                      <div className="flex justify-between text-xs font-bold mb-1"><span>{t.tax}</span><span>{symbols[currency]}{getPrice(taxAmountUSD)}</span></div>
                      <div className="flex justify-between text-2xl font-black mb-4 mt-2 pt-2 border-t text-indigo-600 dark:text-indigo-400"><span>{t.total}</span><span>{symbols[currency]}{getPrice(grandTotalUSD)}</span></div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <button onClick={()=>handlePay(t.cash)} disabled={!cart.length} className="bg-white dark:bg-slate-800 border dark:border-slate-700 p-2 rounded-lg text-xs font-bold shadow-sm">💵<br/>{t.cash}</button>
                        <button onClick={()=>handlePay(t.card)} disabled={!cart.length} className="bg-white dark:bg-slate-800 border dark:border-slate-700 p-2 rounded-lg text-xs font-bold shadow-sm">💳<br/>{t.card}</button>
                        <button onClick={()=>handlePay(t.wallet)} disabled={!cart.length} className="bg-white dark:bg-slate-800 border dark:border-slate-700 p-2 rounded-lg text-xs font-bold shadow-sm">📱<br/>{t.wallet}</button>
                      </div>
                      {lastReceipt && (
                        <button onClick={handlePrint} className="w-full bg-slate-800 dark:bg-slate-700 text-white py-3 rounded-lg text-xs font-bold mt-2 shadow-md">🖨️ {t.print}</button>
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
                  <input type="text" id="pName" placeholder={t.pName} className="border p-2 rounded text-sm w-full dark:bg-slate-700 dark:border-slate-600" />
                  <input type="number" id="pPrice" placeholder={t.pPrice} className="border p-2 rounded text-sm w-full dark:bg-slate-700 dark:border-slate-600" />
                  <input type="number" id="pStock" placeholder={t.pStock} className="border p-2 rounded text-sm w-full dark:bg-slate-700 dark:border-slate-600" />
                  <input type="text" id="pBarcode" placeholder={t.pCode} className="border p-2 rounded text-sm w-full dark:bg-slate-700 dark:border-slate-600" />
                  <button onClick={() => {
                    const n = (document.getElementById("pName") as HTMLInputElement).value;
                    const p = (document.getElementById("pPrice") as HTMLInputElement).value;
                    const s = (document.getElementById("pStock") as HTMLInputElement).value;
                    const b = (document.getElementById("pBarcode") as HTMLInputElement).value;
                    if(n && p) setProducts([...products, { id: "P"+Date.now(), name: n, price: parseFloat(p)/rates[currency], stock: parseInt(s||"0"), barcode: b, category: "Meals", image: "" }]);
                  }} className="bg-indigo-600 text-white px-4 py-2 rounded font-bold whitespace-nowrap">{t.add}</button>
                </div>
                <table className="w-full text-left bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-xs uppercase"><tr><th className="p-3">{t.pName}</th><th className="p-3">{t.pCode}</th><th className="p-3">{t.pStock}</th><th className="p-3">{t.pPrice}</th><th className="p-3">{t.act}</th></tr></thead>
                  <tbody className="text-sm divide-y dark:divide-slate-700">
                    {products.map(p => (
                      <tr key={p.id}>
                        <td className="p-3 font-bold">{p.name}</td><td className="p-3 text-slate-400">{p.barcode}</td><td className="p-3 font-bold text-emerald-500">{p.stock}</td><td className="p-3 font-bold">{symbols[currency]}{getPrice(p.price)}</td>
                        <td className="p-3"><button onClick={() => setProducts(products.filter(x=>x.id!==p.id))} className="text-rose-500 font-bold">{t.del}</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 3. SETTINGS View */}
            {activeTab === "SETTINGS" && role === "Admin" && (
              <div className="max-w-3xl space-y-6">
                <h2 className="text-2xl font-bold">{t.set}</h2>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-500 dark:text-slate-400">{t.sLang}</label>
                    <select className="w-full border p-3 rounded-lg dark:bg-slate-900 dark:border-slate-700 font-bold" value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
                      <option value="EN">🇺🇸 English</option>
                      <option value="MM">🇲🇲 Myanmar (မြန်မာ)</option>
                      <option value="ZH">🇨🇳 Chinese (中文)</option>
                      <option value="MS">🇲🇾 Malay (Melayu)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-500 dark:text-slate-400">{t.sCurr}</label>
                    <select className="w-full border p-3 rounded-lg dark:bg-slate-900 dark:border-slate-700 font-bold" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                      <option value="USD">🇺🇸 USD ($)</option><option value="MMK">🇲🇲 MMK (Ks)</option>
                      <option value="MYR">🇲🇾 MYR (RM)</option><option value="THB">🇹🇭 THB (฿)</option>
                      <option value="SGD">🇸🇬 SGD (S$)</option><option value="CNY">🇨🇳 CNY (¥)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-500 dark:text-slate-400">{t.sTax}</label>
                    <input type="number" className="w-full border p-3 rounded-lg dark:bg-slate-900 dark:border-slate-700 font-bold" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-500 dark:text-slate-400">{t.sDark}</label>
                    <button onClick={()=>setIsDarkMode(!isDarkMode)} className={`w-full py-3 rounded-lg font-bold transition-colors ${isDarkMode ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700"}`}>
                      {isDarkMode ? "🌙 ON" : "☀️ OFF"}
                    </button>
                  </div>
                </div>
                <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-rose-500 font-bold text-sm bg-rose-50 dark:bg-rose-900/20 px-4 py-2 rounded-lg">⚠️ {t.sReset}</button>
              </div>
            )}

            {/* DASHBOARD / ORDERS Placeholder */}
            {["DASHBOARD", "ORDERS", "CUSTOMERS", "SUPPLIERS"].includes(activeTab) && (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold mb-4">{t[activeTab.toLowerCase().substring(0,4) as keyof typeof t] || activeTab}</h2>
                {activeTab === "ORDERS" && (
                  <ul className="mt-4 space-y-2">{orders.map((o:any) => <li key={o.id} className="p-3 border dark:border-slate-700 rounded text-sm flex justify-between items-center"><span className="font-bold text-indigo-500">{o.id} ({o.method})</span><span>{o.time}</span><span className="font-black text-lg">{symbols[currency]}{getPrice(o.total)}</span></li>)}</ul>
                )}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
