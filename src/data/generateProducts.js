// generateProducts.js

const namingMaster = {
  // Ground Floor
  "dairy": [
    "Amul Gold Milk", "Heritage Toned Milk", "Greek Blueberry Yogurt", "Organic Salted Butter", "Fresh Paneer Cube",
    "Cooking Cream", "Mozzarella Cheese Shreds", "Low Fat Skimmed Milk", "Buffalo Ghee", "Condensed Milk",
    "Soy Milk Vanilla", "Almond Milk Unsweetened", "Cheddar Cheese Slices", "Whipped Cream Can", "Strawberry Milkshake",
    "Probiotic Drink", "Masala Buttermilk", "Sour Cream", "Goat Cheese", "Chocolate Milk Carton",
    "Ricotta Cheese", "Feta Cheese Block", "Dairy Whitener", "Malted Milk Powder", "Condensed Skim Milk"
  ],
  "soft-drinks": [
    "Coca Cola Classic", "Pepsi Zero Sugar", "Sprite Lemon Lime", "Mountain Dew Neon", "Thums Up Charged",
    "Red Bull Energy", "Monster Ultra White", "Diet Coke Can", "Fanta Orange Splash", "7Up Revive",
    "Mirinda Orange", "Appy Fizz", "Maaza Mango", "Frooti Drink", "Paper Boat Aam Panna",
    "Ocean Fruit Water", "Gatorade Blue Bolt", "Sting Energy Berry", "Ginger Ale Premium", "Tonic Water",
    "Club Soda", "Jeera Masala Soda", "Iced Tea Lemon", "Cold Brew Coffee", "Root Beer"
  ],
  "snacks": [
    "Lays Classic Salted", "Kurkure Masala Munch", "Doritos Nacho Cheese", "Pringles Sour Cream", "Bingo Mad Angles",
    "Haldirams Bhujia", "Act II Popcorn", "Parle-G Biscuits", "Oreo Chocolate Cream", "Hide & Seek Cookies",
    "Dark Fantasy Choco Fills", "Maggi Masala Noodles", "Yippee Noodles", "Snickers Chocolate Bar", "Dairy Milk Silk",
    "KitKat 4 Finger", "Ferrero Rocher T3", "Nutella Spread", "Kelloggs Corn Flakes", "Chocos Moons",
    "Muesli Fruit & Nut", "Roasted Almonds", "Salted Cashews", "Potato Sticks", "Cheese Balls"
  ],
  "personal-care": [
    "Dettol Antiseptic Liquid", "Dove Cream Bar", "Lifebuoy Total", "Pears Soft Soap", "Colgate Max Fresh",
    "Sensodyne Toothpaste", "Pepsodent Germi Check", "Head & Shoulders Shampoo", "Pantene Pro-V", "Tresemme Smooth",
    "Parachute Coconut Oil", "Nivea Body Lotion", "Vaseline Petroleum Jelly", "Fair & Lovely Glow", "Ponds White Beauty",
    "Gillette Mach 3 Razor", "Park Avenue Deo", "Fog Body Spray", "Old Spice Aftershave", "Stayfree Secure",
    "Whisper Ultra Clean", "Himalaya Face Wash", "Clean & Clear Foaming", "Axe Signature", "Wild Stone Deo"
  ],
  // First Floor
  "men": [
    "Levis 511 Slim Fit", "Peter England Formals", "US Polo Assn T-Shirt", "Flying Machine Jeans", "Allen Solly Shirt",
    "Wrangler Denim Jacket", "Nike Training Shorts", "Adidas Track Pants", "Puma Graphic Tee", "Spykar Casual Shirt",
    "Van Heusen Trouser", "Louis Philippe Suit", "Jack & Jones Hoodie", "Monte Carlo Sweater", "Raymond Blazer",
    "Roadster Checked Shirt", "Being Human Polo", "United Colors of Benetton", "Mufti Narrow Jeans", "Lee Cooper Chinos",
    "Fila Sports Jersey", "Killer Slim Jeans", "Park Avenue Tie", "Arrow Formal Shirt", "Blackberrys Tuxedo"
  ],
  "women": [
    "Biba Cotton Kurti", "W for Woman Dress", "Aurelia Palazzo", "Global Desi Top", "FabIndia Saree",
    "Levis 711 Skinny Jeans", "Zara Floral Dress", "H&M Casual Tee", "Forever 21 Skirt", "Veromoda Gown",
    "Only High Rise Denim", "Mango Evening Top", "Allen Solly Women Blazer", "Nike Leggings", "Adidas Sports Bra",
    "Lakme Fashion Saree", "Satya Paul Scarf", "Lifestyle Maxi Dress", "Max Fashion Tunic", "Pantaloons Ethnic Wear",
    "Van Heusen Dress", "Madame Winter Coat", "Avenue Checked Shirt", "Global Desi Tunic", "Rangriti Salwar Suit"
  ],
  "footwear": [
    "Nike Air Max", "Adidas Ultraboost", "Puma RS-X", "Reebok Classic", "Skechers GoWalk",
    "Bata Leather Shoes", "Hush Puppies Formal", "Red Tape Loafers", "Woodland Hiking Boots", "Crocs Classic Clog",
    "Sparx Running Shoes", "Lotto Training Footwear", "Liberty Formal Shoes", "Metro Party Wear Heels", "Mochi Sandals",
    "Catwalk Wedges", "Inc.5 Formal Heels", "Asics Gel Kayano", "Converse Chuck Taylor", "Vans Old Skool",
    "New Balance 574", "Fila Disruptor", "Birkenstock Arizona", "Flite Flip Flops", "Campus Running Shoes"
  ],
  "accessories": [
    "Fastrack Analog Watch", "Casio G-Shock", "Fossil Leather Watch", "Titan Raga", "RayBan Wayfarer",
    "Oakley Sports Shades", "Skybags Backpack", "American Tourister Suitcase", "Wildcraft Trekking Bag", "Levis Leather Belt",
    "Tommy Hilfiger Wallet", "Puma Gym Bag", "Nike Wristband", "Adidas Performance Cap", "H&M Beanie",
    "VIP Hard Case Luggage", "Safari Trolley Bag", "Boat Rockerz Headphones", "JBL Bluetooth Speaker", "Apple AirPods Case",
    "MI Power Bank", "Samsung Galaxy Watch", "Fitbit Fitness Tracker", "Guess Handbag", "Caprese Sling Bag"
  ],
  // Second Floor
  "kitchen": [
    "Prestige Non-Stick Pan", "Pigeon Pressure Cooker", "Milton Water Bottle", "Borosil Glass Bowl", "Tefal Air Fryer",
    "Philips Mixer Grinder", "Bajaj Electric Kettle", "Usha Induction Cooktop", "Wonderchef Chopper", "Hawkins Contura",
    "Wonderchef Nutri-blend", "Butterfly Gas Stove", "Cello Dinner Set", "Luminarc Glass Set", "Tupperware Container",
    "Signoraware Lunch Box", "Vinod Stainless Steel Pot", "KitchenAid Stand Mixer", "Morphy Richards Toaster", "Kent Rice Cooker",
    "Prestige Induction Cooker", "Baking Tray Silicone", "Knife Set Professional", "Wooden Spatula Set", "Measuring Cup Set"
  ],
  "home-essentials": [
    "Godrej Digital Safe", "Portronics Extension Box", "Syska LED Bulb", "Philips Table Lamp", "Sleepwell Pillow",
    "Bombay Dyeing Bedsheet", "Raymond Blanket", "Spaces Luxury Towel", "Eureka Forbes Vacuum", "Prestige Steam Iron",
    "Livpure Water Purifier", "Luminous Inverter", "Exide Home Battery", "Odonil Air Freshener", "Godrej Aer Spray",
    "All Out Mosquito Liquid", "Hit Crawling Insect", "Durex Extended Pleasure", "Vicks Vaporub", "Harpic Toilet Cleaner",
    "Lizol Floor Cleaner", "Comfort Fabric Conditioner", "Surf Excel Matic", "Ariel Top Load", "Vim Dishwash Gel"
  ],
  "toys": [
    "Hot Wheels Car Set", "Barbie Dream House", "LEGO Classic Bricks", "Fisher Price Gym", "Nerf Elite Blaster",
    "Funskool Monopoly", "Scrabble Board Game", "Rubiks Cube 3x3", "Remote Control Car", "Dancing Robot Toy",
    "Soft Plush Teddy", "Doctor Set for Kids", "Kitchen Set Play", "Uno Card Game", "Playing Cards Premium",
    "Chess Wooden Set", "Carrom Board Champion", "Badminton Racket Junior", "Cricket Bat Willow", "Football Size 5",
    "Basketball Spalding", "Skating Shoes", "Action Figure Marvel", "Transformer Robot", "Bayblade Burst"
  ],
  "furniture": [
    "Nilkamal Plastic Chair", "Godrej Almirah Steel", "IKEA Study Table", "Supreme Plastic Table", "Featherlite Office Chair",
    "Sleepyhead Sofa Bed", "Wakefit Ortho Mattress", "Urban Ladder Bookshelf", "Pepperfry TV Unit", "Zuari Queen Bed",
    "Home Centre Dining Table", "Inalsa Shoe Rack", "Bean Bag Cover XL", "Wall Mirror Decorative", "Curtain Rod Metal",
    "Blackout Window Curtain", "Door Mat Anti-Skid", "Floor Rug Persian Style", "Cushion Cover Velvet", "Plastic Storage Cabinet",
    "Folding Ladder Aluminum", "Ironing Board Large", "Wardrobe Organizer", "Wall Clock Modern", "Night Stand Table"
  ]
};

const floors = [
  { name: "Ground Floor", basePath: "assets/products/ground-floor/", zones: ["Blue", "Orange", "Yellow", "Pink"], categories: ["dairy", "soft-drinks", "snacks", "personal-care"] },
  { name: "First Floor", basePath: "assets/products/first-floor/", zones: ["Navy", "Violet", "Sky", "Grey"], categories: ["men", "women", "footwear", "accessories"] },
  { name: "Second Floor", basePath: "assets/products/second-floor/", zones: ["Red", "Green", "Yellow", "Brown"], categories: ["kitchen", "home-essentials", "toys", "furniture"] }
];

function generateProducts() {
  const products = [];
  let idCounter = 1;

  floors.forEach((floor) => {
    floor.categories.forEach((catSlug) => {
      const namesList = namingMaster[catSlug]; // Get the list of 25 names

      for (let i = 0; i < 25; i++) { // Generate exactly 25 products per category
        const productName = namesList[i];
        const zone = floor.zones[i % floor.zones.length];
        const rowLetter = String.fromCharCode(65 + (idCounter % 10)); 
        const rowNumber = Math.ceil(i / 5) + 1;

        products.push({
          id: idCounter,
          name: productName,
          category: catSlug,
          floor: floor.name,
          path: `${floor.basePath}${catSlug}/`,
          filename: `product-${i + 1}.jpg`,
          price: Math.floor(Math.random() * 4500) + 40,
          discount: Math.floor(Math.random() * 35),
          stock: Math.floor(Math.random() * 150) + 5,
          row: `${rowLetter}${rowNumber}`,
          brand: productName.split(' ')[0], // Extract first word as brand
          mfg_date: "2026-01-10",
          exp_date: floor.name === "Ground Floor" ? "2026-06-15" : "N/A",
          weight: `${(Math.floor(Math.random() * 10) + 1) * 100}g`,
          color_zone: zone,
          map_position: { x: Math.floor(Math.random() * 400), y: Math.floor(Math.random() * 300) }
        });
        idCounter++;
      }
    });
  });
  return products;
}

export default generateProducts();