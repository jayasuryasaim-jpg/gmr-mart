"use client";

import { useState, useMemo, useEffect } from "react";

// ==========================================
// 1. DATA ARCHITECTURE & TYPE DEFINITIONS
// ==========================================

interface VariantOption {
  label: string;
  sku: string;
  priceModifier: number;
  stockCount: number;
  reservedCount: number;
}

interface ReviewItem {
  id: string;
  user: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  floor: string;
  aisle: string;
  rack: string;
  shelf: string;
  basePrice: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  offerType: "none" | "50_percent" | "buy1_get2" | "festival_deal";
  crowdIndicator: "Low" | "Medium" | "Heavy";
  crowdPercentage: number; 
  nutrition: { protein: string; calories: number; score: number };
  combo: { partnerName: string; partnerPrice: number; discountAmt: number };
  colors: string[];
  variants: VariantOption[];
  reviews: ReviewItem[];
  vectorSeedColor: string;
  // Enhanced technical specifications fields
  specs: {
    rfidFrequency: string;
    weightSensorAccuracy: string;
    packagingMaterial: string;
    dimensions: string;
    storageTemp: string;
  };
}

// ==========================================
// 2. DYNAMIC GENERATED DATA ENGINE
// ==========================================

const RAW_BRANDS = ["Organic Harvest", "Natura Pure", "Elite Select", "Chef's Choice", "Glow Essence", "SmartFit Eco"];
const SIMPLIFIED_PRODUCTS_POOL: Record<string, string[]> = {
  Snacks: ["Crunchy Potato Chips", "Roasted Almonds Mix", "Chocolate Chip Cookies", "Spiced Banana Wafers", "Baked Pita Thins"],
  Beverages: ["Fresh Orange Juice", "Cold Brew Coffee", "Sparkling Apple Cider", "Organic Green Tea", "Almond Milk Shake"],
  Bakery: ["Artisan Sourdough Bread", "Butter Croissants", "Whole Wheat Buns", "Blueberry Muffins", "Gluten-Free Bagels"],
  Dairy: ["Fresh Whole Milk", "Greek Strawberry Yogurt", "Premium Cheddar Cheese", "Salted Creamery Butter", "Organic Cottage Cheese"],
  Vegetables: ["Fresh Vine Tomatoes", "Organic Spinach Bunches", "Crisp Iceberg Lettuce", "Sweet Baby Carrots", "Red Bell Peppers"],
  Fruits: ["Organic Strawberries", "Sweet Honeycrisp Apples", "Fresh Seedless Grapes", "Ripe Cavendish Bananas", "Sun-Ripened Mangoes"],
  "Frozen Foods": ["Veggie Spring Rolls", "Premium Chicken Nuggets", "Thin Crust Cheese Pizza", "Frozen Mixed Berries", "Hashbrown Patties"],
  Groceries: ["Basmati Premium Rice", "Extra Virgin Olive Oil", "Organic Whole Wheat Flour", "Himalayan Pink Salt", "Pure Raw Honey"],
  Electronics: ["Smart AA Batteries", "Type-C Fast Charging Cable", "Mini Bluetooth Tag", "LED Smart Desk Bulb", "Wireless Earbud Case"],
  "Home Essentials": ["Eco Bamboo Paper Towels", "Lavender Liquid Detergent", "Biodegradable Trash Bags", "Microfiber Cleaning Cloths", "Organic Dish Soap"],
  Beauty: ["Hydrating Aloe Vera Gel", "Natural Shea Butter Cream", "Organic Coconut Hair Oil", "Gentle Face Wash", "Herbal Mint Toothpaste"],
  Fashion: ["Classic White Cotton Tee", "Breathable Sports Socks", "Eco-Friendly Canvas Tote", "Comfort Lounge Shorts", "Adjustable Running Cap"]
};

const RAW_CATEGORIES = [
  { floor: "Ground Floor", cats: ["Snacks", "Beverages", "Bakery", "Dairy"] },
  { floor: "First Floor", cats: ["Vegetables", "Fruits", "Frozen Foods", "Groceries"] },
  { floor: "Second Floor", cats: ["Electronics", "Home Essentials", "Beauty", "Fashion"] },
];

const CUSTOMER_NAMES = ["Aravind Swamy", "Meera Deshmukh", "Rohan Malhotra", "Ananya Iyer", "Vikram Rathore", "Siddharth Roy", "Pooja Sharma", "Karan Johar", "Divya Teja", "Sai Kiran"];
const REVIEW_TITLES = ["Absolutely love this!", "Fresh and convenient", "Superb packaging", "Scans instantly on the scale", "Fast checkout integration", "Great value pack", "Perfect for smart carts"];
const REVIEW_COMMENTS = [
  "The item synced up instantly inside my smart trolley dashboard. Highly recommend this brand.",
  "Freshness is incredible. Easily located it on the shelf using the layout map application.",
  "Extremely high quality. Kids love the clean taste and the packaging is easy to open.",
  "The smart scale identified the weight instantly. Zero friction at the cart terminal.",
  "A real lifesaver during busy weekend rush hours. Clean, clear pricing tags.",
  "Slightly smaller size than expected, but the quality more than makes up for it.",
  "Scanned correctly on the first attempt from 2 meters away. Seamless experience."
];

const generateMasterProductDataset = (): Product[] => {
  const dataset: Product[] = [];
  let itemCounter = 1;

  RAW_CATEGORIES.forEach((floorObj) => {
    floorObj.cats.forEach((cat) => {
      const namesList = SIMPLIFIED_PRODUCTS_POOL[cat] || ["Premium Generic Product Item"];
      
      for (let i = 1; i <= 25; i++) {
        const id = `gmr-${cat.toLowerCase().replace(/\s+/g, "-")}-${i}`;
        const brand = RAW_BRANDS[itemCounter % RAW_BRANDS.length];
        const baseItemName = namesList[(i - 1) % namesList.length];
        const name = `${brand} ${baseItemName} (Batch #${100 + i})`;
        
        const basePrice = 45 + (i * 28) % 450;
        let offerType: "none" | "50_percent" | "buy1_get2" | "festival_deal" = "none";
        let originalPrice = Math.round(basePrice * 1.2);
        
        if (itemCounter % 7 === 1) {
          offerType = "50_percent";
          originalPrice = basePrice * 2;
        } else if (itemCounter % 7 === 3) {
          offerType = "buy1_get2";
          originalPrice = basePrice;
        } else if (itemCounter % 7 === 5) {
          offerType = "festival_deal";
          originalPrice = Math.round(basePrice * 1.45);
        }

        const dynamicReviews: ReviewItem[] = [];
        for (let r = 1; r <= 8; r++) {
          dynamicReviews.push({
            id: `r${r}-${id}`,
            user: CUSTOMER_NAMES[(i + r) % CUSTOMER_NAMES.length],
            rating: 4 + ((i + r) % 2),
            date: `2026-05-${String(10 + (r * 2)).padStart(2, "0")}`,
            title: REVIEW_TITLES[(i + r) % REVIEW_TITLES.length],
            comment: REVIEW_COMMENTS[(i + r) % REVIEW_COMMENTS.length],
            verified: true,
            helpfulCount: 3 + (i % 15) + r
          });
        }

        const crowdIndicator = i % 3 === 0 ? "Low" : i % 3 === 1 ? "Medium" : "Heavy";
        const crowdPercentage = crowdIndicator === "Low" ? 22 : crowdIndicator === "Medium" ? 54 : 88;

        dataset.push({
          id,
          name,
          brand,
          category: cat,
          floor: floorObj.floor,
          aisle: `Aisle ${String.fromCharCode(65 + (i % 4))}${i % 3 + 1}`,
          rack: `Rack R${(i % 5) + 1}`,
          shelf: `Shelf ${(i % 3) + 1}`,
          basePrice,
          originalPrice,
          rating: parseFloat((4.1 + (i % 9) * 0.1).toFixed(1)),
          reviewCount: dynamicReviews.length * 12 + (i * 2),
          description: `High-quality, freshly stocked everyday staple carefully sorted for the GMR automated ecosystem. Fully compatible with our digital scales, passive RFID scanners, and app-based checkout solutions. Packed in clean, lightweight barrier materials.`,
          features: [
            "🏆 Certified Premium Grade Quality",
            "🌱 100% Sustainably and Locally Sourced",
            "🔒 Freshness-Locked Smart Packaging Shield",
            "⚡ RFID Micro-Transponder Sync Ready"
          ],
          offerType,
          crowdIndicator,
          crowdPercentage,
          nutrition: {
            protein: `${3 + (i % 8)}g`,
            calories: 90 + (i * 12) % 220,
            score: parseFloat((8.0 + (i % 5) * 0.4).toFixed(1))
          },
          combo: {
            partnerName: i % 2 === 0 ? "GMR Refresh Chilled Soda" : "Baked Whole Wheat Thins",
            partnerPrice: 35,
            discountAmt: 15
          },
          colors: i % 2 === 0 ? ["#2563EB", "#16A34A", "#EA580C"] : ["#DC2626", "#4F46E5", "#7C3AED"],
          variants: [
            { label: "Standard Retail Pack", sku: `SKU-${id}-ST`, priceModifier: 0, stockCount: 14 + (i % 12), reservedCount: 1 + (i % 3) },
            { label: "Family Value Size", sku: `SKU-${id}-XL`, priceModifier: Math.round(basePrice * 0.6), stockCount: 5 + (i % 5), reservedCount: i % 2 }
          ],
          reviews: dynamicReviews,
          vectorSeedColor: i % 3 === 0 ? "text-emerald-500" : i % 3 === 1 ? "text-indigo-500" : "text-amber-500",
          specs: {
            rfidFrequency: "13.56 MHz (HF / MIFARE Classic)",
            weightSensorAccuracy: "±0.5g Ultra-Precision Load Calibration",
            packagingMaterial: "Recyclable Biodegradable PET Shield",
            dimensions: `${12 + (i % 8)}cm x ${8 + (i % 4)}cm x ${18 + (i % 10)}cm`,
            storageTemp: cat === "Frozen Foods" || cat === "Dairy" ? "4°C - Chilled Node" : "22°C - Ambient Rack Space"
          }
        });

        itemCounter++;
      }
    });
  });

  return dataset;
};

const MASTER_PRODUCTS = generateMasterProductDataset();

// ==========================================
// 3. MAIN APPLICATION INTERFACE INTERACTOR
// ==========================================

export default function CombinedProductsPage() {
  const [activeView, setActiveView] = useState<"catalog" | "details">("catalog");
  const [selectedProductId, setSelectedProductId] = useState<string>("gmr-snacks-1");
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFloor, setActiveFloor] = useState("Ground Floor");
  const [activeCategory, setActiveCategory] = useState("Snacks");
  const [activeOfferFilter, setActiveOfferFilter] = useState<"all" | "50_percent" | "buy1_get2" | "festival_deal">("all");

  const [activeVariantIdx, setActiveVariantIdx] = useState(0);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const [showPickupModal, setShowPickupModal] = useState(false);
  const [pickupStep, setPickupStep] = useState<"setup" | "confirmed">("setup");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("10:00 AM - 10:30 AM");
  const [selectedLockerType, setSelectedLockerType] = useState("Smart Locker");
  const [liveOrderStatus, setLiveOrderStatus] = useState("Order Confirmed");
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [generatedLockerNo, setGeneratedLockerNo] = useState("");

  const [countdown, setCountdown] = useState({ hrs: 1, mins: 42, secs: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hrs > 0) return { hrs: prev.hrs - 1, mins: 59, secs: 59 };
        return { hrs: 0, mins: 0, secs: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentProduct = useMemo(() => {
    return MASTER_PRODUCTS.find((p) => p.id === selectedProductId) || MASTER_PRODUCTS[0];
  }, [selectedProductId]);

  const relatedProducts = useMemo(() => {
    return MASTER_PRODUCTS.filter(
      (p) => p.category === currentProduct.category && p.id !== currentProduct.id
    ).slice(0, 4);
  }, [currentProduct]);

  const renderedGridProducts = useMemo(() => {
    return MASTER_PRODUCTS.filter((p) => {
      if (activeOfferFilter !== "all") {
        return p.offerType === activeOfferFilter;
      }
      if (searchQuery) {
        return p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return p.floor === activeFloor && p.category === activeCategory;
    });
  }, [activeFloor, activeCategory, searchQuery, activeOfferFilter]);

  const handleProductSelection = (targetId: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedProductId(targetId);
      setActiveVariantIdx(0);
      setMainImageIndex(0);
      setCartCount(0);
      setActiveView("details");
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 250);
  };

  const openPickupSystem = () => {
    if (cartCount === 0) setCartCount(1);
    
    const randomOTP = Math.floor(1000 + Math.random() * 9000).toString();
    const randomLocker = `L-${Math.floor(10 + Math.random() * 80)}`;
    setGeneratedOTP(randomOTP);
    setGeneratedLockerNo(randomLocker);
    setPickupStep("setup");
    setLiveOrderStatus("Order Confirmed");
    setShowPickupModal(true);
  };

  const confirmPickupReservation = () => {
    setPickupStep("confirmed");
    currentProduct.variants[activeVariantIdx].stockCount -= cartCount || 1;
    currentProduct.variants[activeVariantIdx].reservedCount += cartCount || 1;

    setTimeout(() => setLiveOrderStatus("Preparing Order"), 3000);
    setTimeout(() => setLiveOrderStatus("Packed"), 6000);
    setTimeout(() => setLiveOrderStatus("Ready for Pickup"), 9000);
  };

  const drawProductIcon = (seedColor: string) => {
    return (
      <svg className={`w-full h-full ${seedColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4" />
        <circle cx="12" cy="11" r="2" className="opacity-30" fill="currentColor" />
      </svg>
    );
  };

  const reviewBreakdown = useMemo(() => {
    let fiveStar = 0;
    currentProduct.reviews.forEach(r => { if (r.rating === 5) fiveStar++; });
    const percentFive = Math.round((fiveStar / currentProduct.reviews.length) * 100);
    return { percentFive, percentFour: 100 - percentFive };
  }, [currentProduct]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-amber-500 selection:text-white transition-opacity duration-300">
      
      {/* GLOBAL HUB HUD BANNER */}
      <div className="bg-slate-900 text-white text-center py-2.5 px-4 text-xs font-semibold tracking-wider sticky top-0 z-50 flex items-center justify-center gap-3 border-b border-amber-500/30">
        <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-widest animate-pulse">
          Live Store Flash
        </span>
        <span className="text-slate-300 font-medium">Smart Flash-Deals are currently locked in. Session expiration index:</span>
        <span className="font-mono text-amber-400 font-black tracking-widest bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
          {String(countdown.hrs).padStart(2, "0")}:{String(countdown.mins).padStart(2, "0")}:{String(countdown.secs).padStart(2, "0")}
        </span>
      </div>

      {/* CORE BRAND NAVIGATION SYSTEM HEADBAND */}
      <header className="bg-white border-b border-slate-200/80 sticky top-[37px] z-40 px-6 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveOfferFilter("all"); setActiveView("catalog"); }}>
            <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-white font-black text-xl tracking-tighter border border-slate-800">
              G
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-950 tracking-tighter uppercase leading-none">GMR SMART MART</h1>
              <p className="text-[10px] tracking-widest text-slate-400 font-bold uppercase mt-1">Autonomous Omnichannel Infrastructure</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full md:w-auto justify-center">
            <button
              onClick={() => { setActiveOfferFilter("all"); setActiveView("catalog"); setSearchQuery(""); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeOfferFilter === "all" && activeView === "catalog" ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              All Departments
            </button>
            <button
              onClick={() => { setActiveOfferFilter("50_percent"); setActiveView("catalog"); }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${activeOfferFilter === "50_percent" ? "bg-red-500 text-white shadow-sm" : "text-red-600 hover:bg-red-50"}`}
            >
              💥 50% Off Center
            </button>
            <button
              onClick={() => { setActiveOfferFilter("buy1_get2"); setActiveView("catalog"); }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${activeOfferFilter === "buy1_get2" ? "bg-indigo-600 text-white shadow-sm" : "text-indigo-600 hover:bg-indigo-50"}`}
            >
              🎁 Buy 1 Get 2 Packs
            </button>
            <button
              onClick={() => { setActiveOfferFilter("festival_deal"); setActiveView("catalog"); }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${activeOfferFilter === "festival_deal" ? "bg-amber-500 text-slate-950 shadow-sm" : "text-amber-600 hover:bg-amber-50"}`}
            >
              ☀️ Special Deals
            </button>
          </div>
        </div>
      </header>

      {/* RENDER MODALITY GRID HOOKS WRAPPER CONTAINER */}
      <div className={`transition-all duration-300 transform ${isTransitioning ? "opacity-40 scale-98" : "opacity-100 scale-100"}`}>
        
        {/* ==========================================
            VIEW MODALITY PANEL A: CATALOGUE BOARD
            ========================================== */}
        {activeView === "catalog" && (
          <main className="max-w-7xl mx-auto px-4 py-10">
            
            {/* SEARCH STRIPS SECTION */}
            {activeOfferFilter === "all" && (
              <>
                <div className="mb-8 relative max-w-xl mx-auto">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search standard grocery products (e.g. Milk, Strawberries)..."
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 pl-12 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all shadow-xs"
                  />
                  <span className="absolute left-4 top-4.5 text-slate-400">🔍</span>
                </div>

                {!searchQuery && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {RAW_CATEGORIES.map((floorObj) => {
                      const isSelected = activeFloor === floorObj.floor;
                      return (
                        <button
                          key={floorObj.floor}
                          onClick={() => { 
                            setActiveFloor(floorObj.floor); 
                            setActiveCategory(floorObj.cats[0]); 
                          }}
                          className={`p-5 rounded-2xl border text-left transition-all ${isSelected ? "bg-slate-950 text-white border-slate-950 shadow-md" : "bg-white border-slate-200 hover:border-slate-300"}`}
                        >
                          <h4 className="font-black text-sm uppercase tracking-wide">🏢 {floorObj.floor}</h4>
                          <div className="flex gap-1.5 mt-2 flex-wrap">
                            {floorObj.cats.map((c) => (
                              <span key={c} className={`text-[10px] px-2 py-0.5 rounded font-medium ${isSelected ? "bg-white/10 text-slate-200" : "bg-slate-100 text-slate-500"}`}>{c}</span>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {!searchQuery && (
                  <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200">
                    {RAW_CATEGORIES.find((f) => f.floor === activeFloor)?.cats.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${activeCategory === cat ? "bg-amber-500 text-slate-950 shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
                      >
                        🍒 {cat} Shelf
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* SECTION LAYOUT DIRECTIVE READOUTS */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-slate-950 uppercase tracking-tight">
                  {activeOfferFilter !== "all" ? `🔥 EXCLUSIVE PROMOTIONAL DISCOUNTS` : `${activeCategory} Inventory Rack`}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                  {activeOfferFilter !== "all" ? "Live active promotional clearance pools." : `Sourced across automated distribution sectors inside ${activeFloor}.`}
                </p>
              </div>
              <span className="text-xs font-bold bg-slate-200 text-slate-700 px-3 py-1 rounded-full">{renderedGridProducts.length} Options Found</span>
            </div>

            {/* INVENTORY CARD MATRIX */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {renderedGridProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleProductSelection(p.id)}
                  className="group bg-white rounded-3xl border border-slate-200/80 p-5 cursor-pointer hover:shadow-xl hover:border-slate-900 transition-all duration-300 flex flex-col justify-between relative"
                >
                  {p.offerType !== "none" && (
                    <span className="absolute top-4 left-4 z-10 bg-red-600 text-white font-black text-[9px] px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm">
                      {p.offerType === "50_percent" ? "50% OFF" : p.offerType === "buy1_get2" ? "BUY 1 GET 2" : "FESTIVAL BONUS"}
                    </span>
                  )}
                  
                  <div>
                    <div className="w-full h-40 bg-slate-50 rounded-2xl mb-4 p-6 flex items-center justify-center relative group-hover:bg-slate-100/70 transition-colors">
                      {drawProductIcon(p.vectorSeedColor)}
                      <span className="absolute bottom-3 right-3 bg-white/90 border border-slate-200 rounded-md px-1.5 py-0.5 text-[9px] font-black text-slate-700">
                        ★ {p.rating}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">{p.brand}</span>
                    <h3 className="font-black text-slate-900 text-sm mt-0.5 group-hover:text-amber-600 transition-colors line-clamp-2 min-h-[40px]">
                      {p.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed font-medium">{p.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-base font-black text-slate-950">₹{p.basePrice}</span>
                      {p.originalPrice > p.basePrice && (
                        <span className="text-xs font-bold text-slate-400 line-through ml-2">₹{p.originalPrice}</span>
                      )}
                    </div>
                    <span className="text-[10px] font-black uppercase bg-slate-950 text-white px-3 py-2 rounded-xl group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors shadow-xs">
                      Inspect 🛒
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* ==========================================
            VIEW MODALITY PANEL B: DETAILED CONTEXT OVERVIEW
            ========================================== */}
        {activeView === "details" && (
          <main className="max-w-7xl mx-auto px-4 py-8 relative">
            
            {/* TOP NAVIGATION BACK BUTTON */}
            <button
              onClick={() => setActiveView("catalog")}
              className="mb-8 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-slate-950 transition-colors"
            >
              ← Return to Main Store Shelf Matrix
            </button>

            {/* SYSTEM GRID COMPONENT SPLITS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start border-b border-slate-200 pb-16">
              
              {/* IMAGE HOVER OVERLAY BOXES */}
              <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-28">
                <div className="w-full h-[440px] bg-white border-2 border-slate-900 rounded-[2.5rem] p-12 flex items-center justify-center relative shadow-lg overflow-hidden group">
                  <div className="w-56 h-56 transition-transform duration-500 transform group-hover:scale-110">
                    {drawProductIcon(currentProduct.vectorSeedColor)}
                  </div>
                  <div className="absolute top-6 left-6 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-slate-800 shadow-md">
                    🛰️ Real-Time Node Feed #{currentProduct.id.slice(-2)}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {[0, 1, 2, 3].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => setMainImageIndex(idx)}
                      className={`h-20 bg-white border rounded-2xl p-4 flex items-center justify-center transition-all ${mainImageIndex === idx ? "border-slate-950 ring-2 ring-slate-950/20 scale-95 shadow-inner" : "border-slate-200 opacity-60 hover:opacity-100"}`}
                    >
                      <div className="w-8 h-8 opacity-60">{drawProductIcon(currentProduct.vectorSeedColor)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* SPECIFICATION PARAMETERS AND CHECKOUT TERMINALS */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                      🏢 {currentProduct.floor}
                    </span>
                    <span className="bg-amber-100 text-amber-900 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-amber-200">
                      🍒 {currentProduct.category} Department
                    </span>
                  </div>
                  
                  <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tight mt-3 leading-none">
                    {currentProduct.name}
                  </h1>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Monitored distribution metrics logged by <span className="text-slate-700 font-bold">{currentProduct.brand} Labs</span>.</p>
                </div>

                {/* COMPREHENSIVE SCORE INTERFACES */}
                <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center bg-amber-400 text-slate-950 w-16 h-16 rounded-2xl font-black text-xl tracking-tighter">
                      {currentProduct.rating}
                      <span className="text-[9px] text-slate-900 font-bold -mt-0.5">SCORE</span>
                    </div>
                    <div>
                      <h4 className="font-black text-xs uppercase tracking-wider text-slate-900">User Satisfaction Index</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Compiled from <strong className="text-slate-800">{currentProduct.reviewCount} live checkout scans</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 border-t pt-3 border-slate-100 text-[11px] font-bold text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="w-12 shrink-0">5 Stars</span>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full transition-all" style={{ width: `${reviewBreakdown.percentFive}%` }} />
                      </div>
                      <span className="w-8 text-right text-slate-400">{reviewBreakdown.percentFive}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-12 shrink-0">4 Stars</span>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-slate-400 h-full transition-all" style={{ width: `${reviewBreakdown.percentFour}%` }} />
                      </div>
                      <span className="w-8 text-right text-slate-400">{reviewBreakdown.percentFour}%</span>
                    </div>
                  </div>
                </div>

                {/* DYNAMIC VALUE ASSIGNMENT HUD BOX */}
                <div className="bg-slate-950 text-white p-6 rounded-[2rem] shadow-md">
                  <span className="text-slate-400 uppercase tracking-widest text-[9px] font-black block">Price Matrix Configuration</span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-4xl font-black text-white tracking-tight">
                      ₹{currentProduct.basePrice + currentProduct.variants[activeVariantIdx].priceModifier}
                    </span>
                    {currentProduct.originalPrice > currentProduct.basePrice && (
                      <span className="text-base text-slate-500 font-bold line-through">
                        ₹{currentProduct.originalPrice + currentProduct.variants[activeVariantIdx].priceModifier}
                      </span>
                    )}
                  </div>
                </div>

                {/* REAL-TIME ALLOCATION CAPACITY LOGS */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2.5">
                      1. Select Stock Sizing Variant
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentProduct.variants.map((v, idx) => {
                        const isSelected = activeVariantIdx === idx;
                        return (
                          <button
                            key={v.sku}
                            onClick={() => setActiveVariantIdx(idx)}
                            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                              isSelected
                                ? "border-slate-950 bg-slate-950 text-white shadow-md"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                            }`}
                          >
                            <span className="text-xs font-black uppercase tracking-wide">{v.label}</span>
                            <div className="flex items-center justify-between mt-3 w-full">
                              <span className="text-[10px] font-bold text-slate-400">
                                SKU: {v.sku.slice(-9)}
                              </span>
                              <span className={`text-xs font-black ${isSelected ? "text-amber-400" : "text-slate-900"}`}>
                                {v.priceModifier === 0 ? "Base Rate" : `+₹${v.priceModifier}`}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex flex-wrap gap-4 items-center justify-between text-xs font-bold text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>
                        Live Safe Stock Inventory:{" "}
                        <strong className="text-slate-900">
                          {currentProduct.variants[activeVariantIdx].stockCount} Units Available
                        </strong>
                      </span>
                    </div>
                    <div className="bg-slate-100 px-3 py-1.5 rounded-xl text-slate-500 text-[11px]">
                      Locked/Reserved Hub Slots:{" "}
                      <strong className="text-slate-700">
                        {currentProduct.variants[activeVariantIdx].reservedCount} Units
                      </strong>
                    </div>
                  </div>
                </div>

                {/* HARDWARE MICRO-LOCATOR MAP DIRECTIVES */}
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-5">
                  <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    📍 Smart Cart Floor Locator Grid Pinpoint
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-center">
                    <div className="bg-white border border-amber-500/20 rounded-2xl p-2.5">
                      <span className="text-[10px] block text-slate-400 uppercase font-black">Floor Zone</span>
                      <span className="text-xs font-black text-slate-900">{currentProduct.floor}</span>
                    </div>
                    <div className="bg-white border border-amber-500/20 rounded-2xl p-2.5">
                      <span className="text-[10px] block text-slate-400 uppercase font-black">Aisle Route</span>
                      <span className="text-xs font-black text-slate-900">{currentProduct.aisle}</span>
                    </div>
                    <div className="bg-white border border-amber-500/20 rounded-2xl p-2.5">
                      <span className="text-[10px] block text-slate-400 uppercase font-black">Rack Node</span>
                      <span className="text-xs font-black text-slate-900">{currentProduct.rack}</span>
                    </div>
                    <div className="bg-white border border-amber-500/20 rounded-2xl p-2.5">
                      <span className="text-[10px] block text-slate-400 uppercase font-black">Shelf Slot</span>
                      <span className="text-xs font-black text-slate-900">{currentProduct.shelf}</span>
                    </div>
                  </div>
                </div>

                {/* LIVE CROWD METER GAUGE */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      📊 Aisle Crowd Activity Gauge
                    </h4>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        currentProduct.crowdIndicator === "Low"
                          ? "bg-emerald-100 text-emerald-800"
                          : currentProduct.crowdIndicator === "Medium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {currentProduct.crowdIndicator} Density
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full transition-all duration-500 ${
                        currentProduct.crowdIndicator === "Low"
                          ? "bg-emerald-500"
                          : currentProduct.crowdIndicator === "Medium"
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${currentProduct.crowdPercentage}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 font-medium">
                    Current occupancy level inside {currentProduct.aisle} is around {currentProduct.crowdPercentage}%.
                  </p>
                </div>

                {/* AUTONOMOUS ITEM PACKING TRIGGER ACTIONS */}
                <div className="pt-2 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border border-slate-200 rounded-2xl h-14 overflow-hidden shadow-xs">
                      <button
                        onClick={() => setCartCount(Math.max(0, cartCount - 1))}
                        className="px-4 text-slate-500 hover:bg-slate-50 h-full font-bold text-lg transition-colors"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-mono font-black text-slate-950">
                        {cartCount}
                      </span>
                      <button
                        onClick={() => setCartCount(cartCount + 1)}
                        className="px-4 text-slate-500 hover:bg-slate-50 h-full font-bold text-lg transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={openPickupSystem}
                      className="flex-1 h-14 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <span>🚀 Schedule Micro-Locker Pick & Collect</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* PRODUCT SPECIFICATION DESCRIPTION & METRICS */}
            <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-slate-200">
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider">Product Overview Matrix</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{currentProduct.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {currentProduct.features.map((f, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white border border-slate-100 p-3 rounded-xl">
                      <span className="text-xs font-semibold text-slate-700">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-4">
                <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider border-b pb-2">
                  🌿 Smart Nutrition Telemetry Score
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <span className="text-[9px] font-bold block text-slate-400 uppercase">Protein</span>
                    <span className="text-xs font-black text-slate-800">{currentProduct.nutrition.protein}</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <span className="text-[9px] font-bold block text-slate-400 uppercase">Energy</span>
                    <span className="text-xs font-black text-slate-800">{currentProduct.nutrition.calories} Cal</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <span className="text-[9px] font-bold block text-slate-400 uppercase">Eco Score</span>
                    <span className="text-xs font-black text-emerald-600">{currentProduct.nutrition.score}/10</span>
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-[11px]">
                  <span className="text-indigo-950 font-black block uppercase tracking-wide">
                    🎁 Smart Ecosystem Bundle Offer
                  </span>
                  <p className="text-indigo-700 font-medium mt-0.5">
                    Pair this item with <strong className="text-indigo-950">{currentProduct.combo.partnerName}</strong> to save instantly <strong className="text-indigo-950">₹{currentProduct.combo.discountAmt}</strong> at checkout.
                  </p>
                </div>
              </div>
            </div>

            {/* ==========================================
                NEW ADDITION: TECHNICAL SPECIFICATIONS CORE
                ========================================== */}
            <div className="py-12 border-b border-slate-200">
              <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider mb-6">
                🛠️ Hardware & Technical Automation Specifications
              </h3>
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950 text-white font-black uppercase tracking-wider">
                      <th className="p-4 w-1/3">System Parameter</th>
                      <th className="p-4">Telemetry Baseline Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900 bg-slate-50/50">RFID Operating Index</td>
                      <td className="p-4 font-mono">{currentProduct.specs.rfidFrequency}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Smart-Scale Load Calibration</td>
                      <td className="p-4">{currentProduct.specs.weightSensorAccuracy}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Package Matrix Build</td>
                      <td className="p-4">{currentProduct.specs.packagingMaterial}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Physical Dimension Bounds</td>
                      <td className="p-4 font-mono">{currentProduct.specs.dimensions}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Thermal Environment Control</td>
                      <td className="p-4 font-semibold text-amber-700">{currentProduct.specs.storageTemp}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* CROSS-SELLING SYSTEMS CORNER */}
            <div className="py-12 border-b border-slate-200">
              <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider mb-6">
                🔄 Cross-Selling Infrastructure Suggestions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleProductSelection(p.id)}
                    className="bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-slate-950 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-full h-24 bg-slate-50 rounded-xl mb-3 p-4 flex items-center justify-center">
                        <div className="w-12 h-12">{drawProductIcon(p.vectorSeedColor)}</div>
                      </div>
                      <h4 className="text-xs font-black text-slate-900 line-clamp-1 uppercase">{p.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-bold">{p.brand}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                      <span className="text-xs font-black text-slate-950">₹{p.basePrice}</span>
                      <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        Inspect
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FEEDBACK FEED OVERVIEW REVIEWS GRID */}
            <div className="py-12 pb-24">
              <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider mb-6">
                💬 Autonomous Smart-Cart Checkout Verified Logs ({currentProduct.reviews.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentProduct.reviews.map((r) => (
                  <div key={r.id} className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-slate-900">{r.user}</h4>
                        <span className="text-[10px] text-slate-400 font-medium">Logged on {r.date}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-amber-500 font-black">{"★".repeat(r.rating)}</span>
                        {r.verified && (
                          <span className="text-[8px] bg-emerald-100 text-emerald-800 font-extrabold tracking-widest uppercase px-1.5 py-0.5 rounded mt-0.5">
                            Cart Sync Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 italic">"{r.title}"</h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium mt-1">
                        {r.comment}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span>Was this diagnostic report helpful?</span>
                      <button className="text-slate-600 hover:text-slate-950 bg-slate-100 px-2.5 py-1 rounded-md">
                        Helpful ({r.helpfulCount})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ==========================================
                NEW ADDITION: PERSISTENT NAVIGATION CONSOLE BAR
                ========================================== */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/90 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-slate-800 shadow-2xl flex items-center gap-6 z-40 transition-all">
              <span className="text-[10px] font-black text-amber-400 tracking-wider uppercase border-r border-slate-800 pr-4 hidden sm:inline">
                Dashboard Controls
              </span>
              <button 
                onClick={() => { setActiveView("catalog"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="text-xs font-black uppercase text-white hover:text-amber-400 transition-colors flex items-center gap-1.5"
              >
                🏬 Store Hub
              </button>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-xs font-black uppercase text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                ▲ Scroll Top
              </button>
            </div>

          </main>
        )}
      </div>

      {/* ==========================================
          FLAGSHIP SYSTEM INTERACTIVE MODAL COMPONENT
          ========================================== */}
      {showPickupModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border-2 border-slate-950 w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* HEADERS */}
            <div className="bg-slate-950 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider">
                  {pickupStep === "setup" ? "Configure Distribution Channel" : "🔒 Dispatched to Secure Terminal"}
                </h3>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                  {pickupStep === "setup" ? "Finalize logistics reservation" : "System automated routing initialized."}
                </p>
              </div>
              <button
                onClick={() => setShowPickupModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold hover:bg-white/20 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* STAGE CONFIGURATION A: LOGISTICS SCHEDULING FORM */}
            {pickupStep === "setup" && (
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                    Select Target Pickup Time Slot
                  </label>
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-slate-950"
                  >
                    <option>10:00 AM - 10:30 AM</option>
                    <option>11:15 AM - 11:45 AM</option>
                    <option>02:30 PM - 03:00 PM</option>
                    <option>04:00 PM - 04:30 PM</option>
                    <option>07:15 PM - 07:45 PM</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                    Select Delivery Locker Infrastructure
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Smart Locker", "Cold Storage Node"].map((type) => {
                      const isSelected = selectedLockerType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSelectedLockerType(type)}
                          className={`p-3 rounded-xl border text-left font-bold text-xs transition-all ${
                            isSelected
                              ? "border-slate-950 bg-slate-950 text-white shadow-sm"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          📦 {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-1.5 text-slate-600 font-medium">
                  <div className="flex justify-between">
                    <span>Selected Allocation Unit Size:</span>
                    <strong className="text-slate-900">{currentProduct.variants[activeVariantIdx].label}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Assigned Distribution Node:</span>
                    <strong className="text-slate-900">{currentProduct.floor} ({currentProduct.rack})</strong>
                  </div>
                  <div className="flex justify-between border-t border-slate-200/80 pt-2 font-black text-slate-950">
                    <span>Total Aggregate Bill Amount:</span>
                    <span>
                      ₹
                      {(currentProduct.basePrice + currentProduct.variants[activeVariantIdx].priceModifier) *
                        (cartCount || 1)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={confirmPickupReservation}
                  className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-colors shadow-md mt-2"
                >
                  Confirm Reservation & Generate Code
                </button>
              </div>
            )}

            {/* STAGE CONFIGURATION B: LOCKER HUB DATA DISPATCHED */}
            {pickupStep === "confirmed" && (
              <div className="p-6 space-y-5 text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-2xl mx-auto border border-emerald-200 animate-bounce">
                  ✅
                </div>
                
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    Order Transferred to Automated Fulfillment Core
                  </h4>
                  <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto mt-1">
                    Your selected items have been locked in. Head to the terminal console during your scheduled slot.
                  </p>
                </div>

                {/* LOGISTICS ROUTING INFRASTRUCTURE TRACKER STATUS STRIP */}
                <div className="bg-slate-950 rounded-2xl p-4 text-left border border-slate-800">
                  <span className="text-[9px] font-black uppercase text-slate-500 block tracking-widest">
                    Real-Time Packing Feed Tracker
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-xs font-mono font-black text-amber-400 uppercase tracking-wider">
                      {liveOrderStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">
                      Target Access Box No
                    </span>
                    <span className="text-lg font-mono font-black text-slate-950 tracking-wider">
                      {generatedLockerNo}
                    </span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">
                      Terminal Access OTP Pass
                    </span>
                    <span className="text-lg font-mono font-black text-indigo-600 tracking-widest">
                      {generatedOTP}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowPickupModal(false)}
                  className="w-full h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider rounded-xl transition-colors mt-2"
                >
                  Exit Logistics Management View
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CORE BASEBOARD BRAND FOOTER MARQUEE */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-[10px] font-bold text-slate-400 tracking-widest uppercase">
        © 2026 GMR Networks Ecosystem Corp. All Node Matrices Active and Synced.
      </footer>
    </div>
  );
}