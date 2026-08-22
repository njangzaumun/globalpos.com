/* eslint-disable */
// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, signOut, onAuthStateChanged } from "firebase/auth";
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
    pos: "Point of Sale", prod: "Products & Menu", shift: "Shift Management", rep: "Reports", set: "Settings",
    phoneInput: "Phone Number", egPhone: "e.g. +95912345678", sendCode: "Send SMS Code",
    enterOtp: "Enter 6-digit OTP", verifyOtp: "Verify & Sign In",
    shiftActive: "Shift Active", shiftClosed: "Shift Closed", allItems: "All Items", currentOrder: "Current Order",
    empty: "Cart is empty", subtotal: "Subtotal", tax: "Tax", total: "Total", pay: "Pay Now", payMeth: "Payment Method",
    cash: "Cash", ewallet: "E-Wallet", debit: "Debit Card", credit: "Credit Card", onlineDel: "Online Delivery",
    openShift: "Open Shift", closeShift: "Close Shift", openFloat: "Opening Float", opening: "Opening", sales: "Sales", actualCash: "Actual Cash Counted",
    shiftHist: "Shift History", date: "Date", expected: "Expected", actual: "Actual", diff: "Difference", noRep: "No reports available.",
    salesBreak: "Sales Breakdown", sysToggles: "System Toggles", enableSound: "Enable Sound (Beep)", storeProf: "Store Profile",
    storeNameTxt: "Store Name", currText: "Currency Symbol", taxRateTxt: "Tax Rate (%)", addProd: "Add Product", addCat: "Add Category",
    name: "Name", price: "Price", cat: "Category", save: "Save", selectTab: "Select Table", backTab: "Back to Tables", addTable: "Add Table", egTab: "e.g. VIP-3",
    dineIn: "Dine In", takeAway: "Take Away"
  },
  "Burmese": { 
    pos: "အရောင်းစနစ်", prod: "ကုန်ပစ္စည်းများ", shift: "ဆိုင်းဖွင့်/ပိတ်", rep: "အစီရင်ခံစာ", set: "ဆက်တင်များ",
    phoneInput: "ဖုန်းနံပါတ်", egPhone: "ဥပမာ - +95912345678", sendCode: "SMS Code တောင်းမည်",
    enterOtp: "ဂဏန်း (၆) လုံး ထည့်ပါ", verifyOtp: "အတည်ပြုပြီး ဝင်မည်",
    shiftActive: "ဆိုင်းဖွင့်ထားသည်", shiftClosed: "ဆိုင်းပိတ်ထားသည်", allItems: "ပစ္စည်းအားလုံး", currentOrder: "လက်ရှိ အော်ဒါ",
    empty: "ဘာမှမရွေးရသေးပါ", subtotal: "ကျသင့်ငွေ", tax: "အခွန်", total: "စုစုပေါင်း", pay: "ငွေရှင်းမည်", payMeth: "ငွေချေမည့်စနစ်",
    cash: "ငွေသား", ewallet: "အီးဝေါလက်", debit: "ဒက်ဘစ်ကတ်", credit: "ခရက်ဒစ်ကတ်", onlineDel: "အွန်လိုင်း Delivery",
    openShift: "ဆိုင်းဖွင့်မည်", closeShift: "ဆိုင်းပိတ်မည်", openFloat: "အဖွင့် ငွေလက်ကျန်", opening: "အဖွင့်ငွေ", sales: "အရောင်း", actualCash: "လက်ရှိ ရေတွက်ရရှိငွေ",
    shiftHist: "ဆိုင်း မှတ်တမ်း", date: "ရက်စွဲ", expected: "မျှော်မှန်းငွေ", actual: "လက်တွေ့ငွေ", diff: "ကွာဟချက်", noRep: "မှတ်တမ်း မရှိသေးပါ။",
    salesBreak: "အရောင်း ခွဲခြမ်းစိတ်ဖြာမှု", sysToggles: "စနစ် အဖွင့်/အပိတ်", enableSound: "အသံ ဖွင့်မည် (Beep)", storeProf: "ဆိုင် အချက်အလက်",
    storeNameTxt: "ဆိုင် အမည်", currText: "ငွေကြေး ယူနစ်", taxRateTxt: "အခွန်နှုန်း (%)", addProd: "ပစ္စည်းထည့်ရန်", addCat: "အမျိုးအစားထည့်ရန်",
    name: "အမည်", price: "စျေးနှုန်း", cat: "အမျိုးအစား", save: "သိမ်းမည်", selectTab: "စားပွဲ ရွေးချယ်ပါ", backTab: "စားပွဲများဆီသို့", addTable: "စားပွဲထည့်ရန်", egTab: "ဥပမာ - VIP-3",
    dineIn: "ဆိုင်စား", takeAway: "ပါဆယ်"
  }
};

const LANGUAGES = ["English", "Burmese"];
const PAYMENT_METHODS = ["Cash", "E-Wallet", "Debit Card", "Credit Card", "Online Delivery"];
const INITIAL_SALES_BY_METHOD = { "Cash": 0, "E-Wallet": 0, "Debit Card": 0, "Credit Card": 0, "Online Delivery": 0 };

export default function CloudPOSApp() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(""); 
  
  // 🌟 SMS AUTH STATES
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [authStep, setAuthStep] = useState("phone"); // 'phone' | 'otp'
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
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
        setCurrentUser(user.phoneNumber || "");
        loadCloudData();
      } else {
        setIsLoggedIn(false);
        setCurrentUser("");
      }
    });

    const defaultTables = Array.from({length: 15}, (_, i) => `Table ${i + 1}`);
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
  
  // 🌟 RECAPTCHA SETUP
  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible'
      });
    }
  };

  // 🌟 SEND SMS OTP
  const handleSendOtp = async (e: any) => {
    e.preventDefault();
    setAuthLoading(true);
    setupRecaptcha();
    const appVerifier = (window as any).recaptchaVerifier;
    
    try {
      // Must include country code, e.g., +95...
      const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+95${phoneNumber.replace(/^0+/, '')}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setAuthStep("otp");
      playBeep();
    } catch (error: any) {
      alert("Error sending SMS: " + error.message);
      if((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.render().then((widgetId: any) => {
          (window as any).grecaptcha.reset(widgetId);
        });
      }
    }
    setAuthLoading(false);
  };

  // 🌟 VERIFY OTP
  const handleVerifyOtp = async (e: any) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      await confirmationResult.confirm(otpCode);
      playBeep();
      // Next.js will automatically detect auth state change and log user in
    } catch (error: any) {
      alert("Invalid Code! Please try again.");
    }
    setAuthLoading(false);
  };

  const handleLogout = () => { 
    if(confirm("Are you sure you want to sign out?")) { 
      signOut(auth);
      setAuthStep("phone");
      setPhoneNumber("");
      setOtpCode("");
    } 
  };
  
  const navigate = (mod: string) => { setActiveMenu(mod); setIsMobileMenuOpen(false); playBeep(); };

  const handleAddTable = (e: any) => { e.preventDefault(); if (newTableName.trim() && !tables.includes(newTableName.trim())) { setTables([...tables, newTableName.trim()]); setNewTableName(""); playBeep(); } };
  const handleSelectTable = (tName: string) => { if (!shift.isOpen) { alert("⚠️ Please Open Shift first in Settings!"); navigate("shift"); return; } setActiveTable(tName); setOrderType(t.dineIn); playBeep(); };
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
    alert(`✅ Payment Successful!\nTotal: ${total} ${currency}`); 
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
    try { await addDoc(collection(db, "products"), { name: newProdName, price: Number(newProdPrice), category: newProdCat, emoji: "📦" }); setNewProdName(""); setNewProdPrice(""); playBeep(); } catch(e) { alert("Error saving product to cloud!"); }
  };

  const filteredProducts = products.filter(p => (activeCategory === "All" || p.category === activeCategory));
  const menus = [ { id: "pos", icon: "❖", label: t.pos }, { id: "products", icon: "📦", label: t.prod }, { id: "shift", icon: "🕒", label: t.shift }, { id: "reports", icon: "📈", label: t.rep }, { id: "settings", icon: "⛭", label: t.set } ];

  if (!isMounted) return null;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 font-sans text-white">
        <div className="w-full max-w-md bg-[#18181b] border border-[#27272a] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#ea580c] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="text-center mb-8 relative z-10">
            <div className="w-16 h-16 bg-[#ea580c]/10 text-[#ea580c] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-[#ea580c]/30">☁️</div>
            <h1 className="text-3xl font-black tracking-widest text-white mb-1">Cloud POS</h1>
            <p className="text-[#ea580c] text-[10px] font-black tracking-widest mb-4">SECURE LOGIN</p>
          </div>
          
          <div id="recaptcha-container"></div>

          {authStep === "phone" ? (
            <form onSubmit={handleSendOtp} className="space-y-4 relative z-10">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">{t.phoneInput}</label>
                <input type="tel" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder={t.egPhone} className="w-full bg-[#09090b] border border-[#27272a] text-white px-4 py-3.5 rounded-xl outline-none focus:border-[#ea580c] transition-colors font-medium text-center text-lg tracking-widest" />
                <p className="text-[10px] text-gray-500 mt-2 text-center">Include country code (e.g., +95)</p>
              </div>
              <button type="submit" disabled={authLoading} className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold py-4 rounded-xl mt-4 transition-all shadow-[0_0_20px_rgba(234,88,12,0.2)] tracking-wider uppercase">
                {authLoading ? "Sending..." : t.sendCode}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 relative z-10">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">{t.enterOtp}</label>
                <input type="text" required value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder="• • • • • •" maxLength={6} className="w-full bg-[#09090b] border border-[#27272a] text-white px-4 py-3.5 rounded-xl outline-none focus:border-[#ea580c] transition-colors font-bold text-center text-2xl tracking-[0.5em]" />
              </div>
              <button type="submit" disabled={authLoading} className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-4 rounded-xl mt-4 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] tracking-wider uppercase">
                {authLoading ? "Verifying..." : t.verifyOtp}
              </button>
              <button type="button" onClick={() => setAuthStep("phone")} className="w-full text-gray-500 text-sm hover:text-white transition-colors mt-2">Back to Phone Number</button>
            </form>
          )}

          <div className="mt-6 flex justify-center gap-2 relative z-10">
            <select value={language} onChange={(e)=>setLanguage(e.target.value)} className="bg-[#18181b] text-gray-400 border border-[#27272a] rounded-lg p-1 text-xs font-bold outline-none cursor-pointer">{LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}</select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#09090b] font-sans text-gray-200 overflow-hidden">
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/80 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}

      <div className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 w-72 bg-[#18181b] border-[#27272a] flex flex-col shadow-2xl z-40 transition-transform duration-300 ease-in-out border-r`}>
        <div className="p-6 border-b border-[#27272a] flex justify-between items-center">
          <div className="w-full">
            <h1 className="text-2xl font-black text-white tracking-widest flex items-center gap-2">Cloud POS <span className="text-[#ea580c] text-sm">☁️</span></h1>
            <div className="mt-2 text-[11px] font-bold text-[#ea580c] truncate w-full p-2 bg-[#ea580c]/10 rounded-lg border border-[#ea580c]/30" title={currentUser}>📱 {currentUser}</div>
            <div className={`mt-3 text-[10px] font-bold px-2 py-1 rounded-full border uppercase tracking-widest inline-flex items-center gap-2 ${shift.isOpen ? "text-[#ea580c] bg-[#ea580c]/10 border-[#ea580c]/30" : "text-gray-500 bg-[#27272a] border-[#3f3f46]"}`}><span className={`w-1.5 h-1.5 rounded-full ${shift.isOpen ? "bg-[#ea580c] animate-pulse" : "bg-gray-500"}`}></span> {shift.isOpen ? t.shiftActive : t.shiftClosed}</div>
          </div>
          <button className="md:hidden text-2xl text-gray-400" onClick={() => setIsMobileMenuOpen(false)}>×</button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-2 custom-scrollbar">
          {menus.map(m => (
            <button key={m.id} onClick={() => navigate(m.id)} className={`w-full flex items-center p-3.5 rounded-xl font-bold transition-all ${activeModule === m.id ? "bg-[#ea580c]/10 text-[#ea580c] border border-[#ea580c]/30" : "text-gray-400 hover:bg-[#27272a] hover:text-white border border-transparent"}`}><span className="text-xl mr-4">{m.icon}</span> <span>{m.label}</span></button>
          ))}
        </nav>
        <div className="p-4 border-t border-[#27272a]">
          <button onClick={handleLogout} className="w-full flex items-center p-3 rounded-xl font-bold text-red-500 hover:bg-red-500/10 transition-all border border-transparent"><span className="text-xl mr-4">🚪</span> <span>Sign Out</span></button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        <header className="h-16 bg-[#18181b] border-b border-[#27272a] flex items-center justify-between px-4 md:px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-2xl text-gray-400 p-2" onClick={() => setIsMobileMenuOpen(true)}>☰</button>
            <h2 className="text-xl font-black text-white hidden sm:block uppercase tracking-wider">{menus.find(m => m.id === activeModule)?.label}</h2>
          </div>
        </header>

        <main className="flex-1 overflow-hidden bg-[#09090b] flex flex-col">
          {activeModule === "pos" && (
            <div className="flex flex-col h-full">
              {!activeTable ? (
                <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-8">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 shrink-0">
                    <h3 className="text-2xl font-black text-white">{t.selectTab}</h3>
                  </div>

                  <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
                      {tables.map(table => (
                        <button key={table} onClick={() => handleSelectTable(table)} className="aspect-square bg-[#18181b] border border-[#27272a] hover:border-[#ea580c] hover:bg-[#27272a] rounded-2xl flex flex-col items-center justify-center gap-2 transition-all hover:-translate-y-1 shadow-sm group">
                          <span className="font-black text-white text-base md:text-xl text-center px-2 break-words line-clamp-2">{table.replace("Table", "Table")}</span>
                          <span className="w-8 h-1 rounded-full bg-[#ea580c]/50 group-hover:bg-[#ea580c] transition-colors"></span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                  <div className="flex-1 flex flex-col h-full overflow-hidden p-4 md:p-6">
                    <div className="flex justify-between items-center mb-6 shrink-0">
                      <button onClick={handleBackToTables} className="bg-[#18181b] border border-[#27272a] hover:bg-[#27272a] text-gray-300 font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"><span>←</span> <span className="hidden sm:inline">{t.backTab}</span></button>
                      <div className="bg-[#ea580c]/10 border border-[#ea580c]/30 text-[#ea580c] font-black px-6 py-2.5 rounded-xl uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(234,88,12,0.1)]">{activeTable.replace("Table", "Table")}</div>
                    </div>
                    <div className="shrink-0 mb-6">
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        <button onClick={() => {setActiveCategory("All"); playBeep();}} className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all border ${activeCategory === "All" ? "bg-[#ea580c] text-white border-[#ea580c]" : "bg-[#18181b] text-gray-400 border-[#27272a]"}`}>{t.allItems}</button>
                        {categories.map(cat => (
                          <button key={cat} onClick={() => {setActiveCategory(cat); playBeep();}} className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all border ${activeCategory === cat ? "bg-[#ea580c] text-white border-[#ea580c]" : "bg-[#18181b] text-gray-400 border-[#27272a]"}`}>{tr(cat)}</button>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto pb-20 lg:pb-0">
                      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map(p => (
                          <button key={p.id} onClick={() => addToCart(p)} className="bg-[#18181b] p-4 rounded-3xl border border-[#27272a] hover:border-[#ea580c] active:scale-95 transition-all flex flex-col items-center justify-center h-40 shadow-sm">
                            <span className="text-5xl mb-3 relative z-10">{p.emoji}</span>
                            <span className="font-bold text-gray-200 mb-1 text-center line-clamp-1 relative z-10 text-sm">{tr(p.name)}</span>
                            <span className="text-[#ea580c] font-black relative z-10 text-sm">{p.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-[400px] bg-[#18181b] border-l border-[#27272a] flex flex-col h-[50vh] lg:h-full z-20 absolute bottom-0 lg:relative rounded-t-3xl lg:rounded-none">
                    <div className="p-4 md:p-6 border-b border-[#27272a] shrink-0">
                      <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-black text-white uppercase">{t.currentOrder}</h2><span className="text-xs bg-[#27272a] text-gray-400 px-3 py-1 rounded-full font-bold">{activeTable}</span></div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                      {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-600"><span className="text-5xl mb-3 opacity-30">🛒</span><p className="font-bold">{t.empty}</p></div>
                      ) : (
                        cart.map(item => (
                          <div key={item.id} className="flex justify-between items-center mb-3 bg-[#09090b] p-4 rounded-xl border border-[#27272a]">
                            <div className="flex-1 pr-2"><h4 className="font-bold text-white text-sm line-clamp-1">{tr(item.name)}</h4><p className="text-xs font-bold text-[#ea580c] mt-1">{item.price}</p></div>
                            <div className="flex items-center gap-2 bg-[#18181b] rounded-lg p-1.5 border border-[#27272a]">
                              <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 font-bold text-gray-400">-</button>
                              <span className="font-bold w-5 text-center text-sm text-white">{item.qty}</span>
                              <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 font-bold text-gray-400">+</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-4 md:p-6 bg-[#09090b] border-t border-[#27272a] shrink-0">
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {PAYMENT_METHODS.map(pm => (
                            <button key={pm} onClick={() => {setPaymentMethod(pm); playBeep();}} className={`flex-1 min-w-[30%] py-2 px-1 rounded-lg text-xs font-bold transition-all border ${paymentMethod === pm ? "bg-[#ea580c] border-[#ea580c] text-white" : "bg-[#18181b] border-[#27272a] text-gray-400"}`}>{payTrans[pm]}</button>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between font-black text-3xl mb-4 text-white pt-3 border-t border-[#27272a]"><span>{t.total}</span><span className="text-[#ea580c]">{total} <span className="text-sm font-medium text-gray-500">{currency}</span></span></div>
                      <button onClick={handleCheckout} disabled={cart.length === 0 || !shift.isOpen} className={`w-full font-bold py-4 rounded-xl transition-all uppercase tracking-widest ${cart.length > 0 && shift.isOpen ? "bg-[#ea580c] text-white" : "bg-[#27272a] text-gray-600"}`}>{t.pay}</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeModule === "products" && (
            <div className="flex-1 p-6 md:p-8 overflow-y-auto">
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="bg-[#18181b] rounded-2xl p-6 border border-[#27272a]">
                  <h3 className="font-bold text-[#ea580c] mb-4">{t.addProd} (Cloud Sync)</h3>
                  <form onSubmit={handleAddProd} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-2"><input type="text" value={newProdName} onChange={(e) => setNewProdName(e.target.value)} placeholder={t.name} className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-4 py-3 outline-none text-white focus:border-[#ea580c]" required /></div>
                    <div><input type="number" value={newProdPrice} onChange={(e) => setNewProdPrice(e.target.value)} placeholder={t.price} className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-4 py-3 outline-none text-white focus:border-[#ea580c]" required /></div>
                    <div><select value={newProdCat} onChange={(e) => setNewProdCat(e.target.value)} className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-4 py-3 outline-none text-white focus:border-[#ea580c]">{categories.map(c => <option key={c} value={c}>{tr(c)}</option>)}</select></div>
                    <div className="sm:col-span-4"><button type="submit" className="w-full bg-[#ea580c] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#c2410c] mt-2">Save to Cloud</button></div>
                  </form>
                </div>
                <div className="bg-[#18181b] rounded-2xl border border-[#27272a] overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#09090b] text-gray-500 border-b border-[#27272a]"><tr><th className="p-4">{t.name}</th><th className="p-4">{t.cat}</th><th className="p-4">{t.price}</th></tr></thead>
                    <tbody className="divide-y divide-[#27272a]">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-[#27272a]/50">
                          <td className="p-4 font-bold text-white">{p.emoji} {tr(p.name)}</td>
                          <td className="p-4 text-gray-400">{tr(p.category)}</td><td className="p-4 text-[#ea580c] font-bold">{p.price} {currency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activeModule === "shift" && (
            <div className="flex-1 p-6 md:p-8 overflow-y-auto">
              <div className="max-w-xl mx-auto bg-[#18181b] rounded-3xl p-8 border border-[#27272a] shadow-2xl">
                <h3 className="text-2xl font-black text-white mb-8 border-b border-[#27272a] pb-4">{t.shift}</h3>
                {!shift.isOpen ? (
                  <div className="space-y-6">
                    <div className="bg-[#09090b] p-6 rounded-2xl border border-[#27272a]">
                      <label className="text-xs font-bold text-gray-500 uppercase block mb-3">{t.openFloat}</label>
                      <input type="number" value={openInput} onChange={(e) => setOpenInput(e.target.value)} placeholder="0" className="w-full bg-transparent text-4xl font-black text-white outline-none" />
                    </div>
                    <button onClick={handleOpenShift} className="w-full bg-[#ea580c] text-white font-bold py-4 rounded-xl text-lg uppercase tracking-wider">{t.openShift}</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#09090b] p-4 rounded-xl border border-[#27272a]"><span className="block text-xs font-bold text-gray-500 uppercase">{t.opening}</span><span className="text-xl font-bold text-gray-300">{shift.openingCash}</span></div>
                      <div className="bg-[#ea580c]/10 p-4 rounded-xl border border-[#ea580c]/30"><span className="block text-xs font-bold text-[#ea580c] uppercase">{t.sales}</span><span className="text-xl font-bold text-[#ea580c]">+{shift.sales}</span></div>
                    </div>
                    <div className="border border-[#27272a] p-6 rounded-xl bg-[#09090b]">
                      <label className="text-xs font-bold text-gray-500 uppercase block mb-3">{t.actualCash}</label>
                      <input type="number" value={actualCash} onChange={(e) => setActualCash(e.target.value)} placeholder="0" className="w-full bg-transparent text-2xl font-bold text-white outline-none border-b border-[#27272a] pb-2" />
                    </div>
                    <button onClick={handleCloseShift} className="w-full bg-[#ef4444] text-white font-bold py-4 rounded-xl text-lg uppercase tracking-wider">Close & Sync to Cloud</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeModule === "reports" && (
             <div className="flex-1 p-6 md:p-8 overflow-y-auto">
              <div className="max-w-6xl mx-auto space-y-6">
                <h3 className="font-black text-2xl text-white mb-6">Cloud {t.shiftHist}</h3>
                <div className="bg-[#18181b] rounded-2xl border border-[#27272a] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-[#09090b] text-gray-500 border-b border-[#27272a]">
                        <tr><th className="p-4">{t.date}</th><th className="p-4">User</th><th className="p-4">{t.expected}</th><th className="p-4">{t.actual}</th><th className="p-4">{t.diff}</th></tr>
                      </thead>
                      <tbody className="divide-y divide-[#27272a]">
                        {shiftHistory.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-600">{t.noRep}</td></tr>}
                        {shiftHistory.map((s, i) => (
                          <tr key={i} className="hover:bg-[#27272a]/50">
                            <td className="p-4 text-gray-300">{s.date}</td><td className="p-4 text-gray-400">{s.user}</td><td className="p-4 text-[#ea580c] font-bold">{s.expected}</td>
                            <td className="p-4 text-white">{s.actual}</td><td className={`p-4 font-black ${s.diff < 0 ? 'text-red-500' : 'text-green-500'}`}>{s.diff}</td>
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
            <div className="flex-1 p-6 md:p-8 overflow-y-auto">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-[#18181b] rounded-2xl p-6 border border-[#27272a]">
                  <h3 className="font-bold text-[#ea580c] mb-6">{t.sysToggles}</h3>
                  <div className="flex items-center justify-between p-3 border-b border-[#27272a]"><span className="font-bold text-gray-300">{t.enableSound}</span><div onClick={() => setPrefAudio(!prefAudio)} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all ${prefAudio ? 'bg-[#ea580c]' : 'bg-[#27272a]'}`}><div className={`bg-white w-4 h-4 rounded-full transition-transform ${prefAudio ? 'translate-x-6' : 'translate-x-0'}`}></div></div></div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
