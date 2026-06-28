"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const [bannerIndex, setBannerIndex] = useState(0);

  const banners = [
    { src: "/images/banners/banner1.jpg", title: "Future of Smart Shopping", sub: "AI-powered retail ecosystem" },
    { src: "/images/banners/banner2.jpg", title: "Instant AI Checkout", sub: "Skip the queues with Smart Cart" },
    { src: "/images/banners/banner3.jpg", title: "Smart Pickup System", sub: "Order online, collect in seconds" },
  ];

  const categories = [
    { name: "Vegetables", icon: "🥦", color: "bg-green-50" },
    { name: "Fruits", icon: "🍎", color: "bg-red-50" },
    { name: "Dairy", icon: "🥛", color: "bg-blue-50" },
    { name: "Snacks", icon: "🍔", color: "bg-orange-50" },
    { name: "Drinks", icon: "🧃", color: "bg-purple-50" },
    { name: "Electronics", icon: "📱", color: "bg-slate-100" },
    { name: "Essentials", icon: "🧼", color: "bg-teal-50" },
  ];

  const products = [
    { name: "Fresh Apples", price: "120", img: "/images/products/apples.jpg", tag: "Organic" },
    { name: "Milk Pack", price: "60", img: "/images/products/milk.jpg", tag: "Fresh" },
    { name: "Potato Chips", price: "40", img: "/images/products/chips.jpg", tag: "Crispy" },
    { name: "Smart Watch", price: "2499", img: "/images/products/watch.jpg", tag: "Tech" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-green-100 overflow-x-hidden">
      
      {/* 1. TOP OFFER BAR */}
      <div className="bg-green-600 text-white py-2 px-4 text-center text-[11px] md:text-sm font-bold uppercase tracking-widest">
        🔥 Mega Festival Offers | 🤖 AI Smart Shopping Live | 📦 Free In-Store Pickup
      </div>

      {/* 2. NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-4 gap-4">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-black text-green-600 tracking-tighter leading-none">GMR SMART MART</h1>
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.3em]">AI Retail Engine</p>
            </div>

            <div className="flex-1 max-w-xl hidden md:block">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Search products, aisles, or brands..." 
                  className="w-full bg-slate-100 border-none rounded-2xl py-3 px-12 text-sm focus:ring-2 focus:ring-green-500 transition-all outline-none"
                />
                <span className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-green-600 transition-colors">🔍</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-600 font-bold text-sm">
              <button className="p-2 hover:bg-slate-100 rounded-full transition relative">
                🛒 <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">0</span>
              </button>
              <button className="hidden sm:block hover:text-green-600 transition uppercase tracking-widest text-xs">Login</button>
              <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:bg-green-600 transition-all shadow-lg text-xs font-black uppercase tracking-widest">Sign Up</button>
            </div>
          </div>

          {/* ADDED SUB-NAVIGATION HEADER */}
          <nav className="flex items-center justify-start gap-8 py-3 border-t border-slate-50 overflow-x-auto no-scrollbar">
            {["Home", "Categories", "Products", "Offers", "Pickup", "Dashboard", "Contact"].map((item, idx) => (
              <button 
                key={item} 
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${idx === 0 ? 'text-green-600 border-b-2 border-green-600 pb-1' : 'text-slate-400 hover:text-green-600'}`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* 3. HERO SHOPPING BANNER */}
      <section className="relative h-[350px] md:h-[550px] w-full overflow-hidden bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div 
            key={bannerIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
            <img 
              src={banners[bannerIndex].src} 
              alt={banners[bannerIndex].title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center text-white p-8 md:p-20 max-w-3xl">
              <motion.h2 
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-4xl md:text-7xl font-black mb-4 tracking-tighter"
              >
                {banners[bannerIndex].title}
              </motion.h2>
              <motion.p 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-2xl font-bold mb-8 text-green-400 drop-shadow-md"
              >
                {banners[bannerIndex].sub}
              </motion.p>
              <div className="flex gap-4">
                <button className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-green-500 hover:scale-105 transition-all shadow-xl">Shop Now</button>
                <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/20 transition-all">Explore Tech</button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 4. DASHBOARD STATS SECTION (Integrated from Reference Image) */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-30 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Live Customers", val: "128", sub: "In Store", icon: "👥" },
          { label: "Active Carts", val: "42", sub: "In Progress", icon: "🛒" },
          { label: "Open Time", val: "8:00 AM", sub: "We're Open", icon: "🕒" },
          { label: "Closing Time", val: "10:00 PM", sub: "See You Soon", icon: "🌙" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-50 flex items-center gap-4 group hover:scale-105 transition-transform">
            <div className="text-2xl bg-slate-50 w-12 h-12 flex items-center justify-center rounded-2xl">{stat.icon}</div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-lg font-black text-slate-800">{stat.val}</h4>
              <p className="text-[8px] text-green-600 font-black uppercase">{stat.sub}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 5. SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Smart Categories</h2>
          <div className="h-1.5 w-20 bg-green-500 mx-auto mt-4 rounded-full" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6">
          {categories.map((cat, i) => (
            <motion.div 
              whileHover={{ y: -10 }}
              key={i} 
              className="group cursor-pointer"
            >
              <div className={`${cat.color} rounded-[2rem] p-8 text-center border border-transparent group-hover:border-green-300 group-hover:bg-white group-hover:shadow-2xl transition-all duration-500`}>
                <span className="text-5xl block mb-4 transform group-hover:scale-125 transition-transform">{cat.icon}</span>
                <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{cat.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. TRENDING PRODUCTS */}
      <section className="bg-slate-50 py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Live Inventory</h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Real-time Stock Updates</p>
            </div>
            <button className="bg-white text-green-600 px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest border border-slate-200 hover:bg-green-600 hover:text-white transition-all">View All</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((p, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                key={i} 
                className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative"
              >
                <div className="absolute top-6 left-6 z-10 bg-slate-900 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                  {p.tag}
                </div>
                <div className="h-56 rounded-3xl overflow-hidden mb-6 bg-slate-50 flex items-center justify-center p-8">
                  <img src={p.img} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="font-black text-slate-800 text-xl mb-1">{p.name}</h3>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-green-600 font-black text-2xl">₹{p.price}</p>
                  <button className="bg-slate-100 text-slate-900 p-3 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm font-black text-xs uppercase">
                    Add +
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SPECIAL OFFERS & FEATURES */}
      <section className="max-w-7xl mx-auto px-4 py-24 grid lg:grid-cols-2 gap-10">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-orange-500 to-rose-600 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl group"
        >
          <div className="relative z-10">
            <h3 className="text-4xl font-black mb-4 tracking-tighter uppercase">Weekend Deals</h3>
            <p className="mb-10 text-xl opacity-90 font-medium max-w-sm leading-relaxed">Extra 20% off on your first automated checkout this Saturday.</p>
            <button className="bg-white text-orange-600 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl group-hover:px-12 transition-all">Grab Voucher</button>
          </div>
          <span className="absolute -right-10 -bottom-10 text-[15rem] opacity-10 transform -rotate-12 group-hover:rotate-0 transition-transform duration-700">💸</span>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl group"
        >
          <div className="relative z-10">
            <h3 className="text-4xl font-black mb-4 tracking-tighter uppercase">Smart Pickup</h3>
            <p className="mb-10 text-xl opacity-90 font-medium max-w-sm leading-relaxed">Your order is bagged and ready in our smart lockers within 10 mins.</p>
            <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl group-hover:px-12 transition-all">Setup Pickup</button>
          </div>
          <span className="absolute -right-10 -bottom-10 text-[15rem] opacity-10 transform rotate-12 group-hover:rotate-0 transition-transform duration-700">📦</span>
        </motion.div>
      </section>

      {/* 8. SMART MART FEATURES */}
      <section className="bg-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
            {[
              { icon: "🛒", label: "Smart Cart", sub: "Auto-scan items" },
              { icon: "🤖", label: "AI Recs", sub: "Personalized deals" },
              { icon: "📊", label: "Analytics", sub: "Live Store Rush" },
              { icon: "⚡", label: "Fast Pay", sub: "Card-free flow" },
              { icon: "📦", label: "Locker", sub: "Secure pickup" },
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-4xl mb-6 shadow-2xl border border-white/10 hover:bg-green-600 transition-colors cursor-pointer group">
                  <span className="group-hover:scale-125 transition-transform">{f.icon}</span>
                </div>
                <h4 className="font-black text-white text-sm mb-1 uppercase tracking-widest">{f.label}</h4>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{f.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-3xl font-black text-green-600 tracking-tighter mb-6">GMR SMART MART</h2>
              <p className="max-w-md text-slate-500 font-medium leading-relaxed">
                Revolutionizing the Indian retail landscape with AI-integrated hardware and seamless software solutions. Skip the checkout lines and experience the future of commerce today.
              </p>
              <div className="flex gap-4 mt-8">
                {["fb", "tw", "in"].map(s => <div key={s} className="w-10 h-10 bg-slate-100 rounded-xl hover:bg-green-600 hover:text-white transition-all cursor-pointer" />)}
              </div>
            </div>
            <div>
              <h4 className="text-slate-900 font-black mb-8 uppercase text-[11px] tracking-[0.3em]">Quick Navigation</h4>
              <div className="flex flex-col gap-4 text-sm font-bold text-slate-500">
                {["Smart Dashboard", "Aisle Map", "Pickup Hubs", "API Status", "Support"].map(item => (
                  <button key={item} className="text-left hover:text-green-600 transition-colors uppercase tracking-widest text-[10px]">{item}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-slate-900 font-black mb-8 uppercase text-[11px] tracking-[0.3em]">Global Hub</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Innovation Labs,<br />Smart Retail District,<br />India.
              </p>
              <p className="text-green-600 font-black mt-4">support@gmr-smart.in</p>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">© 2026 GMR Smart Mart. Built for the Future.</p>
            <div className="flex gap-8">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Hardware v4.2</span>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Software v1.0.8</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}