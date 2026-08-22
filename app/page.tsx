"use client";
import { useState, useMemo, useEffect } from "react";

// --- Types ---
type Product = { id: string; name: string; price: number; category: string; stock: number; barcode: string; image: string };
type CartItem = Product & { qty: number };
type Tab = "POS" | "DASHBOARD" | "INVENTORY" | "ORDERS" | "CUSTOMERS" | "SUPPLIERS" | "SETTINGS";
type Role = "Admin" | "Cashier";
type Lang = "EN" | "MM" | "ZH" | "MS";

export default function FullyResponsivePOS() {
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Core States ---
  const [activeTab, setActiveTab] = useState<Tab>("POS");
  const [role, setRole] = useState<Role>("Admin");
  const [lang, setLang] = useState<Lang>("EN");
  const [currency, setCurrency] = useState("USD");
  const [taxRate, setTaxRate] = useState(5);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isShiftOpen, setIsShiftOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // --- Data States (LocalStorage Sync) ---
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

  // --- Full Multi-Language Dictionary ---
  const dict = {
    EN: { 
      pos: "POS", dash: "Dashboard", inv: "Inventory", rep: "Reports", cust: "Customers", sup: "Suppliers", set: "Settings", 
      search: "Search or Barcode...", open: "Open Shift", close: "Close Shift", 
      cart: "Current Cart", clear: "Clear", sub: "Subtotal", tax: "Tax", dist: "Discount", total: "Total", pay: "Pay", 
      cash: "Cash", card: "Card", wallet: "Wallet", print: "Print Receipt", 
      add: "Add Product", pName: "Product Name", pPrice: "Price", pStock: "Stock", pCode: "Barcode", act: "Action", del: "Delete",
      sLang: "System Language", sCurr: "Default Currency", sTax: "Tax Rate (%)", sDark: "Dark Mode", sReset: "Reset All Data",
      closed: "Register Closed", openReg: "Open Register to start selling", inStock: "In Stock"
    },
    MM: { 
      pos: "အရောင်း", dash: "အနှစ်ချုပ်", inv: "ပစ္စည်းစာရင်း", rep: "စာရင်းစစ်", cust: "ဖောက်သည်", sup: "ကုန်သည်", set: "ဆက်တင်", 
      search: "ရှာဖွေရန် / ဘားကုဒ်...", open: "ဆိုင်ဖွင့်မည်", close: "ဆိုင်ပိတ်မည်", 
      cart: "ခြင်းတောင်း", clear: "ဖျက်မည်", sub: "ကျသင့်ငွေ", tax: "အခွန်", dist: "လျှော့စျေး", total: "စုစုပေါင်း", pay: "ငွေရှင်းမည်", 
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

  // --- Initialization ---
  useEffect(() => {
    const savedLang = localStorage.getItem("pos_lang");
    if (savedLang) setLang(savedLang as Lang);

    const savedCurr = localStorage.getItem("pos_curr");
    if (savedCurr) setCurrency(savedCurr);

    const savedProducts = localStorage.getItem("pos_products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts([
        { id: "1001", name: "Premium Espresso", price: 3.5, category: "Coffee", stock: 100, barcode: "12345", image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=300&q=80" },
        { id: "1002", name: "Avocado Toast", price: 7.0, category: "Meals", stock: 45, barcode: "12346", image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=300&q=80" },
        { id: "1003", name: "Iced Matcha Latte", price: 5.5, category: "Beverage", stock: 60, barcode: "12347", image: "https://images.unsplash.com/photo-1536935338773-84642228f257?w=300&q=80" }
      ]);
    }

    const savedOrders = localStorage.getItem("pos_orders");
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("pos_lang", lang);
      localStorage.setItem("pos_curr", currency);
      localStorage.setItem("pos_products", JSON.stringify(products));
      localStorage.setItem("pos_orders", JSON.stringify(orders));
    }
  }, [lang, currency, products, orders, isLoaded]);

  // --- Logic Helpers ---
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

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }).filter(item => item.qty > 0));
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

    // Save everything needed for the beautiful receipt
    const newOrder = { 
      id: "INV" + Date.now().toString().slice(-6), 
      time: new Date().toLocaleTimeString(), 
      subTotal: subTotalUSD,
      tax: taxAmountUSD,
      discount: discountUSD,
      total: grandTotalUSD, 
      method, 
      items: cart 
    };
    setOrders([newOrder, ...orders]);
    setLastReceipt(newOrder);

    alert(`✅ Payment Success!\nOrder: ${newOrder.id}`);
    setCart([]); 
    setDiscountVal(0);
    setIsMobileCartOpen(false);
  };

  const navItems = [
    { id: "POS", icon: "🛒", label: t.pos, reqAdmin: false },
    { id: "DASHBOARD", icon: "📊", label: t.dash, reqAdmin: true },
    { id: "INVENTORY", icon: "📦", label: t.inv, reqAdmin: true },
    { id: "ORDERS", icon: "🧾", label: t.rep, reqAdmin: true },
    { id: "CUSTOMERS", icon: "👥", label: t.cust, reqAdmin: false },
    { id: "SUPPLIERS", icon: "🚚", label: t.sup, reqAdmin: true },
    { id: "SETTINGS", icon: "⚙️", label: t.set, reqAdmin: true }
  ];

  if (!isLoaded) return <div className="p-10 font-bold">Loading NJANG POS...</div>;

  return (
    <div className={isDarkMode ? "dark" : ""}>
      
      {/* ================= BEAUTIFUL PRINT TEMPLATE ================= */}
      <div className="hidden print:flex justify-center p-8 text-black bg-white w-full h-full font-mono">
        {lastReceipt && (
          <div className="w-[80mm] mx-auto text-sm bg-white p-4">
            
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-black mb-1 tracking-tighter">GlobalPOS</h2>
              <p className="text-xs font-bold text-gray-500 mb-4 tracking-widest uppercase">By njangzaumun</p>
              <p className="text-xs">123 Tech Avenue, Building 4</p>
              <p className="text-xs">Silicon Valley, CA 90210</p>
              <p className="text-xs">Tel: +1 234 567 8900</p>
            </div>

            {/* Receipt Info */}
            <div className="border-b-2 border-dashed border-gray-400 pb-3 mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Receipt No:</span>
                <span className="font-bold">{lastReceipt.id}</span>
              </div>
              <div className="flex justify-between text-xs mb-1">
                <span>Date:</span>
                <span>{lastReceipt.time}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Cashier:</span>
                <span>{role}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="border-b-2 border-dashed border-gray-400 pb-3 mb-3 min-h-[100px]">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left border-b border-gray-300">
                    <th className="pb-2 font-bold uppercase tracking-wider">Item</th>
                    <th className="pb-2 font-bold uppercase tracking-wider text-center">Qty</th>
                    <th className="pb-2 font-bold uppercase tracking-wider text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="align-top">
                  {lastReceipt.items.map((item: any) => (
                    <tr key={item.id}>
                      <td className="py-2 pr-2 font-medium">{item.name}</td>
                      <td className="py-2 text-center">{item.qty}</td>
                      <td className="py-2 text-right">{symbols[currency]}{getPrice(item.price * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations */}
            <div className="border-b-2 border-dashed border-gray-400 pb-3 mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Subtotal</span>
                <span>{symbols[currency]}{getPrice(lastReceipt.subTotal)}</span>
              </div>
              <div className="flex justify-between text-xs mb-1">
                <span>Tax ({taxRate}%)</span>
                <span>{symbols[currency]}{getPrice(lastReceipt.tax)}</span>
              </div>
              {lastReceipt.discount > 0 && (
                <div className="flex justify-between text-xs mb-1">
                  <span>Discount</span>
                  <span>-{symbols[currency]}{getPrice(lastReceipt.discount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-lg font-black mt-3 pt-3 border-t border-gray-300">
                <span>TOTAL</span>
                <span>{symbols[currency]}{getPrice(lastReceipt.total)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center space-y-1">
              <p className="text-xs">Paid by: <span className="font-bold border px-1">{lastReceipt.method}</span></p>
              <p className="mt-6 font-bold text-sm tracking-wide">THANK YOU!</p>
              <p className="text-[10px] text-gray-500">Please come again</p>
              
              {/* Fake Barcode Generator */}
              <div className="flex justify-center h-10 mt-4 opacity-80 gap-[1px]">
                {['w-1','w-2','w-1','w-3','w-1','w-2','w-1','w-4','w-2','w-1','w-3','w-1','w-2','w-1'].map((w, i) => (
                  <div key={i} className={`bg-black h-full ${w}`}></div>
                ))}
              </div>
              <p className="text-[10px] tracking-[0.3em] mt-1 font-bold">{lastReceipt.id}</p>
            </div>

          </div>
        </div>
      )}

      {/* ================= MAIN APPLICATION ================= */}
      <div className="flex flex-col md:flex-row h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white print:hidden overflow-hidden select-none">
        
        {/* --- DESKTOP & TABLET SIDEBAR --- */}
        <aside className="hidden md:flex w-20 lg:w-24 bg-white dark:bg-slate-950 border-r dark:border-slate-800 flex-col items-center py-4 shadow-xl z-20 shrink-0">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl mb-6 shadow-md">N</div>
          <nav className="flex-1 flex flex-col gap-2 w-full">
            {navItems.map(tab => {
              if (tab.reqAdmin && role !== "Admin") return null;
              return (
                <button 
                  key={tab.id} onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex flex-col items-center justify-center w-full py-3 border-r-4 transition-all ${activeTab === tab.id ? "text-indigo-600 dark:text-indigo-400 border-indigo-600 bg-indigo-50 dark:bg-slate-800" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <span className="text-2xl mb-1">{tab.icon}</span>
                  <span className="text-[9px] uppercase font-bold">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          
          {/* Header */}
          <header className="h-16 bg-white dark:bg-slate-950 border-b dark:border-slate-800 px-4 flex items-center justify-between shrink-0 z-10">
            <div className="flex items-center gap-3">
              <select className="bg-slate-100 dark:bg-slate-800 text-xs font-bold p-2 rounded-xl border dark:border-slate-700 outline-none" value={role} onChange={e => setRole(e.target.value as Role)}>
                <option value="Admin">👑 Admin</option>
                <option value="Cashier">👤 Cashier</option>
              </select>
            </div>

            <div className="flex-1 max-w-md mx-3">
              <input 
                type="text" placeholder={t.search} 
                className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full text-xs md:text-sm w-full outline-none border dark:border-slate-700 focus:border-indigo-500" 
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setIsShiftOpen(!isShiftOpen)} className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs font-bold transition-all ${isShiftOpen ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400" : "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-400"}`}>
                {isShiftOpen ? t.close : t.open}
              </button>
            </div>
          </header>

          {/* Tab Views */}
          <div className="flex-1 overflow-y-auto p-3 md:p-6 pb-24 md:pb-6">
            
            {/* 1. POS View */}
            {activeTab === "POS" && (
              !isShiftOpen ? (
                <div className="m-auto mt-16 text-center p-8 bg-white dark:bg-slate-800 rounded-3xl max-w-sm shadow-xl border dark:border-slate-700">
                  <div className="text-6xl mb-4">🔐</div>
                  <h2 className="text-lg font-bold mb-4">{t.closed}</h2>
                  <button onClick={() => setIsShiftOpen(true)} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700">{t.openReg}</button>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-6 h-full">
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide shrink-0">
                      {["All", ...categories].map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold border transition-all ${activeCategory === cat ? "bg-slate-900 dark:bg-indigo-600 text-white shadow" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}>
                          {cat === "All" ? (lang === "MM" ? "အားလုံး" : "All") : cat}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 overflow-y-auto pb-24 lg:pb-0">
                      {filteredProducts.map(p => (
                        <button key={p.id} onClick={() => addToCart(p)} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border dark:border-slate-700 hover:border-indigo-500 shadow-sm text-left flex flex-col justify-between active:scale-95 transition-all">
                          <img src={p.image} className="w-full h-28 sm:h-32 object-cover bg-slate-100 dark:bg-slate-700" alt={p.name} />
                          <div className="p-3">
                            <p className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 w-fit px-1.5 py-0.5 rounded">{p.stock} {t.inStock}</p>
                            <h3 className="font-bold text-xs md:text-sm mt-1 truncate">{p.name}</h3>
                            <p className="text-indigo-600 dark:text-indigo-400 font-black text-sm md:text-base mt-1">{symbols[currency]}{getPrice(p.price)}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Desktop & iPad Cart Drawer */}
                  <div className="hidden lg:flex w-80 xl:w-96 bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl flex-col shadow-lg shrink-0">
                    <div className="p-4 border-b dark:border-slate-800 font-bold flex justify-between items-center">
                      <span>{t.cart}</span>
                      <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-0.5 rounded-full">{cart.length} items</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {cart.map(c => (
                        <div key={c.id} className="text-xs md:text-sm border-b dark:border-slate-800 pb-2 flex justify-between items-center">
                          <div className="flex-1 pr-2">
                            <p className="font-bold truncate">{c.name}</p>
                            <p className="text-slate-400">{symbols[currency]}{getPrice(c.price * c.qty)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQty(c.id, -1)} className="bg-slate-100 dark:bg-slate-800 w-6 h-6 rounded flex items-center justify-center font-bold">-</button>
                            <span className="w-4 text-center font-bold">{c.qty}</span>
                            <button onClick={() => updateQty(c.id, 1)} className="bg-slate-100 dark:bg-slate-800 w-6 h-6 rounded flex items-center justify-center font-bold">+</button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-b-2xl border-t dark:border-slate-800">
                      <div className="flex justify-between text-xs font-bold mb-1"><span>{t.sub}</span><span>{symbols[currency]}{getPrice(subTotalUSD)}</span></div>
                      <div className="flex justify-between text-xs font-bold mb-1"><span>{t.tax}</span><span>{symbols[currency]}{getPrice(taxAmountUSD)}</span></div>
                      <div className="flex justify-between text-lg font-black mb-3 mt-2 pt-2 border-t text-indigo-600 dark:text-indigo-400"><span>{t.total}</span><span>{symbols[currency]}{getPrice(grandTotalUSD)}</span></div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <button onClick={() => handlePay("Cash")} disabled={!cart.length} className="bg-white dark:bg-slate-800 border dark:border-slate-700 py-2 rounded-xl text-xs font-bold shadow-sm">💵 {t.cash}</button>
                        <button onClick={() => handlePay("Card")} disabled={!cart.length} className="bg-white dark:bg-slate-800 border dark:border-slate-700 py-2 rounded-xl text-xs font-bold shadow-sm">💳 {t.card}</button>
                        <button onClick={() => handlePay("Wallet")} disabled={!cart.length} className="bg-white dark:bg-slate-800 border dark:border-slate-700 py-2 rounded-xl text-xs font-bold shadow-sm">📱 {t.wallet}</button>
                      </div>

                      {lastReceipt && (
                        <button onClick={() => window.print()} className="w-full bg-slate-800 dark:bg-slate-700 text-white py-2 rounded-xl text-xs font-bold shadow">🖨️ {t.print}</button>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}

            {/* 2. INVENTORY View */}
            {activeTab === "INVENTORY" && role === "Admin" && (
              <div className="max-w-4xl mx-auto space-y-4">
                <h2 className="text-xl md:text-2xl font-bold">{t.inv}</h2>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm grid grid-cols-2 md:grid-cols-4 gap-2">
                  <input type="text" id="pName" placeholder={t.pName} className="border p-2 rounded-xl text-xs dark:bg-slate-700 dark:border-slate-600 outline-none" />
                  <input type="number" id="pPrice" placeholder={t.pPrice} className="border p-2 rounded-xl text-xs dark:bg-slate-700 dark:border-slate-600 outline-none" />
                  <input type="number" id="pStock" placeholder={t.pStock} className="border p-2 rounded-xl text-xs dark:bg-slate-700 dark:border-slate-600 outline-none" />
                  <button onClick={() => {
                    const n = (document.getElementById("pName") as HTMLInputElement).value;
                    const p = (document.getElementById("pPrice") as HTMLInputElement).value;
                    const s = (document.getElementById("pStock") as HTMLInputElement).value;
                    if(n && p) setProducts([...products, { id: "P"+Date.now(), name: n, price: parseFloat(p)/rates[currency], stock: parseInt(s||"0"), barcode: "N/A", category: "Meals", image: "https://placehold.co/100" }]);
                  }} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-xs shadow">{t.add}</button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-x-auto">
                  <table className="w-full text-left text-xs md:text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-700">
                      <tr><th className="p-3">{t.pName}</th><th className="p-3">{t.pStock}</th><th className="p-3">{t.pPrice}</th><th className="p-3">{t.act}</th></tr>
                    </thead>
                    <tbody className="divide-y dark:divide-slate-700">
                      {products.map(p => (
                        <tr key={p.id}>
                          <td className="p-3 font-bold">{p.name}</td>
                          <td className="p-3 text-emerald-500 font-bold">{p.stock}</td>
                          <td className="p-3">{symbols[currency]}{getPrice(p.price)}</td>
                          <td className="p-3"><button onClick={() => setProducts(products.filter(x=>x.id!==p.id))} className="text-rose-500 font-bold">{t.del}</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. SETTINGS View */}
            {activeTab === "SETTINGS" && role === "Admin" && (
              <div className="max-w-2xl mx-auto space-y-4">
                <h2 className="text-xl md:text-2xl font-bold">{t.set}</h2>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm space-y-4 text-xs md:text-sm">
                  <div>
                    <label className="block font-bold mb-1">{t.sLang}</label>
                    <select className="w-full border p-2.5 rounded-xl dark:bg-slate-700 dark:border-slate-600 font-bold" value={lang} onChange={e => setLang(e.target.value as Lang)}>
                      <option value="EN">🇺🇸 English</option>
                      <option value="MM">🇲🇲 Myanmar (မြန်မာ)</option>
                      <option value="ZH">🇨🇳 Chinese (中文)</option>
                      <option value="MS">🇲🇾 Malay (Melayu)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1">{t.sCurr}</label>
                    <select className="w-full border p-2.5 rounded-xl dark:bg-slate-700 dark:border-slate-600 font-bold" value={currency} onChange={e => setCurrency(e.target.value)}>
                      <option value="USD">USD ($)</option><option value="MMK">MMK (Ks)</option>
                      <option value="MYR">MYR (RM)</option><option value="THB">THB (฿)</option>
                      <option value="SGD">SGD (S$)</option><option value="CNY">CNY (¥)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1">{t.sDark}</label>
                    <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-full py-2.5 rounded-xl font-bold ${isDarkMode ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-800"}`}>
                      {isDarkMode ? "🌙 ON" : "☀️ OFF"}
                    </button>
                  </div>
                  <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-rose-500 font-bold text-xs bg-rose-50 dark:bg-rose-900/20 px-4 py-2 rounded-xl w-full">⚠️ {t.sReset}</button>
                </div>
              </div>
            )}

            {/* Other Placeholders */}
            {["DASHBOARD", "ORDERS", "CUSTOMERS", "SUPPLIERS"].includes(activeTab) && (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm max-w-2xl mx-auto">
                <h2 className="text-lg font-bold mb-3">{t[activeTab.toLowerCase().substring(0,4) as keyof typeof t] || activeTab}</h2>
                {activeTab === "ORDERS" && (
                  <ul className="space-y-2 text-xs md:text-sm">
                    {orders.map((o:any) => <li key={o.id} className="p-3 border dark:border-slate-700 rounded-xl flex justify-between"><span>{o.id} ({o.method})</span><span className="font-bold">{symbols[currency]}{getPrice(o.total)}</span></li>)}
                  </ul>
                )}
              </div>
            )}

          </div>
        </main>

        {/* --- MOBILE FLOATING CART BUTTON --- */}
        {activeTab === "POS" && isShiftOpen && (
          <div className="lg:hidden fixed bottom-16 right-4 z-40">
            <button onClick={() => setIsMobileCartOpen(true)} className="bg-indigo-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-bold animate-bounce">
              🛒 <span className="bg-white text-indigo-600 rounded-full w-5 h-5 text-xs flex items-center justify-center font-black">{cart.length}</span>
            </button>
          </div>
        )}

        {/* --- MOBILE CART MODAL / BOTTOM SHEET --- */}
        {isMobileCartOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/60 z-50 flex flex-col justify-end backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-t-3xl p-5 max-h-[85vh] flex flex-col shadow-2xl">
              <div className="flex justify-between items-center pb-3 border-b dark:border-slate-800">
                <h3 className="font-bold text-base">{t.cart} ({cart.length})</h3>
                <button onClick={() => setIsMobileCartOpen(false)} className="text-rose-500 font-bold text-sm">✕ Close</button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {cart.map(c => (
                  <div key={c.id} className="flex justify-between items-center text-sm border-b dark:border-slate-800 pb-2">
                    <div><p className="font-bold">{c.name}</p><p className="text-slate-400 text-xs">{symbols[currency]}{getPrice(c.price * c.qty)}</p></div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(c.id, -1)} className="bg-slate-100 dark:bg-slate-800 w-7 h-7 rounded font-bold">-</button>
                      <span>{c.qty}</span>
                      <button onClick={() => updateQty(c.id, 1)} className="bg-slate-100 dark:bg-slate-800 w-7 h-7 rounded font-bold">+</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t dark:border-slate-800 space-y-2">
                <div className="flex justify-between font-black text-xl text-indigo-600"><span>{t.total}</span><span>{symbols[currency]}{getPrice(grandTotalUSD)}</span></div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <button onClick={() => handlePay("Cash")} disabled={!cart.length} className="bg-indigo-50 dark:bg-slate-800 text-indigo-600 border dark:border-slate-700 py-3 rounded-xl font-bold text-xs">💵 {t.cash}</button>
                  <button onClick={() => handlePay("Card")} disabled={!cart.length} className="bg-indigo-50 dark:bg-slate-800 text-indigo-600 border dark:border-slate-700 py-3 rounded-xl font-bold text-xs">💳 {t.card}</button>
                  <button onClick={() => handlePay("Wallet")} disabled={!cart.length} className="bg-indigo-50 dark:bg-slate-800 text-indigo-600 border dark:border-slate-700 py-3 rounded-xl font-bold text-xs">📱 {t.wallet}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- MOBILE BOTTOM NAVIGATION BAR --- */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white dark:bg-slate-950 border-t dark:border-slate-800 flex items-center justify-around z-30 shadow-lg">
          {navItems.slice(0, 5).map(tab => (
            <button 
              key={tab.id} onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex flex-col items-center justify-center p-1 ${activeTab === tab.id ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-400"}`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[9px]">{tab.label}</span>
            </button>
          ))}
          <button onClick={() => setActiveTab("SETTINGS")} className={`flex flex-col items-center justify-center p-1 ${activeTab === "SETTINGS" ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-400"}`}>
            <span className="text-lg">⚙️</span>
            <span className="text-[9px]">{t.set}</span>
          </button>
        </nav>

      </div>
    </div>
  );
}
