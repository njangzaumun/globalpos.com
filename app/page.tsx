"use client";
import { useState } from "react";

type Product = { id: number; name: string; priceUSD: number; category: string; icon: string };
type CartItem = Product & { qty: number };
type PaymentMethod = "Cash" | "Card" | "E-Wallet";

export default function NjangPOS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Settings State
  const [lang, setLang] = useState<"EN" | "MM" | "TH">("EN");
  const [currency, setCurrency] = useState<"USD" | "MMK" | "THB" | "SGD">("USD");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");

  // Exchange Rates (Base USD)
  const rates = { USD: 1, MMK: 4500, THB: 35, SGD: 1.35 };
  const symbols = { USD: "$", MMK: "Ks ", THB: "฿", SGD: "S$" };

  // Translations Dictionary
  const text = {
    EN: { pos: "NJANG POS", online: "Online", all: "All", food: "Food", drinks: "Drinks", dessert: "Dessert", order: "Current Order", items: "Items", empty: "No items in cart", subtotal: "Subtotal", total: "Total", pay: "PAY NOW", success: "Payment Successful!", method: "Payment", cash: "Cash", card: "Card", ewallet: "E-Wallet" },
    MM: { pos: "NJANG အရောင်းစနစ်", online: "အွန်လိုင်း", all: "အားလုံး", food: "အစားအစာ", drinks: "အချိုရည်", dessert: "အချိုပွဲ", order: "လက်ရှိဝယ်ယူမှု", items: "ခု", empty: "ခြင်းထဲတွင် ပစ္စည်းမရှိပါ", subtotal: "ကျသင့်ငွေ", total: "စုစုပေါင်း", pay: "ငွေရှင်းမည်", success: "ငွေရှင်းခြင်း အောင်မြင်ပါသည်!", method: "ငွေပေးချေမှု", cash: "ငွေသား", card: "ကတ်", ewallet: "E-Wallet" },
    TH: { pos: "NJANG ระบบขาย", online: "ออนไลน์", all: "ทั้งหมด", food: "อาหาร", drinks: "เครื่องดื่ม", dessert: "ของหวาน", order: "รายการปัจจุบัน", items: "ชิ้น", empty: "ไม่มีสินค้า", subtotal: "ยอดรวม", total: "ยอดสุทธิ", pay: "ชำระเงิน", success: "ชำระเงินสำเร็จ!", method: "การชำระเงิน", cash: "เงินสด", card: "บัตร", ewallet: "อีวอลเล็ต" }
  };

  const t = text[lang];

  // Products Data
  const products: Product[] = [
    { id: 1, name: "Chicken Burger", priceUSD: 3.5, category: "Food", icon: "🍔" },
    { id: 2, name: "Cheese Pizza", priceUSD: 8.0, category: "Food", icon: "🍕" },
    { id: 3, name: "French Fries", priceUSD: 2.0, category: "Food", icon: "🍟" },
    { id: 4, name: "Coca Cola", priceUSD: 1.0, category: "Drinks", icon: "🥤" },
    { id: 5, name: "Iced Coffee", priceUSD: 2.5, category: "Drinks", icon: "☕" },
    { id: 6, name: "Ice Cream", priceUSD: 2.0, category: "Dessert", icon: "🍦" },
  ];

  const categories = ["All", "Food", "Drinks", "Dessert"];

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter((p) => p.category === activeCategory);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Convert Price Helper
  const getPrice = (priceUSD: number) => {
    const converted = priceUSD * rates[currency];
    return currency === "MMK" ? Math.round(converted).toLocaleString() : converted.toFixed(2);
  };

  const totalUSD = cart.reduce((sum, item) => sum + item.priceUSD * item.qty, 0);

  const handleCheckout = () => {
    if (cart.length > 0) {
      alert(`✅ ${t.success}\n\n${t.total}: ${symbols[currency]}${getPrice(totalUSD)}\n${t.method}: ${paymentMethod}`);
      setCart([]);
    }
  };

  return (
    <div className="bg-slate-100 font-sans min-h-screen flex flex-col">
      {/* Header with Switchers */}
      <header className="bg-indigo-600 text-white p-4 shadow-md flex flex-wrap justify-between items-center sticky top-0 z-10 gap-2">
        <h1 className="text-xl md:text-2xl font-black tracking-wider">{t.pos}</h1>
        
        <div className="flex gap-2 items-center">
          {/* Language Switcher */}
          <select 
            className="bg-indigo-700 text-white border border-indigo-400 rounded px-2 py-1 text-sm outline-none cursor-pointer"
            value={lang} onChange={(e) => setLang(e.target.value as any)}
          >
            <option value="EN">🇺🇸 EN</option>
            <option value="MM">🇲🇲 MM</option>
            <option value="TH">🇹🇭 TH</option>
          </select>

          {/* Currency Switcher */}
          <select 
            className="bg-indigo-700 text-white border border-indigo-400 rounded px-2 py-1 text-sm outline-none cursor-pointer"
            value={currency} onChange={(e) => setCurrency(e.target.value as any)}
          >
            <option value="USD">🇺🇸 USD</option>
            <option value="MMK">🇲🇲 MMK</option>
            <option value="THB">🇹🇭 THB</option>
            <option value="SGD">🇸🇬 SGD</option>
          </select>
          
          <div className="hidden md:block text-sm bg-indigo-800 px-3 py-1 rounded-full border border-indigo-400 ml-2">
            🟢 {t.online}
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex flex-col lg:flex-row p-4 gap-6 flex-1 max-w-7xl mx-auto w-full">
        
        {/* Left Side: Products Menu */}
        <section className="w-full lg:w-2/3 flex flex-col gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => {
              const catName = cat === "All" ? t.all : cat === "Food" ? t.food : cat === "Drinks" ? t.drinks : t.dessert;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full font-bold whitespace-nowrap transition-all shadow-sm ${
                    activeCategory === cat ? "bg-indigo-600 text-white" : "bg-white text-gray-600 hover:bg-indigo-100"
                  }`}
                >
                  {catName}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md hover:border-indigo-500 border-2 border-transparent active:scale-95 transition-all"
              >
                <span className="text-5xl mb-3">{product.icon}</span>
                <span className="font-bold text-gray-800 text-sm text-center h-10 flex items-center">{product.name}</span>
                <span className="text-indigo-600 font-black mt-1">
                  {symbols[currency]}{getPrice(product.priceUSD)}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Right Side: Cart */}
        <section className="w-full lg:w-1/3 bg-white rounded-2xl shadow-lg flex flex-col h-[600px] lg:h-[calc(100vh-100px)] sticky top-20 border border-gray-200">
          <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
            <h2 className="text-xl font-black text-gray-800">{t.order}</h2>
            <span className="bg-indigo-100 text-indigo-700 text-sm py-1 px-3 rounded-full">{cart.length} {t.items}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-white">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <span className="text-6xl mb-4">🛒</span>
                <p className="font-medium">{t.empty}</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-500 font-semibold">
                          {symbols[currency]}{getPrice(item.priceUSD)} x {item.qty}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-gray-800">
                        {symbols[currency]}{getPrice(item.priceUSD * item.qty)}
                      </span>
                      <button onClick={() => removeFromCart(item.id)} className="bg-red-100 text-red-600 w-8 h-8 rounded-full font-bold hover:bg-red-200">✕</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Payment & Checkout Section */}
          <div className="p-4 bg-gray-50 border-t">
            
            {/* Payment Methods */}
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">{t.method}</p>
              <div className="flex gap-2">
                {[
                  { id: "Cash", label: t.cash, icon: "💵" },
                  { id: "Card", label: t.card, icon: "💳" },
                  { id: "E-Wallet", label: t.ewallet, icon: "📱" }
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === method.id
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300"
                    }`}
                  >
                    <span className="text-lg">{method.icon}</span>
                    {method.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between mb-2 font-bold text-gray-600">
              <span>{t.subtotal}</span>
              <span>{symbols[currency]}{getPrice(totalUSD)}</span>
            </div>
            <div className="flex justify-between mb-4 text-2xl font-black text-gray-900">
              <span>{t.total}</span>
              <span className="text-indigo-600">{symbols[currency]}{getPrice(totalUSD)}</span>
            </div>
            <button
              onClick={handleCheckout} disabled={cart.length === 0}
              className={`w-full py-4 rounded-xl font-black text-lg shadow-md ${cart.length > 0 ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-gray-300 text-gray-500"}`}
            >
              {t.pay}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
