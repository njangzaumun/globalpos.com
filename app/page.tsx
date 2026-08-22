"use client";
import { useState, useMemo, useEffect } from "react";

// --- Types ---
type Product = { id: string; name: string; price: number; category: string; stock: number; barcode: string; image: string };
type CartItem = Product & { qty: number };
type Tab = "POS" | "DASHBOARD" | "INVENTORY" | "ORDERS" | "CUSTOMERS" | "SUPPLIERS" | "SETTINGS";
type Role = "Admin" | "Cashier";
type Lang = "EN" | "MM" | "ZH" | "MS";
type User = { username: string; password?: string; role: Role };

export default function FullyResponsivePOS() {
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Auth States ---
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authRole, setAuthRole] = useState<Role>("Admin");

  // --- Core States ---
  const [activeTab, setActiveTab] = useState<Tab>("POS");
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
  const [currentPlan, setCurrentPlan] = useState("Free Trial");
  const [subModalPlan, setSubModalPlan] = useState<{name: string, price: string} | null>(null);

  // --- POS States ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [discountVal, setDiscountVal] = useState(0);
  const [lastReceipt, setLastReceipt] = useState<any>(null);
  const [selectedTable, setSelectedTable] = useState("Takeaway");
  const tableList = ["Takeaway", "T-01", "T-02", "T-03", "T-04", "T-05", "T-06", "VIP-1", "VIP-2"];

  const rates: Record<string, number> = { USD: 1, MMK: 4500, MYR: 4.7, THB: 35, SGD: 1.35, CNY: 7.2 };
  const symbols: Record<string, string> = { USD: "$", MMK: "Ks ", MYR: "RM", THB: "฿", SGD: "S$", CNY: "¥" };

  // --- Full Multi-Language Dictionary ---
  const dict = {
    EN: { 
      pos: "POS", dash: "Dashboard", inv: "Inventory", rep: "Reports", cust: "Customers", sup: "Suppliers", set: "Settings", search: "Search...", 
      open: "Open Shift", close: "Close Shift", cart: "Current Cart", clear: "Clear", sub: "Subtotal", tax: "Tax", dist: "Discount", total: "Total", pay: "Pay", cash: "Cash", card: "Card", wallet: "Wallet", print: "Print", add: "Add Product", pName: "Product Name", pPrice: "Price", pStock: "Stock", act: "Action", del: "Delete", sLang: "Language", sCurr: "Currency", sTax: "Tax Rate (%)", sDark: "Dark Mode", sReset: "Reset All Data", closed: "Register Closed", openReg: "Open Register", takeaway: "Takeaway", tbl: "Table", login: "Login", reg: "Create Account", user: "Username", pass: "Password", logout: "Logout"
    },
    MM: { 
      pos: "အရောင်း", dash: "အနှစ်ချုပ်", inv: "ပစ္စည်းစာရင်း", rep: "စာရင်းစစ်", cust: "ဖောက်သည်", sup: "ကုန်သည်", set: "ဆက်တင်", search: "ရှာဖွေရန်...", 
      open: "ဆိုင်ဖွင့်မည်", close: "ဆိုင်ပိတ်မည်", cart: "ခြင်းတောင်း", clear: "ဖျက်မည်", sub: "ကျသင့်ငွေ", tax: "အခွန်", dist: "လျှော့စျေး", total: "စုစုပေါင်း", pay: "ငွေရှင်းမည်", cash: "ငွေသား", card: "ကတ်", wallet: "KPay", print: "ဘေလ်ထုတ်မည်", add: "အသစ်ထည့်ရန်", pName: "အမည်", pPrice: "စျေးနှုန်း", pStock: "လက်ကျန်", act: "လုပ်ဆောင်ချက်", del: "ဖျက်မည်", sLang: "ဘာသာစကား", sCurr: "ငွေကြေး", sTax: "အခွန် (%)", sDark: "အမည်းရောင်", sReset: "ဒေတာဖျက်မည်", closed: "ဆိုင်ပိတ်ထားပါသည်", openReg: "အရောင်းစတင်ရန်", takeaway: "ပါဆယ်", tbl: "စားပွဲ", login: "အကောင့်ဝင်မည်", reg: "အကောင့်သစ်ဖွင့်မည်", user: "အသုံးပြုသူအမည်", pass: "စကားဝှက်", logout: "ထွက်မည်"
    },
    ZH: { pos: "收银", dash: "仪表板", inv: "库存", rep: "报告", cust: "客户", sup: "供应商", set: "设置", search: "搜索...", open: "开班", close: "结班", cart: "购物车", clear: "清空", sub: "小计", tax: "税", dist: "折扣", total: "总计", pay: "付款", cash: "现金", card: "刷卡", wallet: "钱包", print: "打印", add: "添加", pName: "名称", pPrice: "价格", pStock: "库存", act: "操作", del: "删除", sLang: "语言", sCurr: "货币", sTax: "税率", sDark: "深色模式", sReset: "重置数据", closed: "收银关闭", openReg: "开班", takeaway: "外卖", tbl: "桌号", login: "登录", reg: "注册", user: "用户名", pass: "密码", logout: "登出" },
    MS: { pos: "Jualan", dash: "Papan", inv: "Inventori", rep: "Laporan", cust: "Pelanggan", sup: "Pembekal", set: "Tetapan", search: "Cari...", open: "Buka Shift", close: "Tutup Shift", cart: "Troli", clear: "Kosong", sub: "Subjumlah", tax: "Cukai", dist: "Diskaun", total: "Jumlah", pay: "Bayar", cash: "Tunai", card: "Kad", wallet: "Dompet", print: "Cetak", add: "Tambah", pName: "Nama", pPrice: "Harga", pStock: "Stok", act: "Tindakan", del: "Padam", sLang: "Bahasa", sCurr: "Mata Wang", sTax: "Cukai", sDark: "Gelap", sReset: "Set Semula", closed: "Ditutup", openReg: "Buka", takeaway: "Bungkus", tbl: "Meja", login: "Log Masuk", reg: "Daftar", user: "Nama Pengguna", pass: "Kata Laluan", logout: "Log Keluar" }
  };
  const t = dict[lang];

  // --- Initialization ---
  useEffect(() => {
    setLang((localStorage.getItem("pos_lang") as Lang) || "EN");
    setCurrency(localStorage.getItem("pos_curr") || "USD");
    setCurrentPlan(localStorage.getItem("pos_plan") || "Free Trial");

    const savedUsers = JSON.parse(localStorage.getItem("pos_users") || "[]");
    if(savedUsers.length === 0) {
      // Default Admin Account if none exists
      savedUsers.push({ username: "admin", password: "123", role: "Admin" });
      localStorage.setItem("pos_users", JSON.stringify(savedUsers));
    }
    setUsers(savedUsers);

    const activeUser = JSON.parse(localStorage.getItem("pos_currentUser") || "null");
    if(activeUser) setCurrentUser(activeUser);

    const savedProducts = localStorage.getItem("pos_products");
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    else setProducts([
      { id: "1001", name: "Premium Espresso", price: 3.5, category: "Coffee", stock: 100, barcode: "12345", image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=300&q=80" },
      { id: "1002", name: "Avocado Toast", price: 7.0, category: "Meals", stock: 45, barcode: "12346", image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=300&q=80" }
    ]);

    const savedOrders = localStorage.getItem("pos_orders");
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("pos_lang", lang);
      localStorage.setItem("pos_curr", currency);
      localStorage.setItem("pos_plan", currentPlan);
      localStorage.setItem("pos_products", JSON.stringify(products));
      localStorage.setItem("pos_orders", JSON.stringify(orders));
      localStorage.setItem("pos_users", JSON.stringify(users));
      localStorage.setItem("pos_currentUser", JSON.stringify(currentUser));
    }
  }, [lang, currency, currentPlan, products, orders, users, currentUser, isLoaded]);

  // --- Auth Logic ---
  const handleLogin = (e: any) => {
    e.preventDefault();
    const user = users.find(u => u.username === authUsername && u.password === authPassword);
    if (user) {
      setCurrentUser(user);
      setAuthUsername(""); setAuthPassword("");
    } else alert("Invalid Username or Password!");
  };

  const handleRegister = (e: any) => {
    e.preventDefault();
    if(users.find(u => u.username === authUsername)) return alert("Username already exists!");
    const newUser = { username: authUsername, password: authPassword, role: authRole };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setAuthUsername(""); setAuthPassword("");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsShiftOpen(false);
  };

  // --- Core Logic Helpers ---
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
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty: item.qty + delta } : item).filter(item => item.qty > 0));
  };

  const subTotalUSD = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const taxAmountUSD = subTotalUSD * (taxRate / 100);
  const grandTotalUSD = subTotalUSD + taxAmountUSD - (discountVal / rates[currency]);

  const handlePay = (method: string) => {
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(c => c.id === p.id);
      return cartItem ? { ...p, stock: p.stock - cartItem.qty } : p;
    });
    setProducts(updatedProducts);

    const newOrder = { 
      id: "INV" + Date.now().toString().slice(-6), 
      time: new Date().toLocaleString(), 
      table: selectedTable,
      cashier: currentUser?.username, // SAVE CASHIER NAME
      subTotal: subTotalUSD, tax: taxAmountUSD, total: grandTotalUSD, method, items: cart 
    };
    setOrders([newOrder, ...orders]);
    setLastReceipt(newOrder);

    alert(`✅ Payment Success!\nOrder: ${newOrder.id}\nTable: ${selectedTable}\nCashier: ${currentUser?.username}`);
    setCart([]); setSelectedTable("Takeaway"); setIsMobileCartOpen(false);
  };

  if (!isLoaded) return <div className="p-10 font-bold flex justify-center items-center h-screen bg-slate-50">Loading NJANG POS...</div>;

  // ============================================================================
  // 1. AUTH SCREEN (LOGIN / REGISTER)
  // ============================================================================
  if (!currentUser) {
    return (
      <div className={`h-screen flex items-center justify-center ${isDarkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>
        <div className="w-full max-w-sm p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border dark:border-slate-800">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-4 shadow-lg">N</div>
            <h2 className="text-2xl font-black">GlobalPOS</h2>
            <p className="text-sm text-slate-500">By njangzaumun</p>
          </div>

          <form onSubmit={authMode === "login" ? handleLogin : handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1 ml-1">{t.user}</label>
              <input required type="text" value={authUsername} onChange={e=>setAuthUsername(e.target.value)} className="w-full border dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl outline-none focus:border-indigo-500" placeholder="e.g. admin" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 ml-1">{t.pass}</label>
              <input required type="password" value={authPassword} onChange={e=>setAuthPassword(e.target.value)} className="w-full border dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl outline-none focus:border-indigo-500" placeholder="••••••••" />
            </div>
            
            {authMode === "register" && (
              <div>
                <label className="block text-xs font-bold mb-1 ml-1">Role</label>
                <select value={authRole} onChange={e=>setAuthRole(e.target.value as Role)} className="w-full border dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl outline-none">
                  <option value="Admin">Admin</option>
                  <option value="Cashier">Cashier</option>
                </select>
              </div>
            )}

            <button type="submit" className="w-full bg-indigo-600 text-white font-bold p-3 rounded-xl shadow-md hover:bg-indigo-700 mt-2">
              {authMode === "login" ? t.login : t.reg}
            </button>
          </form>

          <p className="text-center text-sm font-bold mt-6 text-slate-500 cursor-pointer" onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}>
            {authMode === "login" ? "Need an account? " + t.reg : "Already have an account? " + t.login}
          </p>
        </div>
      </div>
    )
  }

  // ============================================================================
  // 2. MAIN APPLICATION (POS)
  // ============================================================================
  const navItems = [
    { id: "POS", icon: "🛒", label: t.pos, reqAdmin: false },
    { id: "DASHBOARD", icon: "📊", label: t.dash, reqAdmin: true },
    { id: "INVENTORY", icon: "📦", label: t.inv, reqAdmin: true },
    { id: "ORDERS", icon: "🧾", label: t.rep, reqAdmin: true },
    { id: "CUSTOMERS", icon: "👥", label: t.cust, reqAdmin: false },
    { id: "SUPPLIERS", icon: "🚚", label: t.sup, reqAdmin: true },
    { id: "SETTINGS", icon: "⚙️", label: t.set, reqAdmin: true }
  ];

  return (
    <div className={isDarkMode ? "dark" : ""}>
      
      {/* --- PRINT RECEIPT TEMPLATE --- */}
      <div className="hidden print:flex justify-center p-8 text-black bg-white w-full h-full font-mono">
        {lastReceipt && (
          <div className="w-[80mm] mx-auto text-sm bg-white p-4">
            <div className="text-center mb-5">
              <h2 className="text-3xl font-black mb-1 tracking-tighter">GlobalPOS</h2>
              <p className="text-xs font-bold text-gray-500 mb-4 tracking-widest uppercase">By njangzaumun</p>
            </div>
            <div className="border-4 border-black text-center py-2 mb-4">
              <p className="text-xs font-bold uppercase">{lastReceipt.table === "Takeaway" ? "Order Type" : "Table"}</p>
              <p className="text-3xl font-black tracking-widest">{lastReceipt.table === "Takeaway" ? "TAKEAWAY" : lastReceipt.table}</p>
            </div>
            <div className="border-b-2 border-dashed border-gray-400 pb-2 mb-3 text-xs">
              <div className="flex justify-between mb-1"><span>Receipt:</span><span className="font-bold">{lastReceipt.id}</span></div>
              <div className="flex justify-between mb-1"><span>Date:</span><span>{lastReceipt.time}</span></div>
              <div className="flex justify-between"><span>Cashier:</span><span className="uppercase">{lastReceipt.cashier}</span></div>
            </div>
            <div className="border-b-2 border-dashed border-gray-400 pb-2 mb-3 min-h-[100px]">
              <table className="w-full text-xs">
                <thead><tr className="text-left border-b border-gray-300"><th className="pb-1">Item</th><th className="pb-1 text-center">Qty</th><th className="pb-1 text-right">Price</th></tr></thead>
                <tbody>{lastReceipt.items.map((i:any) => (<tr key={i.id}><td className="py-1">{i.name}</td><td className="py-1 text-center">{i.qty}</td><td className="py-1 text-right">{symbols[currency]}{getPrice(i.price*i.qty)}</td></tr>))}</tbody>
              </table>
            </div>
            <div className="border-b-2 border-dashed border-gray-400 pb-3 mb-4 text-xs">
              <div className="flex justify-between mb-1"><span>Subtotal</span><span>{symbols[currency]}{getPrice(lastReceipt.subTotal)}</span></div>
              <div className="flex justify-between mb-1"><span>Tax</span><span>{symbols[currency]}{getPrice(lastReceipt.tax)}</span></div>
              <div className="flex justify-between text-lg font-black mt-2 pt-2 border-t border-gray-300"><span>TOTAL</span><span>{symbols[currency]}{getPrice(lastReceipt.total)}</span></div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs">Paid by: <span className="font-bold border px-1">{lastReceipt.method}</span></p>
              <p className="mt-4 font-bold tracking-wide">THANK YOU!</p>
            </div>
          </div>
        )}
      </div>

      {/* --- APP LAYOUT --- */}
      <div className="flex flex-col md:flex-row h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white print:hidden overflow-hidden transition-colors">
        
        {/* SIDEBAR */}
        <aside className="hidden md:flex w-20 lg:w-24 bg-white dark:bg-slate-950 border-r dark:border-slate-800 flex-col items-center py-4 z-20 shrink-0 shadow-lg">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl mb-6 shadow-md">N</div>
          <nav className="flex-1 flex flex-col gap-2 w-full">
            {navItems.map(tab => {
              if (tab.reqAdmin && currentUser.role !== "Admin") return null;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)} className={`flex flex-col items-center justify-center w-full py-3 border-r-4 transition-all ${activeTab === tab.id ? "text-indigo-600 dark:text-indigo-400 border-indigo-600 bg-indigo-50 dark:bg-slate-800" : "border-transparent opacity-60 hover:opacity-100"}`}>
                  <span className="text-2xl mb-1">{tab.icon}</span><span className="text-[9px] uppercase font-bold">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* HEADER */}
          <header className="h-16 bg-white dark:bg-slate-950 border-b dark:border-slate-800 px-4 flex items-center justify-between shrink-0 z-10">
            
            {/* USER INFO & LOGOUT */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border dark:border-slate-700 flex flex-col justify-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">{currentUser.role}</span>
                <span className="text-xs font-black capitalize leading-none">{currentUser.username}</span>
              </div>
              <button onClick={handleLogout} className="text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 px-3 py-1.5 rounded-xl transition-all">
                {t.logout}
              </button>
            </div>

            <div className="flex-1 max-w-md mx-3">
              <input type="text" placeholder={t.search} className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full text-xs md:text-sm w-full outline-none border dark:border-slate-700 focus:border-indigo-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            <div>
              <button onClick={() => setIsShiftOpen(!isShiftOpen)} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${isShiftOpen ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400" : "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-400"}`}>
                {isShiftOpen ? t.close : t.open}
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-3 md:p-6 pb-24 md:pb-6 relative">
            
            {/* POS VIEW */}
            {activeTab === "POS" && (
              !isShiftOpen ? (
                <div className="m-auto mt-16 text-center p-8 bg-white dark:bg-slate-800 rounded-3xl max-w-sm shadow-xl border dark:border-slate-700">
                  <div className="text-6xl mb-4">🔐</div><h2 className="text-lg font-bold mb-4">{t.closed}</h2>
                  <button onClick={() => setIsShiftOpen(true)} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-md">{t.openReg}</button>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-6 h-full">
                  
                  {/* Products Grid */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide shrink-0">
                      {["All", ...categories].map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold border transition-all ${activeCategory === cat ? "bg-slate-900 dark:bg-indigo-600 text-white shadow" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}>
                          {cat}
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

                  {/* CART DRAWER */}
                  <div className="hidden lg:flex w-80 xl:w-96 bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl flex-col shadow-lg shrink-0 overflow-hidden">
                    
                    <div className="bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-800 p-3 shrink-0">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Select Table / Takeaway</p>
                      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {tableList.map(tbl => (
                          <button key={tbl} onClick={() => setSelectedTable(tbl)} className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${selectedTable === tbl ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : "bg-white dark:bg-slate-800 text-slate-600 dark:border-slate-700"}`}>
                            {tbl === "Takeaway" ? t.takeaway : tbl}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 border-b dark:border-slate-800 font-bold flex justify-between bg-white dark:bg-slate-950 shrink-0">
                      <span>{t.cart}</span><span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 px-2 rounded-full text-xs">{cart.length}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white dark:bg-slate-950">
                      {cart.map(c => (
                        <div key={c.id} className="text-xs md:text-sm border-b dark:border-slate-800 pb-2 flex justify-between items-center">
                          <div className="flex-1 pr-2"><p className="font-bold truncate">{c.name}</p><p className="text-slate-400">{symbols[currency]}{getPrice(c.price * c.qty)}</p></div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQty(c.id, -1)} className="bg-slate-100 dark:bg-slate-800 w-6 h-6 rounded font-bold">-</button>
                            <span className="w-4 text-center font-bold">{c.qty}</span>
                            <button onClick={() => updateQty(c.id, 1)} className="bg-slate-100 dark:bg-slate-800 w-6 h-6 rounded font-bold">+</button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-b-2xl border-t dark:border-slate-800 shrink-0">
                      <div className="flex justify-between text-xs font-bold mb-1"><span>{t.sub}</span><span>{symbols[currency]}{getPrice(subTotalUSD)}</span></div>
                      <div className="flex justify-between text-xs font-bold mb-1"><span>{t.tax}</span><span>{symbols[currency]}{getPrice(taxAmountUSD)}</span></div>
                      <div className="flex justify-between text-lg font-black mb-3 mt-2 pt-2 border-t text-indigo-600"><span>{t.total}</span><span>{symbols[currency]}{getPrice(grandTotalUSD)}</span></div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <button onClick={() => handlePay(t.cash)} disabled={!cart.length} className="bg-white dark:bg-slate-800 border py-2 rounded-xl text-xs font-bold">💵 {t.cash}</button>
                        <button onClick={() => handlePay(t.card)} disabled={!cart.length} className="bg-white dark:bg-slate-800 border py-2 rounded-xl text-xs font-bold">💳 {t.card}</button>
                        <button onClick={() => handlePay(t.wallet)} disabled={!cart.length} className="bg-white dark:bg-slate-800 border py-2 rounded-xl text-xs font-bold">📱 {t.wallet}</button>
                      </div>
                      {lastReceipt && <button onClick={() => window.print()} className="w-full bg-slate-800 text-white py-2 rounded-xl text-xs font-bold mt-2">🖨️ {t.print}</button>}
                    </div>
                  </div>
                </div>
              )
            )}

            {/* DASHBOARD / ORDERS VIEW WITH CASHIER NAME */}
            {["DASHBOARD", "ORDERS"].includes(activeTab) && currentUser.role === "Admin" && (
              <div className="max-w-6xl mx-auto space-y-6">
                <h2 className="text-xl md:text-2xl font-bold">{t.dash} / Orders History</h2>
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border dark:border-slate-700">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs md:text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-900">
                        <tr><th className="p-3">Order ID</th><th className="p-3">Table</th><th className="p-3">Cashier</th><th className="p-3">Method</th><th className="p-3 text-right">Total</th></tr>
                      </thead>
                      <tbody className="divide-y dark:divide-slate-700">
                        {orders.map((o: any) => (
                          <tr key={o.id}>
                            <td className="p-3 font-bold text-indigo-600">{o.id} <br/><span className="text-[9px] text-slate-400 font-normal">{o.time}</span></td>
                            <td className="p-3 font-bold text-emerald-600">{o.table}</td>
                            <td className="p-3 font-bold capitalize">{o.cashier || "Unknown"}</td>
                            <td className="p-3"><span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-[10px] font-bold">{o.method}</span></td>
                            <td className="p-3 font-black text-right">{symbols[currency]}{getPrice(o.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* INVENTORY & SETTINGS - Keep as previously built */}
            {activeTab === "INVENTORY" && currentUser.role === "Admin" && (
              <div className="max-w-4xl mx-auto"><h2 className="text-2xl font-bold mb-4">{t.inv} Active (Hide for code brevity)</h2></div>
            )}
            {activeTab === "SETTINGS" && currentUser.role === "Admin" && (
              <div className="max-w-4xl mx-auto"><h2 className="text-2xl font-bold mb-4">{t.set} Active (Hide for code brevity)</h2></div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
