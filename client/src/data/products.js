// Static product data — stands in for a future GET /api/products
// (Express + MongoDB) response. Each product belongs to a category
// slug from data/categories.js. Image URLs for the new category
// products use Lorem Picsum seeded placeholders so every product has
// a stable photo with zero broken-link risk until real product
// photography is uploaded; the original 4 "Featured Collections"
// images are kept exactly as they were in the source design.

const ph = (seed) => `https://picsum.photos/seed/${seed}/400/300`;

export const products = [
  // ---- Featured Collections (unchanged from the original design) ----
  {
    id: 'feat-1',
    category: 'new-laptops',
    brand: 'Dell',
    name: 'Vostro 3520 Core i5 12th Gen Laptop',
    price: 42500,
    oldPrice: 55000,
    badge: 'sale',
    featured: true,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'feat-2',
    category: 'refurbished-laptops',
    brand: 'HP',
    name: 'EliteBook 840 G6 Certified Corporate Edition',
    price: 18500,
    oldPrice: 30000,
    badge: 'refurb',
    featured: true,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'feat-3',
    category: 'new-laptops',
    brand: 'Lenovo',
    name: 'IdeaPad Gaming 3 Gen 7 RTX 3050',
    price: 58000,
    oldPrice: 72000,
    badge: 'new',
    featured: true,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'feat-4',
    category: 'custom-pc-builds',
    brand: 'Custom Build',
    name: 'Gaming Rig Intel i5 13th + RTX 4060',
    price: 75000,
    badge: 'hot',
    featured: true,
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=400&q=80',
  },

  // ---- Brand New Laptops ----
  { id: 'nl-2', category: 'new-laptops', brand: 'HP', name: 'Pavilion 15 Ryzen 5 5625U, 16GB RAM', price: 49990, badge: 'new', image: ph('nl-2') },
  { id: 'nl-3', category: 'new-laptops', brand: 'Lenovo', name: 'IdeaPad Slim 3 Core i3 13th Gen', price: 33990, image: ph('nl-3') },
  { id: 'nl-4', category: 'new-laptops', brand: 'ASUS', name: 'VivoBook 15 Core i5 13th Gen, 512GB SSD', price: 52990, oldPrice: 61990, badge: 'sale', image: ph('nl-4') },
  { id: 'nl-5', category: 'new-laptops', brand: 'Acer', name: 'Aspire 7 Ryzen 5 + RTX 2050 Graphics', price: 56990, badge: 'hot', image: ph('nl-5') },

  // ---- Refurbished Laptops ----
  { id: 'rl-2', category: 'refurbished-laptops', brand: 'Dell', name: 'Latitude 5400 Core i5 8th Gen, 8GB RAM', price: 16500, oldPrice: 24000, badge: 'refurb', image: ph('rl-2') },
  { id: 'rl-3', category: 'refurbished-laptops', brand: 'Lenovo', name: 'ThinkPad T480 Core i5 8th Gen', price: 19990, oldPrice: 27000, badge: 'refurb', image: ph('rl-3') },
  { id: 'rl-4', category: 'refurbished-laptops', brand: 'HP', name: 'ProBook 450 G5 Core i5 8th Gen', price: 17990, oldPrice: 25500, badge: 'refurb', image: ph('rl-4') },
  { id: 'rl-5', category: 'refurbished-laptops', brand: 'Dell', name: 'Inspiron 3493 Core i3 10th Gen', price: 14500, oldPrice: 20000, badge: 'refurb', image: ph('rl-5') },

  // ---- Custom PC Builds ----
  { id: 'cb-2', category: 'custom-pc-builds', brand: 'Custom Build', name: 'Editing Workstation Ryzen 7 + RTX 3060', price: 92000, badge: 'new', image: ph('cb-2') },
  { id: 'cb-3', category: 'custom-pc-builds', brand: 'Custom Build', name: 'Budget Gaming Build Core i3 12th + GTX 1650', price: 48500, image: ph('cb-3') },
  { id: 'cb-4', category: 'custom-pc-builds', brand: 'Custom Build', name: 'Streaming Powerhouse Ryzen 9 + RTX 4070', price: 145000, badge: 'hot', image: ph('cb-4') },
  { id: 'cb-5', category: 'custom-pc-builds', brand: 'Custom Build', name: 'Office & Browsing PC Core i3 12th, 8GB RAM', price: 28500, image: ph('cb-5') },

  // ---- Processors & Motherboards ----
  { id: 'pm-1', category: 'processors-motherboards', brand: 'Intel', name: 'Core i5-13400F Desktop Processor', price: 16990, badge: 'new', image: ph('pm-1') },
  { id: 'pm-2', category: 'processors-motherboards', brand: 'AMD', name: 'Ryzen 5 5600X Desktop Processor', price: 13990, image: ph('pm-2') },
  { id: 'pm-3', category: 'processors-motherboards', brand: 'Gigabyte', name: 'B660M DS3H DDR4 Motherboard', price: 9490, image: ph('pm-3') },
  { id: 'pm-4', category: 'processors-motherboards', brand: 'MSI', name: 'B550 Gaming Plus ATX Motherboard', price: 10990, badge: 'hot', image: ph('pm-4') },

  // ---- Graphic Cards ----
  { id: 'gc-1', category: 'graphic-cards', brand: 'NVIDIA', name: 'GeForce RTX 4060 8GB GDDR6', price: 28990, badge: 'hot', image: ph('gc-1') },
  { id: 'gc-2', category: 'graphic-cards', brand: 'NVIDIA', name: 'GeForce GTX 1650 4GB GDDR6', price: 12990, image: ph('gc-2') },
  { id: 'gc-3', category: 'graphic-cards', brand: 'AMD', name: 'Radeon RX 6600 8GB GDDR6', price: 19990, badge: 'sale', oldPrice: 23990, image: ph('gc-3') },
  { id: 'gc-4', category: 'graphic-cards', brand: 'NVIDIA', name: 'GeForce RTX 3060 12GB GDDR6', price: 24990, badge: 'new', image: ph('gc-4') },

  // ---- RAM & Storage ----
  { id: 'rs-1', category: 'ram-storage', brand: 'Corsair', name: 'Vengeance 16GB (8x2) DDR4 3200MHz', price: 2890, image: ph('rs-1') },
  { id: 'rs-2', category: 'ram-storage', brand: 'Kingston', name: 'FURY Beast 32GB (16x2) DDR5 5200MHz', price: 7990, badge: 'new', image: ph('rs-2') },
  { id: 'rs-3', category: 'ram-storage', brand: 'WD', name: 'Blue SN570 1TB NVMe SSD', price: 5490, badge: 'sale', oldPrice: 6490, image: ph('rs-3') },
  { id: 'rs-4', category: 'ram-storage', brand: 'Seagate', name: 'Barracuda 2TB Desktop HDD', price: 4290, image: ph('rs-4') },
  { id: 'rs-5', category: 'ram-storage', brand: 'Crucial', name: 'MX500 500GB SATA SSD', price: 3190, image: ph('rs-5') },
  { id: 'rs-6', category: 'ram-storage', brand: 'SanDisk', name: 'Ultra Dual Drive 64GB Pendrive', price: 690, image: ph('rs-6') },

  // ---- Cabinets & Cooling ----
  { id: 'cc-1', category: 'cabinets-cooling', brand: 'Ant Esports', name: 'ICE-100 Mid Tower Cabinet', price: 2390, image: ph('cc-1') },
  { id: 'cc-2', category: 'cabinets-cooling', brand: 'Deepcool', name: 'MATREXX 30 Micro-ATX Cabinet', price: 2890, badge: 'new', image: ph('cc-2') },
  { id: 'cc-3', category: 'cabinets-cooling', brand: 'Cooler Master', name: 'MasterLiquid 240mm AIO Liquid Cooler', price: 6490, badge: 'hot', image: ph('cc-3') },
  { id: 'cc-4', category: 'cabinets-cooling', brand: 'Deepcool', name: 'AK400 Single Tower Air Cooler', price: 2190, image: ph('cc-4') },

  // ---- Monitors & Screens ----
  { id: 'ms-1', category: 'monitors-screens', brand: 'Dell', name: '21.5" Full HD IPS Monitor', price: 8490, image: ph('ms-1') },
  { id: 'ms-2', category: 'monitors-screens', brand: 'Samsung', name: '24" Curved Full HD Monitor', price: 10990, badge: 'sale', oldPrice: 12990, image: ph('ms-2') },
  { id: 'ms-3', category: 'monitors-screens', brand: 'ASUS', name: '27" TUF Gaming Monitor 144Hz', price: 19990, badge: 'hot', image: ph('ms-3') },
  { id: 'ms-4', category: 'monitors-screens', brand: 'HP', name: '19.5" LED Backlit Monitor', price: 5990, image: ph('ms-4') },

  // ---- Keyboards, Mice & Headphones ----
  { id: 'kh-1', category: 'keyboards-mice-headphones', brand: 'Logitech', name: 'MK270 Wireless Keyboard & Mouse Combo', price: 1690, image: ph('kh-1') },
  { id: 'kh-2', category: 'keyboards-mice-headphones', brand: 'Redgear', name: 'Invador Mechanical Gaming Keyboard', price: 2290, badge: 'new', image: ph('kh-2') },
  { id: 'kh-3', category: 'keyboards-mice-headphones', brand: 'HP', name: 'Wired Optical USB Mouse', price: 390, image: ph('kh-3') },
  { id: 'kh-4', category: 'keyboards-mice-headphones', brand: 'boAt', name: 'Rockerz 450 Wireless Headphones', price: 1399, badge: 'hot', image: ph('kh-4') },
  { id: 'kh-5', category: 'keyboards-mice-headphones', brand: 'Zebronics', name: 'ZEB-Thunder Wired Gaming Headset', price: 899, image: ph('kh-5') },

  // ---- Printers & Cartridges ----
  { id: 'pc-1', category: 'printers-cartridges', brand: 'HP', name: 'DeskJet 2710 All-in-One Printer', price: 4490, badge: 'new', image: ph('pc-1') },
  { id: 'pc-2', category: 'printers-cartridges', brand: 'Canon', name: 'PIXMA E477 All-in-One Wireless Printer', price: 6290, image: ph('pc-2') },
  { id: 'pc-3', category: 'printers-cartridges', brand: 'HP', name: '680 Black Ink Cartridge', price: 690, image: ph('pc-3') },
  { id: 'pc-4', category: 'printers-cartridges', brand: 'Canon', name: 'CL-741 Colour Ink Cartridge', price: 1190, image: ph('pc-4') },
  { id: 'pc-5', category: 'printers-cartridges', brand: 'Generic', name: 'Toner Powder Refill Kit (Black)', price: 450, image: ph('pc-5') },

  // ---- Cables & Accessories ----
  { id: 'ca-1', category: 'cables-accessories', brand: 'Generic', name: 'HDMI Cable 1.5m, High Speed', price: 199, image: ph('ca-1') },
  { id: 'ca-2', category: 'cables-accessories', brand: 'Generic', name: 'VGA Cable 1.5m', price: 149, image: ph('ca-2') },
  { id: 'ca-3', category: 'cables-accessories', brand: 'Generic', name: 'Universal 65W Laptop Power Adapter', price: 899, badge: 'sale', oldPrice: 1199, image: ph('ca-3') },
  { id: 'ca-4', category: 'cables-accessories', brand: 'Generic', name: 'Adjustable Aluminium Laptop Stand', price: 799, image: ph('ca-4') },
  { id: 'ca-5', category: 'cables-accessories', brand: 'Generic', name: 'Laptop Screen & Keyboard Cleaning Kit', price: 299, image: ph('ca-5') },
  { id: 'ca-6', category: 'cables-accessories', brand: 'Generic', name: 'Mouse Pad / Desk Pad, Large', price: 349, image: ph('ca-6') },
];

export const getProductsByCategory = (slug) =>
  products.filter((p) => p.category === slug);

export const getFeaturedProducts = () => products.filter((p) => p.featured);
