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

interface ProductSpecs {
  weight: string;
  dimensions: string;
  packagingType: string;
  shelfLife: string;
  storageTemp: string;
  origin: string;
  certification: string;
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
  specs: ProductSpecs; 
}

// ==========================================
// 2. DYNAMIC GENERATED DATA ENGINE (SIMPLIFIED TAXONOMY)
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
            weight: i % 2 === 0 ? "500g Net Content" : "1kg Economy Pack",
            dimensions: "14.5 x 22.0 x 6.5 cm",
            packagingType: "Recyclable Smart-Barrier Pouch",
            shelfLife: `${i % 4 + 3} Months from Batch Stamp`,
            storageTemp: cat === "Dairy" || cat === "Frozen Foods" ? "2°C - 4°C Chilled" : "Ambient Dry Storage",
            origin: "Regional Agricultural Belt Hub",
            certification: "FSSAI Quality Grade A Certified"
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

  // PICKUP & COLLECT MODAL STATE
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
      
      {/* HUD DEALS BANNER STRIP */}
      <div className="bg-slate-900 text-white text-center py-2.5 px-4 text-xs font-semibold tracking-wider sticky top-0 z-50 flex items-center justify-center gap-3 border-b border-amber-500/30">
        <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-widest animate-pulse">
          Live Store Flash
        </span>
        <span className="text-slate-300 font-medium">Smart Flash-Deals are currently locked in. Expiration index:</span>
        <span className="font-mono text-amber-400 font-black tracking-widest bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
          {String(countdown.hrs).padStart(2, "0")}:{String(countdown.mins).padStart(2, "0")}:{String(countdown.secs).padStart(2, "0")}
        </span>
      </div>

      {/* NAVIGATION CONTROLLER HEADER */}
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

          {/* DYNAMIC SYSTEM DIRECT ACTION NAVIGATION CONTROLLERS */}
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

      {/* INTERACTIVE COMPONENT SWITCHBOARD */}
      <div className={`transition-all duration-300 transform ${isTransitioning ? "opacity-40 scale-98" : "opacity-100 scale-100"}`}>
        
        {/* ==========================================
            VIEW MODALITY PANEL A: CATALOGUE GRID Layout
            ========================================== */}
        {activeView === "catalog" && (
          <main className="max-w-7xl mx-auto px-4 py-10">
            
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
          <main className="max-w-7xl mx-auto px-4 py-8">
            
            <button
              onClick={() => setActiveView("catalog")}
              className="mb-8 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 hover:text-slate-950 transition-colors group bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-xs"
            >
              <span className="transform group-hover:-translate-x-1 transition-transform inline-block">←</span> Back to Department Shelves
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start border-b border-slate-200 pb-16">
              
              {/* IMAGE HOVER OVERLAY SYSTEM */}
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

              {/* CHECKOUT BOX SPECIFICATION PARAMETERS */}
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

                {/* USER SATISFACTION INDEX */}
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

                {/* DYNAMIC VALUE ASSIGNMENT RECEPTACLE */}
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

                {/* INVENTORY TRACKING COUNTERS */}
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <div className="text-xs font-black text-red-700 uppercase tracking-wide flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" /> Only {currentProduct.variants[activeVariantIdx].stockCount} Units Left On Local Shelf
                  </div>
                  <p className="text-[11px] text-red-600/80 font-semibold mt-0.5">
                    [System Tracking: {currentProduct.variants[activeVariantIdx].reservedCount} items successfully locked in active customer baskets]
                  </p>
                </div>

                {/* PACK SIZE PACKAGING SELECTORS */}
                <div className="space-y-3">
                  <label className="text-[11px] uppercase tracking-widest text-slate-400 font-black block">Choose Product Volumetric Pack Size</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentProduct.variants.map((v, vIdx) => {
                      const isSelected = activeVariantIdx === vIdx;
                      return (
                        <button
                          key={v.sku}
                          onClick={() => { setActiveVariantIdx(vIdx); setCartCount(0); }}
                          className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${isSelected ? "border-slate-950 bg-slate-50/70 ring-1 ring-slate-950" : "border-slate-200 bg-white hover:border-slate-300"}`}
                        >
                          <span className="text-xs font-black text-slate-950">{v.label}</span>
                          <div className="flex justify-between items-baseline mt-2">
                            <span className="text-[10px] font-mono text-slate-400 font-bold">{v.sku}</span>
                            <span className="text-xs font-black text-slate-800">+{v.priceModifier ? `₹${v.priceModifier}` : "Base Entry"}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* INTERACTIVE ACTIONS HUB TERMINAL */}
                <div className="pt-4 space-y-3">
                  <button
                    onClick={openPickupSystem}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-widest py-4.5 rounded-2xl transition shadow-md flex items-center justify-center gap-2"
                  >
                    ⚡ Secure Live "Pickup & Collect" Reservation 📦
                  </button>

                  {cartCount > 0 ? (
                    <div className="flex items-center justify-between border border-slate-300 rounded-2xl overflow-hidden bg-white p-1">
                      <button onClick={() => setCartCount((c) => c - 1)} className="px-5 py-2.5 hover:bg-slate-100 font-black transition">－</button>
                      <span className="font-bold text-xs text-slate-700">{cartCount} Packs Linked to Cart</span>
                      <button onClick={() => setCartCount((c) => c + 1)} disabled={cartCount >= currentProduct.variants[activeVariantIdx].stockCount} className="px-5 py-2.5 hover:bg-slate-100 font-black transition disabled:opacity-30">＋</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setCartCount(1)}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl transition"
                    >
                      Add To In-Store Smart Trolley 🛒
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* ==========================================
                TECHNICAL ARTIFACT: PRODUCT SPECIFICATIONS MATRIX
                ========================================== */}
            <div className="py-12 border-b border-slate-200">
              <div className="mb-6">
                <div className="inline-block bg-slate-950 text-white text-[9px] font-mono font-black uppercase tracking-widest px-2.5 py-1 rounded-md mb-2">
                  Technical Fact Matrix
                </div>
                <h3 className="font-black text-xl uppercase tracking-tight text-slate-950">
                  Comprehensive Product Specifications
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Verified system ledger details, environmental constraints, and logistic data tags.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-4 px-6">Specification Field</th>
                      <th className="py-4 px-6">Registered Telemetry Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-950">Net Pack Weight</td>
                      <td className="py-4 px-6 font-mono">{currentProduct.specs.weight}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-950">Volumetric Dimensions</td>
                      <td className="py-4 px-6 font-mono">{currentProduct.specs.dimensions}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-950">Packaging Enclosure Type</td>
                      <td className="py-4 px-6">{currentProduct.specs.packagingType}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-950">Asset Shelf Life Duration</td>
                      <td className="py-4 px-6">{currentProduct.specs.shelfLife}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-950">Storage Temperature Zone</td>
                      <td className="py-4 px-6 font-mono text-indigo-600">{currentProduct.specs.storageTemp}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-950">Sourcing Logistics Origin</td>
                      <td className="py-4 px-6">{currentProduct.specs.origin}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-950">Regulatory Clearances</td>
                      <td className="py-4 px-6 text-emerald-600 font-bold">{currentProduct.specs.certification}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ==========================================
                LIVE CROWD DENSITY GAUGE METER MODULE
                ========================================== */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-b border-slate-200 items-center">
              <div className="md:col-span-5 space-y-3">
                <div className="inline-block bg-slate-950 text-amber-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                  Active Floor Telemetry
                </div>
                <h3 className="font-black text-xl uppercase tracking-tight text-slate-950">
                  Live Section Crowd Density
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Monitors active shoppers, automated cart transponders, and path traffic clusters inside <strong className="text-slate-700">{currentProduct.aisle}</strong>. Use this data to skip queues by ordering online via our <strong>Pickup & Collect</strong> system.
                </p>
                <div className="bg-slate-100 p-3.5 rounded-xl border border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Current Load Index:</span>
                  <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-md ${currentProduct.crowdIndicator === "Low" ? "bg-emerald-100 text-emerald-800" : currentProduct.crowdIndicator === "Medium" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>
                    {currentProduct.crowdIndicator} Traffic
                  </span>
                </div>
              </div>

              <div className="md:col-span-7 bg-white border border-slate-200 p-8 rounded-[2rem] shadow-xs flex flex-col items-center justify-center">
                <div className="relative w-44 h-44">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={`transition-all duration-1000 ${currentProduct.crowdPercentage < 35 ? "text-emerald-500" : currentProduct.crowdPercentage < 70 ? "text-amber-500" : "text-rose-500"}`}
                      strokeDasharray={`${currentProduct.crowdPercentage}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black text-slate-950 font-mono">{currentProduct.crowdPercentage}%</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Capacity</span>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-slate-400 font-bold mt-4 uppercase tracking-widest text-center">
                  🔄 GMR Radar Scan: Active Terminal Traffic Hub Index
                </div>
              </div>
            </div>

            {/* LOCATION LOG DATA CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12 border-b border-slate-200">
              <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4">
                <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 border-b pb-2">📍 Spatial Shelving Mapping</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 font-mono text-xs text-slate-900 font-bold">{currentProduct.aisle}</div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 font-mono text-xs text-slate-900 font-bold">{currentProduct.rack}</div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 font-mono text-xs text-slate-900 font-bold">{currentProduct.shelf}</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-2">
                <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 border-b pb-2">📋 Asset System Log Checklist</h3>
                <ul className="space-y-1 text-xs font-semibold text-slate-600">
                  {currentProduct.features.map((feat, fIdx) => (
                    <li key={fIdx}>✅ {feat}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3">
                <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 border-b pb-2">📊 Product Vital Statistics</h3>
                <div className="space-y-1.5 text-xs font-medium text-slate-600">
                  <div className="flex justify-between border-b pb-1"><span>Energy Allocation Metric:</span><span className="font-black text-slate-900">{currentProduct.nutrition.calories} Cal</span></div>
                  <div className="flex justify-between border-b pb-1"><span>Structural Freshness Score:</span><span className="font-black text-slate-900">{currentProduct.nutrition.score} / 10</span></div>
                </div>
              </div>
            </div>

            {/* VERIFIED CUSTOMER REVIEWS */}
            <div className="py-12 space-y-6">
              <div className="flex justify-between items-baseline border-b pb-3">
                <h3 className="font-black text-lg uppercase tracking-tight text-slate-950">In-Store Verified Customer Feedback Logs</h3>
                <span className="text-xs font-mono font-bold text-slate-400">Showing all {currentProduct.reviews.length} system reports</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProduct.reviews.map((rev) => (
                  <div key={rev.id} className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-400 transition-all shadow-xs">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-amber-500 text-xs">{"★".repeat(rev.rating)}</span>
                        <span className="text-[10px] font-mono font-bold text-slate-400">{rev.date}</span>
                      </div>
                      <h4 className="font-black text-xs text-slate-900 uppercase tracking-tight">{rev.title}</h4>
                      <p className="text-xs text-slate-500 italic font-medium leading-relaxed">"{rev.comment}"</p>
                    </div>
                    <div className="pt-3 mt-4 border-t flex justify-between items-center text-[10px] font-bold border-slate-100">
                      <span className="text-slate-700">👤 {rev.user}</span>
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-black text-[9px]">VERIFIED SYNC</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CROSS-SELLING SUGGESTIONS MATRIX */}
            <div className="pt-12 border-t border-slate-200 space-y-6">
              <h3 className="font-black text-lg uppercase tracking-tight text-slate-950">Cross-Selling Operations Selection Matrix</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleProductSelection(p.id)}
                    className="bg-white border border-slate-200 p-4 rounded-2xl cursor-pointer hover:border-slate-950 hover:shadow-md transition flex flex-col justify-between group"
                  >
                    <div className="w-full h-24 bg-slate-50 rounded-xl mb-2 flex items-center justify-center p-4">
                      {drawProductIcon(p.vectorSeedColor)}
                    </div>
                    <h4 className="font-black text-xs text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">{p.name}</h4>
                    <div className="flex justify-between items-baseline mt-2 pt-2 border-t text-xs font-black">
                      <span>₹{p.basePrice}</span>
                      <span className="text-[9px] uppercase text-slate-400">Inspect →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </main>
        )}
      </div>

      {/* ==========================================
          FLAGSHIP SYSTEM INTERACTIVE MODAL INTERFACE: 
          SMART PICKUP & COLLECT CONTROL TERMINAL
          ========================================== */}
      {showPickupModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] border-2 border-slate-950 overflow-hidden shadow-2xl transition-all my-8">
            
            <div className="bg-slate-950 text-white px-6 py-4 flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <h3 className="font-black text-xs uppercase tracking-widest text-amber-400">GMR Premium Pickup Hub Core Router</h3>
              </div>
              <button 
                onClick={() => setShowPickupModal(false)}
                className="text-slate-400 hover:text-white font-mono text-sm uppercase tracking-tighter"
              >
                [Esc Close]
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              
              <div className="bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3 items-start">
                <span className="text-2xl">📦</span>
                <div>
                  <h4 className="text-xs font-black text-slate-950 uppercase tracking-tight">SMART PICKUP & COLLECT SYSTEM</h4>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed mt-0.5">
                    Your selections are instantly locked out from public shelves upon purchase approval. Avoid long retail checkout crowds completely by retrieving items from secure smart hardware lockers.
                  </p>
                </div>
              </div>

              {pickupStep === "setup" ? (
                <div className="space-y-5">
                  <h4 className="font-black text-sm uppercase tracking-tight text-slate-950 border-b pb-1">Step 2: Define Retrieval Route Parameters</h4>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black block">Select Target Pickup Time Window</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {["10:00 AM - 10:30 AM", "02:10 PM - 02:40 PM", "06:45 PM - 07:15 PM"].map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`p-3 rounded-xl border text-xs font-mono font-bold text-center transition-all ${selectedTimeSlot === slot ? "bg-slate-950 text-white border-slate-950 shadow-sm" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black block">Choose Hardware Interface Channel</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { name: "Smart Locker", desc: "Automated OTP Vault" },
                        { name: "Express Counter", desc: "Staff Assist Station" },
                        { name: "Drive-Thru Lane", desc: "Direct Vehicle Loading" }
                      ].map((item) => (
                        <button
                          key={item.name}
                          onClick={() => setSelectedLockerType(item.name)}
                          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${selectedLockerType === item.name ? "bg-indigo-950 text-white border-indigo-950 shadow-sm" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
                        >
                          <span className="text-xs font-black">{item.name}</span>
                          <span className="text-[9px] opacity-70 mt-1 font-semibold">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Allocation Commitment Ledger</span>
                      <span className="text-xs font-black text-slate-900 mt-0.5 block">{cartCount || 1}x {currentProduct.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Total Net Cost</span>
                      <span className="text-lg font-black text-slate-950">₹{(currentProduct.basePrice + currentProduct.variants[activeVariantIdx].priceModifier) * (cartCount || 1)}</span>
                    </div>
                  </div>

                  <button
                    onClick={confirmPickupReservation}
                    className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl transition shadow-md"
                  >
                    Confirm Secure Reservation & Generate Access Key →
                  </button>
                </div>
              ) : (
                /* SIMULATED SUCCESS STEP INTERFACE */
                <div className="space-y-6 text-center py-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto animate-bounce">
                    ✓
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-black text-slate-950 uppercase tracking-tight">Stock Successfully Reserved & Locked!</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 font-medium">
                      Real-time inventory thresholds adjusted instantly. Your items have been securely withheld from physical public floor selectors.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left max-w-md mx-auto space-y-4">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Live Routing Track Status</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                        <span className="text-xs font-black uppercase text-indigo-900 tracking-wide bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md">
                          {liveOrderStatus}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-1 text-[9px] font-black uppercase tracking-tight text-center">
                      {["Order Confirmed", "Preparing Order", "Packed", "Ready for Pickup", "Collected"].map((stepText, sIdx) => {
                        const statusWeights: Record<string, number> = { "Order Confirmed": 1, "Preparing Order": 2, "Packed": 3, "Ready for Pickup": 4, "Collected": 5 };
                        const currentWeight = statusWeights[liveOrderStatus] || 1;
                        const stepWeight = statusWeights[stepText];
                        const isPastOrCurrent = stepWeight <= currentWeight;
                        return (
                          <div key={stepText} className="space-y-1.5">
                            <div className={`h-1.5 rounded-full ${isPastOrCurrent ? "bg-emerald-500" : "bg-slate-200"}`} />
                            <span className={isPastOrCurrent ? "text-slate-900" : "text-slate-300 font-medium"}>{stepText.split(" ")[0]}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {selectedLockerType === "Smart Locker" && (
                    <div className="bg-slate-950 text-white rounded-3xl p-6 max-w-sm mx-auto border-2 border-amber-500/40 relative shadow-xl overflow-hidden">
                      <span className="text-[9px] font-mono tracking-widest text-amber-400 font-black block uppercase">Automated Hardware Terminal Auth</span>
                      
                      <div className="grid grid-cols-2 gap-4 my-4 border-y border-white/10 py-4 text-left">
                        <div>
                          <span className="text-[9px] font-mono text-slate-400 font-bold block uppercase">Assigned Box</span>
                          <span className="text-xl font-mono font-black text-white">{generatedLockerNo}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-slate-400 font-bold block uppercase">Secure OTP Key</span>
                          <span className="text-xl font-mono font-black text-amber-400 tracking-wider">{generatedOTP}</span>
                        </div>
                      </div>

                      <div className="border border-white/20 rounded-xl p-3 bg-slate-900 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-left">
                          <span className="text-lg">📟</span>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Locker Door Status</span>
                            <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-wide">
                              {liveOrderStatus === "Ready for Pickup" ? "🔓 UNLOCKED / OPEN" : "🔒 LOCKED / AIR-VAC PRESERVATION"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={() => setShowPickupModal(false)}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl transition"
                    >
                      Exit Back to Overview Console
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}