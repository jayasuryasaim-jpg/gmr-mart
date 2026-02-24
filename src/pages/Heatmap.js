import React, { useState, useEffect, useMemo } from 'react';
import './Heatmap.css';

const Heatmap = () => {
  const [activeFloor, setActiveFloor] = useState('Ground Floor');
  const [selectedRow, setSelectedRow] = useState(null); 
  const [hoveredRow, setHoveredRow] = useState(null);   
  const [fireActive, setFireActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cycle, setCycle] = useState(0);

  const rawData = {
    "Ground Floor": {
      "G1": { label: "DAIRY", stock: 85, items: ["Amul Gold Milk", "Heritage Toned Milk", "Greek Blueberry Yogurt", "Organic Salted Butter", "Fresh Paneer Cube", "Cooking Cream", "Mozzarella Cheese Shreds", "Low Fat Skimmed Milk", "Buffalo Ghee", "Condensed Milk", "Soy Milk Vanilla", "Almond Milk Unsweetened", "Cheddar Cheese Slices", "Whipped Cream Can", "Strawberry Milkshake", "Probiotic Drink", "Masala Buttermilk", "Sour Cream", "Goat Cheese", "Chocolate Milk Carton", "Ricotta Cheese", "Feta Cheese Block", "Dairy Whitener", "Malted Milk Powder", "Condensed Skim Milk"] },
      "G2": { label: "SOFT DRINKS", stock: 92, items: ["Coca Cola Classic", "Pepsi Zero Sugar", "Sprite Lemon Lime", "Mountain Dew Neon", "Thums Up Charged", "Red Bull Energy", "Monster Ultra White", "Diet Coke Can", "Fanta Orange Splash", "7Up Revive", "Mirinda Orange", "Appy Fizz", "Maaza Mango", "Frooti Drink", "Paper Boat Aam Panna", "Ocean Fruit Water", "Gatorade Blue Bolt", "Sting Energy Berry", "Ginger Ale Premium", "Tonic Water", "Club Soda", "Jeera Masala Soda", "Iced Tea Lemon", "Cold Brew Coffee", "Root Beer"] },
      "G3": { label: "SNACKS", stock: 78, items: ["Lays Classic Salted", "Kurkure Masala Munch", "Doritos Nacho Cheese", "Pringles Sour Cream", "Bingo Mad Angles", "Haldirams Bhujia", "Act II Popcorn", "Parle-G Biscuits", "Oreo Chocolate Cream", "Hide & Seek Cookies", "Dark Fantasy Choco Fills", "Maggi Masala Noodles", "Yippee Noodles", "Snickers Chocolate Bar", "Dairy Milk Silk", "KitKat 4 Finger", "Ferrero Rocher T3", "Nutella Spread", "Kelloggs Corn Flakes", "Chocos Moons", "Muesli Fruit & Nut", "Roasted Almonds", "Salted Cashews", "Potato Sticks", "Cheese Balls"] },
      "G4": { label: "PERSONAL CARE", stock: 60, items: ["Dettol Antiseptic Liquid", "Dove Cream Bar", "Lifebuoy Total", "Pears Soft Soap", "Colgate Max Fresh", "Sensodyne Toothpaste", "Pepsodent Germi Check", "Head & Shoulders Shampoo", "Pantene Pro-V", "Tresemme Smooth", "Parachute Coconut Oil", "Nivea Body Lotion", "Vaseline Petroleum Jelly", "Fair & Lovely Glow", "Ponds White Beauty", "Gillette Mach 3 Razor", "Park Avenue Deo", "Fog Body Spray", "Old Spice Aftershave", "Stayfree Secure", "Whisper Ultra Clean", "Himalaya Face Wash", "Clean & Clear Foaming", "Axe Signature", "Wild Stone Deo"] }
    },
    "First Floor": {
      "F1": { label: "MEN'S WEAR", stock: 70, items: ["Levis 511 Slim Fit", "Peter England Formals", "US Polo Assn T-Shirt", "Flying Machine Jeans", "Allen Solly Shirt", "Wrangler Denim Jacket", "Nike Training Shorts", "Adidas Track Pants", "Puma Graphic Tee", "Spykar Casual Shirt", "Van Heusen Trouser", "Louis Philippe Suit", "Jack & Jones Hoodie", "Monte Carlo Sweater", "Raymond Blazer", "Roadster Checked Shirt", "Being Human Polo", "United Colors of Benetton", "Mufti Narrow Jeans", "Lee Cooper Chinos", "Fila Sports Jersey", "Killer Slim Jeans", "Park Avenue Tie", "Arrow Formal Shirt", "Blackberrys Tuxedo"] },
      "F2": { label: "WOMEN'S WEAR", stock: 65, items: ["Biba Cotton Kurti", "W for Woman Dress", "Aurelia Palazzo", "Global Desi Top", "FabIndia Saree", "Levis 711 Skinny Jeans", "Zara Floral Dress", "H&M Casual Tee", "Forever 21 Skirt", "Veromoda Gown", "Only High Rise Denim", "Mango Evening Top", "Allen Solly Women Blazer", "Nike Leggings", "Adidas Sports Bra", "Lakme Fashion Saree", "Satya Paul Scarf", "Lifestyle Maxi Dress", "Max Fashion Tunic", "Pantaloons Ethnic Wear", "Van Heusen Dress", "Madame Winter Coat", "Avenue Checked Shirt", "Global Desi Tunic", "Rangriti Salwar Suit"] },
      "F3": { label: "FOOTWEAR", stock: 88, items: ["Nike Air Max", "Adidas Ultraboost", "Puma RS-X", "Reebok Classic", "Skechers GoWalk", "Bata Leather Shoes", "Hush Puppies Formal", "Red Tape Loafers", "Woodland Hiking Boots", "Crocs Classic Clog", "Sparx Running Shoes", "Lotto Training Footwear", "Liberty Formal Shoes", "Metro Party Wear Heels", "Mochi Sandals", "Catwalk Wedges", "Inc.5 Formal Heels", "Asics Gel Kayano", "Converse Chuck Taylor", "Vans Old Skool", "New Balance 574", "Fila Disruptor", "Birkenstock Arizona", "Flite Flip Flops", "Campus Running Shoes"] },
      "F4": { label: "ACCESSORIES", stock: 45, items: ["Fastrack Analog Watch", "Casio G-Shock", "Fossil Leather Watch", "Titan Raga", "RayBan Wayfarer", "Oakley Sports Shades", "Skybags Backpack", "American Tourister Suitcase", "Wildcraft Trekking Bag", "Levis Leather Belt", "Tommy Hilfiger Wallet", "Puma Gym Bag", "Nike Wristband", "Adidas Performance Cap", "H&M Beanie", "VIP Hard Case Luggage", "Safari Trolley Bag", "Boat Rockerz Headphones", "JBL Bluetooth Speaker", "Apple AirPods Case", "MI Power Bank", "Samsung Galaxy Watch", "Fitbit Fitness Tracker", "Guess Handbag", "Caprese Sling Bag"] }
    },
    "Second Floor": {
      "S1": { label: "KITCHEN", stock: 95, items: ["Prestige Non-Stick Pan", "Pigeon Pressure Cooker", "Milton Water Bottle", "Borosil Glass Bowl", "Tefal Air Fryer", "Philips Mixer Grinder", "Bajaj Electric Kettle", "Usha Induction Cooktop", "Wonderchef Chopper", "Hawkins Contura", "Wonderchef Nutri-blend", "Butterfly Gas Stove", "Cello Dinner Set", "Luminarc Glass Set", "Tupperware Container", "Signoraware Lunch Box", "Vinod Stainless Steel Pot", "KitchenAid Stand Mixer", "Morphy Richards Toaster", "Kent Rice Cooker", "Prestige Induction Cooker", "Baking Tray Silicone", "Knife Set Professional", "Wooden Spatula Set", "Measuring Cup Set"] },
      "S2": { label: "ESSENTIALS", stock: 55, items: ["Godrej Digital Safe", "Portronics Extension Box", "Syska LED Bulb", "Philips Table Lamp", "Sleepwell Pillow", "Bombay Dyeing Bedsheet", "Raymond Blanket", "Spaces Luxury Towel", "Eureka Forbes Vacuum", "Prestige Steam Iron", "Livpure Water Purifier", "Luminous Inverter", "Exide Home Battery", "Odonil Air Freshener", "Godrej Aer Spray", "All Out Mosquito Liquid", "Hit Crawling Insect", "Durex Extended Pleasure", "Vicks Vaporub", "Harpic Toilet Cleaner", "Lizol Floor Cleaner", "Comfort Fabric Conditioner", "Surf Excel Matic", "Ariel Top Load", "Vim Dishwash Gel"] },
      "S3": { label: "TOYS", stock: 82, items: ["Hot Wheels Car Set", "Barbie Dream House", "LEGO Classic Bricks", "Fisher Price Gym", "Nerf Elite Blaster", "Funskool Monopoly", "Scrabble Board Game", "Rubiks Cube 3x3", "Remote Control Car", "Dancing Robot Toy", "Soft Plush Teddy", "Doctor Set for Kids", "Kitchen Set Play", "Uno Card Game", "Playing Cards Premium", "Chess Wooden Set", "Carrom Board Champion", "Badminton Racket Junior", "Cricket Bat Willow", "Football Size 5", "Basketball Spalding", "Skating Shoes", "Action Figure Marvel", "Transformer Robot", "Bayblade Burst"] },
      "S4": { label: "FURNITURE", stock: 30, items: ["Nilkamal Plastic Chair", "Godrej Almirah Steel", "IKEA Study Table", "Supreme Plastic Table", "Featherlite Office Chair", "Sleepyhead Sofa Bed", "Wakefit Ortho Mattress", "Urban Ladder Bookshelf", "Pepperfry TV Unit", "Zuari Queen Bed", "Home Centre Dining Table", "Inalsa Shoe Rack", "Bean Bag Cover XL", "Wall Mirror Decorative", "Curtain Rod Metal", "Blackout Window Curtain", "Door Mat Anti-Skid", "Floor Rug Persian Style", "Cushion Cover Velvet", "Plastic Storage Cabinet", "Folding Ladder Aluminum", "Ironing Board Large", "Wardrobe Organizer", "Wall Clock Modern", "Night Stand Table"] }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCycle((prev) => (prev + 1) % 3), 10000);
    return () => clearInterval(timer);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery) return null;
    const found = [];
    Object.keys(rawData).forEach(floor => {
      Object.keys(rawData[floor]).forEach(rowId => {
        if (rawData[floor][rowId].items.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))) {
          found.push({ floor, rowId });
        }
      });
    });
    return found;
  }, [searchQuery]);

  const floorConfig = {
    "Ground Floor": { id: "001", states: ["HIGH", "MOD", "HIGH"], colors: ["#ff3131", "#ff9100", "#ff3131"], rows: ["G1", "G2", "G3", "G4"] },
    "First Floor": { id: "023", states: ["MOD", "LOW", "MOD"], colors: ["#ff9100", "#00ff88", "#ff9100"], rows: ["F1", "F2", "F3", "F4"] },
    "Second Floor": { id: "021", states: ["LOW", "LOW", "MOD"], colors: ["#00ff88", "#00ff88", "#ff9100"], rows: ["S1", "S2", "S3", "S4"] }
  };

  const displayRow = selectedRow || hoveredRow;

  return (
    <div className="pro-container">
      <header className="pro-header">
        <div className="brand">GMR <span>SMART MART</span></div>
        <div className="search-bar-center">
            <input 
                type="text" 
                placeholder="🔍 Search product location..." 
                className="map-search-input"
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        <button className={`fire-btn ${fireActive ? 'active-alarm' : ''}`} onClick={() => setFireActive(!fireActive)}>
          {fireActive ? "🚨 EMERGENCY ACTIVE" : "🛡️ FIRE SYSTEM STANDBY"}
        </button>
      </header>

      <div className="pro-layout">
        <aside className="pro-sidebar">
          <h3 className="sidebar-title">FLOOR NAVIGATION</h3>
          <div className="floor-stack">
            {Object.keys(floorConfig).map(name => (
              <div key={name} className={`floor-btn-pro ${activeFloor === name ? 'active' : ''}`} onClick={() => { setActiveFloor(name); setSelectedRow(null); }}>
                <div className="btn-content">
                    <span className="btn-id">{floorConfig[name].id}</span>
                    <span className="btn-name">{name}</span>
                </div>
                <div className="btn-status" style={{color: floorConfig[name].colors[cycle]}}>
                    ● {floorConfig[name].states[cycle]}
                </div>
              </div>
            ))}
          </div>

          <h3 className="sidebar-title mt-30">ROW ANALYTICS: <span className="highlight-text">{displayRow || "---"}</span></h3>
          <div className="analytics-scroll-area">
            {displayRow && rawData[activeFloor][displayRow] ? (
              rawData[activeFloor][displayRow].items
                .filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((item, idx) => (
                <div key={idx} className="detail-card">
                  <div className="product-name-pro">{item}</div>
                  <div className="progress-bar-bg"><div className="progress-bar-fill" style={{width: `${rawData[activeFloor][displayRow].stock}%`}}></div></div>
                  <div className="card-footer">
                      <span className="stock-label">STOCK LEVEL</span>
                      <span className="stock-count">{rawData[activeFloor][displayRow].stock}%</span>
                  </div>
                </div>
              ))
            ) : <div className="placeholder-msg">SELECT AN AISLE ON THE MAP</div>}
          </div>
        </aside>

        <main className="pro-map-center">
          <div className="map-viewport">
            <div className="map-perspective-box">
                <div className="isometric-world-pro">
                {Object.entries(floorConfig).map(([name, data]) => (
                    <div key={name} className={`floor-slab ${activeFloor === name ? 'visible' : 'hidden'}`}>
                    
                    <div className="heatmap-intensity-layer" style={{ background: fireActive ? 'radial-gradient(circle at center, rgba(255, 49, 49, 0.4) 0%, transparent 70%)' : `radial-gradient(circle at center, ${data.colors[cycle]}33 0%, transparent 70%)` }}></div>

                    <div className={`facility-dot-box corner-left ${fireActive ? 'emergency' : ''}`}>STAIRS</div>
                    <div className={`facility-dot-box corner-right ${fireActive ? 'emergency' : ''}`}>LIFT</div>

                    <div className="aisle-container">
                        {data.rows.map(rid => {
                        const isFound = searchResults?.some(res => res.rowId === rid && res.floor === name);
                        return (
                            <div key={rid} className={`aisle-box ${displayRow === rid || isFound ? 'active' : ''}`}
                            onMouseEnter={() => setHoveredRow(rid)} onMouseLeave={() => setHoveredRow(null)}
                            onClick={() => setSelectedRow(rid === selectedRow ? null : rid)}>
                            
                            <div className="parallel-label-box">
                                {rawData[name]?.[rid]?.label || rid}
                            </div>

                            <div className="aisle-3d-body">
                                <div className="aisle-fill" style={{ height: `${rawData[name]?.[rid]?.stock || 0}%`, background: fireActive ? 'var(--neon-red)' : 'var(--neon-cyan)' }}></div>
                            </div>
                            </div>
                        );
                        })}
                    </div>
                    </div>
                ))}
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Heatmap;