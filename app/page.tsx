/* eslint-disable */
// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

// 🌟 FIREBASE INITIALIZATION (Your Config)
const firebaseConfig = {
  apiKey: "AIzaSyACkBSR9sDCWbUCJyjNzk_XdrjVNTSEFlQ",
  authDomain: "njangzaumun-globalpos.firebaseapp.com",
  projectId: "njangzaumun-globalpos",
  storageBucket: "njangzaumun-globalpos.firebasestorage.app",
  messagingSenderId: "531381101584",
  appId: "1:531381101584:web:507ed8d15ca64bbb859695",
  measurementId: "G-NSXT9C0MNQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🌟 DICTIONARY
const translations: any = {
  "English": { 
    pos: "Point of Sale", prod: "Products", shift: "Shift", rep: "Reports", set: "Settings",
    emailUser: "Email Address", egEmail: "e.g. admin@globalpos.com", pass: "Password", enterPass: "Enter password...", 
    confirmPass: "Confirm Password", confirmPassHolder: "Confirm your password...",
    loginBtn: "Sign In", registerBtn: "Create Cloud Account", noAccount: "Don't have an account?", regHere: "Register Here", hasAccount: "Already have an account?",
    shiftActive: "Shift Open", shiftClosed: "Shift Closed", allItems: "All Items", currentOrder: "Current Order",
    empty: "Cart is empty", subtotal: "Subtotal", tax: "Tax", total: "Total", pay: "Charge", payMeth: "Payment Method",
    cash: "Cash", ewallet: "E-Wallet", debit: "Debit Card", credit: "Credit Card", onlineDel: "Delivery",
    openShift: "Open Shift", closeShift: "Close Shift", openFloat: "Opening Cash", opening: "Opening", sales: "Sales", actualCash: "Actual Cash",
    shiftHist: "Shift History", date: "Date", expected: "Expected", actual: "Actual", diff: "Difference", noRep: "No reports available.",
    salesBreak: "Sales Breakdown", sysToggles: "System Toggles", enableSound: "Enable Sound", storeProf: "Store Profile",
    storeNameTxt: "Store Name", currText: "Currency Symbol", taxRateTxt: "Tax Rate (%)", addProd: "Add Product", addCat: "Add Category",
    name: "Name", price: "Price", cat: "Category", save: "Save", selectTab: "Select Table", backTab: "Back", addTable: "Add Table", egTab: "e.g. T-1",
    dineIn: "Dine In", takeAway: "Take Away"
  },
  "Burmese": { 
    pos: "အရောင်း", prod: "ကုန်ပစ္စည်း", shift: "ဆိုင်း", rep: "အစီရင်ခံစာ", set: "ဆက်တင်",
    emailUser: "အီးမေးလ်", egEmail: "ဥပမာ - admin@globalpos.com", pass: "စကားဝှက်", enterPass: "စကားဝှက် ရိုက်ထည့်ပါ...", 
    confirmPass: "စကားဝှက် အတည်ပြုပါ", confirmPassHolder: "စကားဝှက် ထပ်ရိုက်ပါ...",
    loginBtn: "အကောင့်ဝင်မည်", registerBtn: "Cloud အကောင့်သစ် ဖွင့်ရန်", noAccount: "အကောင့် မရှိသေးဘူးလား?", regHere: "ဒီမှာ အကောင့်ဖွင့်ပါ", hasAccount: "အကောင့် ရှိပြီးသားလား?",
    shiftActive: "ဆိုင်းဖွင့်ထားသည်", shiftClosed: "ဆိုင်းပိတ်ထားသည်", allItems: "အားလုံး", currentOrder: "လက်ရှိ အော်ဒါ",
    empty: "ဘာမှမရွေးရသေးပါ", subtotal: "ကျသင့်ငွေ", tax: "အခွန်", total: "စုစုပေါင်း", pay: "ငွေရှင်းမည်", payMeth: "ငွေချေမည့်စနစ်",
    cash: "ငွေသား", ewallet: "အီးဝေါလက်", debit: "ဒက်ဘစ်ကတ်", credit: "ခရက်ဒစ်ကတ်", onlineDel: "Delivery",
    openShift: "ဆိုင်းဖွင့်မည်", closeShift: "ဆိုင်းပိတ်မည်", openFloat: "အဖွင့် ငွေလက်ကျန်", opening: "အဖွင့်ငွေ", sales: "အရောင်း", actualCash: "လက်ရှိ ရေတွက်ရရှိငွေ",
    shiftHist: "ဆိုင်း မှတ်တမ်း", date: "ရက်စွဲ", expected: "မျှော်မှန်းငွေ", actual: "လက်တွေ့ငွေ", diff: "ကွာဟချက်", noRep: "မှတ်တမ်း မရှိသေးပါ။",
    salesBreak: "အရောင်း ခွဲခြမ်းစိတ်ဖြာမှု", sysToggles: "စနစ် အဖွင့်/အပိတ်", enableSound: "အသံ ဖွင့်မည်", storeProf: "ဆိုင် အချက်အလက်",
    storeNameTxt: "ဆိုင် အမည်", currText: "ငွေကြေး ယူနစ်", taxRateTxt: "အခွန်နှုန်း (%)", addProd: "ပစ္စည်းထည့်ရန်", addCat: "အမျိုးအစားထည့်ရန်",
    name: "အမည်", price: "စျေးနှုန်း", cat: "အမျိုးအစား", save: "သိမ်းမည်", selectTab: "စားပွဲ ရွေးချယ်ပါ", backTab: "နောက်သို့", addTable: "စားပွဲထည့်ရန်", egTab: "ဥပမာ - T-1",
    dineIn: "ဆိုင်စား", takeAway: "ပါဆယ်"
  }
};

const LANGUAGES = ["English", "Burmese"];
const PAYMENT_METHODS = ["Cash", "E-Wallet", "Debit Card", "Credit Card", "Online Delivery"];
const INITIAL_SALES_BY_METHOD = { "Cash": 0, "E-Wallet": 0, "Debit Card": 0, "Credit Card": 0, "Online Delivery": 0 };

export default function PremiumCloudPOS() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(""); 
  
  const [authMode, setAuthMode] = useState("login");
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authConfirm, setAuthConfirm] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [activeModule, setActiveMenu] = useState("pos");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("MMK"); 
  const [taxRate, setTaxRate] = useState(5);
  const [prefAudio, setPrefAudio] = useState(true);
  
  const t = translations[language] || translations["English"];
  const tr = (key: string) => t[key] || key;
  const payTrans: any = { "Cash": t.cash, "E-Wallet": t.ewallet, "Debit Card": t.debit, "Credit Card": t.credit, "Online Delivery": t.onlineDel };

  const [shift, setShift] = useState({ isOpen: false, openingCash: 0, sales: 0, payIn: 0, payOut: 0, start: "", salesByMethod: INITIAL_SALES_BY_METHOD });
  const [openInput, setOpenInput] = useState("");
  const [actualCash, setActualCash] = useState("");
  const [shiftHistory, setShiftHistory] = useState<any[]>([]);

  const [categories, setCategories] = useState(["Drinks", "Food", "Snacks", "Dessert"]);
  const [products, setProducts] = useState([
    { id: "1", name: "Espresso", price: 2500, category: "Drinks", emoji: "☕" },
    { id: "2", name: "Signature Burger", price: 5000, category: "Food", emoji: "🍔" }
  ]);
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdCat, setNewProdCat] = useState("Drinks");

  const [tables, setTables] = useState<string[]>([]);
  const [newTableName, setNewTableName] = useState("");
  const [activeTable, setActiveTable] = useState<string | null>(null);

  const [cart, setCart] = useState<any[]>([]);
  const [orderType, setOrderType] = useState("Dine In");
  const [paymentMethod, setPaymentMethod] = useState("Cash"); 
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    setIsMounted(true);
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setCurrentUser(user.email || "");
        loadCloudData();
      } else {
        setIsLoggedIn(false);
        setCurrentUser("");
      }
    });

    const defaultTables = Array.from({length: 12}, (_, i) => `Table ${i + 1}`);
    setTables(defaultTables);
    return () => unsubscribeAuth();
  }, []);

  const loadCloudData = () => {
    const q = query(collection(db, "shiftHistory"), orderBy("timestamp", "desc"));
    onSnapshot(q, (snapshot) => {
      setShiftHistory(snapshot.docs.map(doc => doc.data()));
    });
    onSnapshot(collection(db, "products"), (snapshot) => {
      if (!snapshot.empty) setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  };

  const playBeep = () => { if (!prefAudio) return; try { const ctx = new (window.AudioContext || (window as any).webkitAudioContext)(); const osc = ctx.createOscillator(); osc.type="square"; osc.frequency.setValueAtTime(500, ctx.currentTime); osc.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.05); } catch(e) {} };

  const handleAuth = async (e: any) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (authMode === "login") {
        await signInWithEmailAndPassword(auth, authUsername, authPassword);
        playBeep();
      } else {
        if (authPassword !== authConfirm) { alert("Passwords do not match!"); setAuthLoading(false); return; }
        await createUserWithEmailAndPassword(auth, authUsername, authPassword);
        alert("Account Created Successfully! You are now logged in to the Cloud.");
        playBeep();
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    }
    setAuthLoading(false);
  };

  const handleLogout = () => { if(confirm("Sign out of Cloud?")) { signOut(auth); setAuthUsername(""); setAuthPassword(""); } };
  const navigate = (mod: string) => { setActiveMenu(mod); setIsMobileMenuOpen(false); playBeep(); };

  const handleAddTable = (e: any) => { e.preventDefault(); if (newTableName.trim() && !tables.includes(newTableName.trim())) { setTables([...tables, newTableName.trim()]); setNewTableName(""); playBeep(); } };
  const handleSelectTable = (tName: string) => { if (!shift.isOpen) { alert("Please Open Shift first!"); navigate("shift"); return; } setActiveTable(tName); setOrderType(t.dineIn); playBeep(); };
  const handleBackToTables = () => { setActiveTable(null); setCart([]); playBeep(); };

  const addToCart = (p: any) => { playBeep(); const item = cart.find(i => i.id === p.id); if (item) setCart(cart.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i)); else setCart([...cart, { ...p, qty: 1 }]); };
  const updateQty = (id: string, delta: number) => { playBeep(); setCart(cart.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0)); };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const total = Math.max(0, subtotal + taxAmount);
  
  const handleCheckout = () => { 
    if (!shift.isOpen || cart.length === 0) return; 
    const newSalesByMethod: any = { ...shift.salesByMethod };
    newSalesByMethod[paymentMethod] = (newSalesByMethod[paymentMethod] || 0) + total;
    setShift({ ...shift, sales: shift.sales + total, salesByMethod: newSalesByMethod }); 
    setCart([]); setActiveTable(null); playBeep(); 
    alert(`Payment Successful!\nTotal: ${total} ${currency}`); 
  };

  const handleOpenShift = () => { setShift({ isOpen: true, openingCash: Number(openInput) || 0, sales: 0, payIn: 0, payOut: 0, start: new Date().toLocaleString(), salesByMethod: INITIAL_SALES_BY_METHOD }); setOpenInput(""); playBeep(); };
  
  const handleCloseShift = async () => { 
    const expected = shift.openingCash + shift.sales + shift.payIn - shift.payOut; 
    const diff = (Number(actualCash) || 0) - expected; 
    const shiftData = { date: new Date().toLocaleString(), timestamp: Date.now(), expected, actual: Number(actualCash), diff, salesByMethod: shift.salesByMethod, user: currentUser };
    try {
      await addDoc(collection(db, "shiftHistory"), shiftData);
      alert(`Shift Closed.\nExpected: ${expected}\nActual: ${actualCash}`); 
      setShift({ isOpen: false, openingCash: 0, sales: 0, payIn: 0, payOut: 0, start: "", salesByMethod: INITIAL_SALES_BY_METHOD }); 
      setActualCash(""); playBeep(); 
    } catch(e) { alert("Error saving to cloud!"); }
  };

  const handleAddProd = async (e:any) => { 
    e.preventDefault(); if (!newProdName || !newProdPrice) return; 
    try { await addDoc(collection(db, "products"), { name: newProdName, price: Number(newProdPrice), category: newProdCat, emoji: "📦" }); setNewProdName(""); setNewProdPrice(""); playBeep(); } catch(e) { alert("Error saving product!"); }
  };

  const filteredProducts = products.filter(p => (activeCategory === "All" || p.category === activeCategory));
  
  const menus = [ 
    { id: "pos", icon: "⊞", label: t.pos }, 
    { id: "products", icon: "📋", label: t.prod }, 
    { id: "shift", icon: "⏱", label: t.shift }, 
    { id: "reports", icon: "📊", label: t.rep }, 
    { id: "settings", icon: "⚙", label: t.set } 
  ];

  if (!isMounted) return null;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-200">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          
          <div className="text-center mb-10 relative z-10">
            <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-indigo-500/20">☁️</div>
            <h1 className="text-2xl font-bold text-white mb-1">Cloud POS</h1>
            <p className="text-slate-500 text-sm">Enterprise Cloud Management</p>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-5 relative z-10">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">{t.emailUser}</label>
              <input type="email" required value={authUsername} onChange={(e) => setAuthUsername(e.target.value)} placeholder={t.egEmail} className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-4 rounded-xl outline-none focus:border-indigo-500 transition-colors font-medium text-base" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">{t.pass}</label>
              <input type="password" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder={t.enterPass} className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-4 rounded-xl outline-none focus:border-indigo-500 transition-colors font-medium text-base" />
            </div>
            {authMode === "register" && (
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">{t.confirmPass}</label>
                <input type="password" required value={authConfirm} onChange={(e) => setAuthConfirm(e.target.value)} placeholder={t.confirmPassHolder} className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-4 rounded-xl outline-none focus:border-indigo-500 transition-colors font-medium text-base" />
              </div>
            )}
            
            <button type="submit" disabled={authLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 mt-2 uppercase tracking-wide">
              {authLoading ? "Loading..." : (authMode === "login" ? t.loginBtn : t.registerBtn)}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500 relative z-10">
            {authMode === "login" ? 
              <p>{t.noAccount} <span onClick={() => {setAuthMode("register"); setAuthPassword("");}} className="text-indigo-400 font-bold cursor-pointer hover:underline">{t.regHere}</span></p> 
            : 
              <p>{t.hasAccount} <span onClick={() => {setAuthMode("login"); setAuthPassword(""); setAuthConfirm("");}} className="text-indigo-400 font-bold cursor-pointer hover:underline">{t.loginBtn}</span></p>
            }
          </div>

          <div className="mt-8 flex justify-center relative z-10">
            <select value={language} onChange={(e)=>setLanguage(e.target.value)} className="bg-slate-950 text-slate-400 border border-slate-800 rounded-lg py-1.5 px-3 text-xs font-medium outline-none cursor-pointer">{LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}</select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-slate-950 font-sans text-slate-200 overflow-hidden">
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>}

      <div className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-40 transition-transform duration-300 ease-in-out`}>
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white tracking-wide">Global POS</h1>
          <div className="mt-3 text-xs font-medium text-slate-400 truncate bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> {currentUser}
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menus.map(m => (
            <button key={m.id} onClick={() => navigate(m.id)} className={`w-full flex items-center p-3 rounded-lg font-medium transition-all ${activeModule === m.id ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`}>
              <span className="text-lg w-8">{m.icon}</span> <span>{m.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center p-3 rounded-lg font-medium text-rose-400 hover:bg-rose-500/10 transition-all"><span className="text-lg w-8">🚪</span> <span>Sign Out</span></button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 md:px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-2xl text-slate-400 p-2" onClick={() => setIsMobileMenuOpen(true)}>☰</button>
            <h2 className="text-lg font-semibold text-slate-100 hidden sm:block">{menus.find(m => m.id === activeModule)?.label}</h2>
          </div>
          <div className="flex items-center gap-4">
             <div className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-2 ${shift.isOpen ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-slate-800 text-slate-400 border border-slate-700"}`}>
               <span className={`w-1.5 h-1.5 rounded-full ${shift.isOpen ? "bg-green-400 animate-pulse" : "bg-slate-500"}`}></span> {shift.isOpen ? t.shiftActive : t.shiftClosed}
             </div>
            <select value={language} onChange={(e)=>setLanguage(e.target.value)} className="bg-slate-800 text-slate-300 border border-slate-700 rounded-lg p-2 text-sm outline-none cursor-pointer">{LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}</select>
          </div>
        </header>

        <main className="flex-1 overflow-hidden flex flex-col bg-slate-950">
          {activeModule === "pos" && (
            <div className="flex flex-col h-full">
              {!activeTable ? (
                <div className="flex-1 flex flex-col overflow-hidden p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">{t.selectTab}</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                      {tables.map(table => (
                        <button key={table} onClick={() => handleSelectTable(table)} className="aspect-square bg-slate-900 border border-slate-800 hover:border-indigo-500 rounded-2xl flex items-center justify-center transition-all hover:shadow-lg hover:shadow-indigo-500/10 group">
                          <span className="font-semibold text-slate-300 group-hover:text-indigo-400 text-base md:text-lg">{table.replace("Table", "")}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                  <div className="flex-1 flex flex-col h-full overflow-hidden p-4 md:p-6">
                    <div className="flex justify-between items-center mb-6 shrink-0">
                      <button onClick={handleBackToTables} className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"><span>←</span> <span className="hidden sm:inline">{t.backTab}</span></button>
                      <div className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold px-6 py-2 rounded-lg">{activeTable.replace("Table", "Table ")}</div>
                    </div>
                    
                    <div className="shrink-0 mb-6">
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <button onClick={() => {setActiveCategory("All"); playBeep();}} className={`px-5 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all border ${activeCategory === "All" ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800"}`}>{t.allItems}</button>
                        {categories.map(cat => (
                          <button key={cat} onClick={() => {setActiveCategory(cat); playBeep();}} className={`px-5 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all border ${activeCategory === cat ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800"}`}>{tr(cat)}</button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto pb-20 lg:pb-0 pr-2">
                      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map(p => (
                          <button key={p.id} onClick={() => addToCart(p)} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-indigo-500 active:scale-95 transition-all flex flex-col items-center justify-center h-40">
                            <span className="text-4xl mb-3">{p.emoji}</span>
                            <span className="font-medium text-slate-300 mb-1 text-center line-clamp-1 text-sm">{tr(p.name)}</span>
                            <span className="text-indigo-400 font-semibold text-sm">{p.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-[380px] bg-slate-900 border-l border-slate-800 flex flex-col h-[55vh] lg:h-full z-20 absolute bottom-0 lg:relative rounded-t-3xl lg:rounded-none shadow-2xl lg:shadow-none">
                    <div className="p-5 border-b border-slate-800 shrink-0">
                      <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-4 lg:hidden"></div>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-base font-semibold text-white">{t.currentOrder}</h2>
                        <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-medium">{activeTable}</span>
                      </div>
                      <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                        <button onClick={() => {setOrderType(t.dineIn); playBeep();}} className={`flex-1 py-2 rounded-md font-medium text-sm transition-all ${orderType === t.dineIn ? "bg-slate-800 text-white shadow-sm" : "text-slate-500"}`}>{t.dineIn}</button>
                        <button onClick={() => {setOrderType(t.takeAway); playBeep();}} className={`flex-1 py-2 rounded-md font-medium text-sm transition-all ${orderType === t.takeAway ? "bg-slate-800 text-white shadow-sm" : "text-slate-500"}`}>{t.takeAway}</button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-3">
                      {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-600"><span className="text-4xl mb-2 opacity-50">🧾</span><p className="font-medium text-sm">{t.empty}</p></div>
                      ) : (
                        cart.map(item => (
                          <div key={item.id} className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                            <div className="flex-1 pr-2">
                              <h4 className="font-medium text-slate-200 text-sm line-clamp-1">{tr(item.name)}</h4>
                              <p className="text-xs font-semibold text-slate-500 mt-1">{item.price}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1 border border-slate-800">
                              <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 flex items-center justify-center font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded">-</button>
                              <span className="font-semibold w-6 text-center text-sm text-slate-200">{item.qty}</span>
                              <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 flex items-center justify-center font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded">+</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-5 bg-slate-900 border-t border-slate-800 shrink-0">
                      <div className="mb-4">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase mb-2 block">{t.payMeth}</label>
                        <div className="flex flex-wrap gap-2">
                          {PAYMENT_METHODS.map(pm => (
                            <button key={pm} onClick={() => {setPaymentMethod(pm); playBeep();}} className={`flex-1 min-w-[30%] py-2 px-1 rounded-lg text-xs font-medium transition-all border ${paymentMethod === pm ? "bg-indigo-600 border-indigo-600 text-white" : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"}`}>{payTrans[pm]}</button>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between text-slate-400 text-sm mb-2"><span>{t.subtotal}:</span><span>{subtotal}</span></div>
                      <div className="flex justify-between text-slate-400 text-sm mb-4"><span>{t.tax} ({taxRate}%):</span><span>{taxAmount}</span></div>
                      <div className="flex justify-between font-bold text-2xl mb-5 text-white pt-4 border-t border-slate-800"><span>{t.total}</span><span className="text-indigo-400">{total} <span className="text-sm font-medium text-slate-500">{currency}</span></span></div>
                      <button onClick={handleCheckout} disabled={cart.length === 0 || !shift.isOpen} className={`w-full font-semibold py-4 rounded-xl transition-all ${cart.length > 0 && shift.isOpen ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`}>{t.pay}</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeModule === "products" && (
            <div className="flex-1 p-6 md:p-10 overflow-y-auto">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-800 shadow-sm">
                  <h3 className="font-semibold text-white mb-6 text-lg">{t.addProd} <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded ml-2">Cloud Sync</span></h3>
                  <form onSubmit={handleAddProd} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-2"><input type="text" value={newProdName} onChange={(e) => setNewProdName(e.target.value)} placeholder={t.name} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 outline-none text-white focus:border-indigo-500" required /></div>
                    <div><input type="number" value={newProdPrice} onChange={(e) => setNewProdPrice(e.target.value)} placeholder={t.price} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 outline-none text-white focus:border-indigo-500" required /></div>
                    <div><select value={newProdCat} onChange={(e) => setNewProdCat(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 outline-none text-slate-300 focus:border-indigo-500">{categories.map(c => <option key={c} value={c}>{tr(c)}</option>)}</select></div>
                    <div className="sm:col-span-4 mt-2"><button type="submit" className="w-full sm:w-auto bg-indigo-600 text-white font-medium px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors">Add to Database</button></div>
                  </form>
                </div>
                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800"><tr><th className="p-4 font-medium">{t.name}</th><th className="p-4 font-medium">{t.cat}</th><th className="p-4 font-medium">{t.price}</th></tr></thead>
                    <tbody className="divide-y divide-slate-800">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="p-4 font-medium text-slate-200">{p.emoji} {tr(p.name)}</td>
                          <td className="p-4 text-slate-400">{tr(p.category)}</td><td className="p-4 text-indigo-400 font-medium">{p.price} {currency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activeModule === "shift" && (
            <div className="flex-1 p-6 md:p-10 overflow-y-auto flex items-center justify-center">
              <div className="w-full max-w-md bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-8 border-b border-slate-800 pb-4">{t.shift}</h3>
                {!shift.isOpen ? (
                  <div className="space-y-6">
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center">
                      <label className="text-xs font-semibold text-slate-500 uppercase block mb-4">{t.openFloat}</label>
                      <input type="number" value={openInput} onChange={(e) => setOpenInput(e.target.value)} placeholder="0" className="w-full bg-transparent text-4xl font-bold text-white outline-none text-center" />
                    </div>
                    <button onClick={handleOpenShift} className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-xl text-lg hover:bg-indigo-700 transition-colors">{t.openShift}</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800"><span className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">{t.opening}</span><span className="text-xl font-medium text-slate-300">{shift.openingCash}</span></div>
                      <div className="bg-indigo-500/10 p-5 rounded-2xl border border-indigo-500/20"><span className="block text-[10px] font-semibold text-indigo-400 uppercase mb-1">{t.sales}</span><span className="text-xl font-medium text-indigo-400">+{shift.sales}</span></div>
                    </div>
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center">
                      <label className="text-xs font-semibold text-slate-500 uppercase block mb-4">{t.actualCash}</label>
                      <input type="number" value={actualCash} onChange={(e) => setActualCash(e.target.value)} placeholder="0" className="w-full bg-transparent text-3xl font-bold text-white outline-none text-center border-b border-slate-800 pb-2 focus:border-indigo-500 transition-colors" />
                    </div>
                    <button onClick={handleCloseShift} className="w-full bg-rose-600 text-white font-semibold py-4 rounded-xl text-lg hover:bg-rose-700 transition-colors">Close & Sync to Cloud</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeModule === "reports" && (
             <div className="flex-1 p-6 md:p-10 overflow-y-auto">
              <div className="max-w-6xl mx-auto space-y-6">
                <h3 className="font-bold text-xl text-white mb-6">Cloud {t.shiftHist}</h3>
                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <tr><th className="p-4 font-medium">{t.date}</th><th className="p-4 font-medium">User</th><th className="p-4 font-medium">{t.expected}</th><th className="p-4 font-medium">{t.actual}</th><th className="p-4 font-medium">{t.diff}</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {shiftHistory.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-500">{t.noRep}</td></tr>}
                        {shiftHistory.map((s, i) => (
                          <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                            <td className="p-4 text-slate-300">{s.date}</td><td className="p-4 text-slate-400 text-xs">{s.user}</td><td className="p-4 text-slate-200 font-medium">{s.expected}</td>
                            <td className="p-4 text-indigo-400 font-medium">{s.actual}</td><td className={`p-4 font-bold ${s.diff < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{s.diff > 0 ? `+${s.diff}` : s.diff}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeModule === "settings" && (
            <div className="flex-1 p-6 md:p-10 overflow-y-auto">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-800 shadow-sm">
                  <h3 className="font-semibold text-white mb-6 text-lg">{t.sysToggles}</h3>
                  <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800"><span className="font-medium text-slate-300">{t.enableSound}</span><div onClick={() => setPrefAudio(!prefAudio)} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all ${prefAudio ? 'bg-indigo-600' : 'bg-slate-700'}`}><div className={`bg-white w-4 h-4 rounded-full transition-transform ${prefAudio ? 'translate-x-6' : 'translate-x-0'}`}></div></div></div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
