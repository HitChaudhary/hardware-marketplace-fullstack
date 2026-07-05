import { seededRandom, seededInt, seededPick } from './seededRandom';

const SPEC_TEMPLATES = {
  'new-laptops': (p) => ({
    Processor: seededPick(p.id + 'cpu', ['Intel Core i5 13th Gen', 'Intel Core i3 13th Gen', 'AMD Ryzen 5 7530U', 'Intel Core i7 13th Gen']),
    RAM: seededPick(p.id + 'ram', ['8GB DDR4', '16GB DDR4', '16GB DDR5']),
    Storage: seededPick(p.id + 'sto', ['512GB SSD', '1TB SSD', '256GB SSD']),
    Display: seededPick(p.id + 'disp', ['15.6" FHD IPS', '14" FHD IPS', '15.6" FHD Touch']),
    Graphics: seededPick(p.id + 'gpu', ['Integrated Graphics', 'NVIDIA RTX 3050 4GB', 'NVIDIA RTX 2050 4GB']),
    Battery: seededPick(p.id + 'bat', ['3-Cell, up to 8 hrs', '4-Cell, up to 10 hrs']),
    Weight: seededPick(p.id + 'wt', ['1.59 kg', '1.69 kg', '1.85 kg']),
    'Operating System': 'Windows 11 Home',
    Warranty: '1 Year Onsite Warranty',
  }),
  'refurbished-laptops': (p) => ({
    Processor: seededPick(p.id + 'cpu', ['Intel Core i5 8th Gen', 'Intel Core i5 7th Gen', 'Intel Core i3 8th Gen']),
    RAM: seededPick(p.id + 'ram', ['8GB DDR4', '4GB DDR4']),
    Storage: seededPick(p.id + 'sto', ['256GB SSD', '500GB HDD', '128GB SSD + 500GB HDD']),
    Display: '14" HD',
    Graphics: 'Integrated Graphics',
    Battery: 'Refurbished battery, up to 4 hrs',
    Weight: seededPick(p.id + 'wt', ['1.6 kg', '1.8 kg']),
    'Operating System': 'Windows 10/11 Pro (Genuine)',
    Condition: seededPick(p.id + 'cond', ['Grade A — Like New', 'Grade B — Minor Cosmetic Marks']),
    Warranty: '6 Months Seller Warranty',
  }),
  'custom-pc-builds': (p) => ({
    Processor: seededPick(p.id + 'cpu', ['Intel Core i5 13400F', 'AMD Ryzen 5 5600X', 'AMD Ryzen 9 7900X', 'Intel Core i3 12100F']),
    Motherboard: seededPick(p.id + 'mb', ['B660M DDR4', 'B550 ATX', 'X670 ATX']),
    RAM: seededPick(p.id + 'ram', ['16GB DDR4 3200MHz', '32GB DDR5 5200MHz']),
    Storage: seededPick(p.id + 'sto', ['500GB NVMe SSD', '1TB NVMe SSD']),
    Graphics: seededPick(p.id + 'gpu', ['NVIDIA RTX 4060 8GB', 'NVIDIA GTX 1650 4GB', 'NVIDIA RTX 4070 12GB']),
    PSU: '650W 80+ Bronze',
    Cabinet: 'Mid Tower with tempered glass',
    Cooling: seededPick(p.id + 'cool', ['Stock Air Cooler', '240mm AIO Liquid Cooler']),
    Warranty: '1 Year on Components',
  }),
  'processors-motherboards': (p) => ({
    Type: p.name.toLowerCase().includes('motherboard') ? 'Motherboard' : 'Processor',
    Socket: seededPick(p.id + 'sock', ['LGA 1700', 'AM4', 'AM5']),
    'Cores / Threads': seededPick(p.id + 'core', ['6 / 12', '8 / 16', '4 / 8']),
    'Base Clock': seededPick(p.id + 'clk', ['3.4 GHz', '3.7 GHz', '4.1 GHz']),
    Cache: seededPick(p.id + 'cache', ['20MB', '32MB', '16MB']),
    TDP: seededPick(p.id + 'tdp', ['65W', '88W', '105W']),
    Warranty: '3 Years Manufacturer Warranty',
  }),
  'graphic-cards': (p) => ({
    Memory: seededPick(p.id + 'mem', ['8GB GDDR6', '4GB GDDR6', '12GB GDDR6']),
    'Memory Interface': seededPick(p.id + 'bus', ['128-bit', '192-bit', '256-bit']),
    'Core Clock': seededPick(p.id + 'clk', ['1830 MHz', '1965 MHz', '2310 MHz']),
    'Power Connector': seededPick(p.id + 'pwr', ['1x 8-pin', '1x 12VHPWR', 'No external power']),
    Ports: 'HDMI 2.1, DisplayPort 1.4a x3',
    'Recommended PSU': seededPick(p.id + 'psu', ['450W', '550W', '650W']),
    Warranty: '3 Years Manufacturer Warranty',
  }),
  'ram-storage': (p) => ({
    Capacity: p.name.match(/\d+\s?(GB|TB)/i)?.[0] || '—',
    Type: p.name.toLowerCase().includes('ddr5') ? 'DDR5' : p.name.toLowerCase().includes('ddr4') ? 'DDR4' : p.name.toLowerCase().includes('nvme') ? 'NVMe PCIe SSD' : p.name.toLowerCase().includes('hdd') ? 'Desktop HDD' : p.name.toLowerCase().includes('pendrive') || p.name.toLowerCase().includes('drive') ? 'USB Flash Drive' : 'SATA SSD',
    'Read Speed': seededPick(p.id + 'rd', ['up to 560 MB/s', 'up to 3500 MB/s', 'up to 150 MB/s']),
    'Form Factor': seededPick(p.id + 'ff', ['DIMM', 'M.2 2280', '2.5" SATA', '3.5"']),
    Warranty: seededPick(p.id + 'war', ['3 Years', '5 Years', 'Limited Lifetime']),
  }),
  'cabinets-cooling': (p) => ({
    Type: p.name.toLowerCase().includes('cooler') ? 'Cooler' : 'Cabinet',
    'Form Factor': seededPick(p.id + 'ff', ['ATX Mid Tower', 'Micro-ATX', 'ATX Full Tower']),
    'Fans Included': seededPick(p.id + 'fan', ['2x 120mm Pre-installed', '3x 120mm Pre-installed', '1x 120mm']),
    Material: 'SPCC Steel + Tempered Glass',
    'Radiator Size': p.name.toLowerCase().includes('aio') ? '240mm' : '—',
    Warranty: '2 Years',
  }),
  'monitors-screens': (p) => ({
    'Screen Size': p.name.match(/\d+(\.\d+)?"/)?.[0] || '21.5"',
    Resolution: seededPick(p.id + 'res', ['1920 x 1080 (Full HD)', '2560 x 1440 (QHD)']),
    'Refresh Rate': seededPick(p.id + 'hz', ['60Hz', '75Hz', '144Hz']),
    'Panel Type': seededPick(p.id + 'panel', ['IPS', 'VA', 'TN']),
    Ports: 'HDMI, VGA',
    Warranty: '3 Years',
  }),
  'keyboards-mice-headphones': (p) => ({
    Connectivity: p.name.toLowerCase().includes('wireless') ? 'Wireless 2.4GHz' : (p.name.toLowerCase().includes('boat') || p.name.toLowerCase().includes('rockerz')) ? 'Bluetooth 5.0' : 'Wired USB',
    Type: p.name.toLowerCase().includes('mechanical') ? 'Mechanical Keyboard' : (p.name.toLowerCase().includes('headset') || p.name.toLowerCase().includes('headphone') || p.name.toLowerCase().includes('rockerz')) ? 'Headphones' : p.name.toLowerCase().includes('mouse') ? 'Mouse' : 'Keyboard & Mouse Combo',
    'Battery Life': (p.name.toLowerCase().includes('wireless') || p.name.toLowerCase().includes('rockerz')) ? 'up to 15 hrs' : '—',
    Compatibility: 'Windows, macOS, Linux',
    Warranty: '1 Year',
  }),
  'printers-cartridges': (p) => ({
    Type: (p.name.toLowerCase().includes('cartridge') || p.name.toLowerCase().includes('toner')) ? 'Ink / Toner' : 'All-in-One Printer',
    'Print Speed': seededPick(p.id + 'spd', ['7.5 ppm', '8.5 ppm', '10 ppm']),
    Connectivity: seededPick(p.id + 'conn', ['USB', 'USB + Wi-Fi']),
    'Paper Size': 'A4, A5, Letter',
    Warranty: '1 Year',
  }),
  'cables-accessories': (p) => ({
    Length: p.name.match(/\d+(\.\d+)?m/)?.[0] || '1.5m',
    Material: seededPick(p.id + 'mat', ['PVC + Copper Core', 'Aluminium + ABS', 'Microfiber']),
    Compatibility: 'Universal',
    Warranty: '6 Months',
  }),
};

const FEATURE_TEMPLATES = {
  'new-laptops': ['Slim & lightweight chassis for everyday portability', 'Fast boot and app load with SSD storage', 'Full-size backlit keyboard', 'Long-lasting battery for a full work day'],
  'refurbished-laptops': ['Multi-point quality & diagnostic check before listing', 'Genuine licensed operating system included', 'Cosmetically graded and clearly disclosed', 'Significant savings over brand-new pricing'],
  'custom-pc-builds': ['Hand-assembled and burn-in tested before shipping', 'Cable-managed build for clean airflow', 'Upgrade-friendly standard-size components', 'Ready to play / work out of the box'],
  'processors-motherboards': ['Reliable multi-core performance for gaming & multitasking', 'Energy efficient at stock power limits', 'Compatible with latest chipsets', 'Backed by manufacturer warranty'],
  'graphic-cards': ['Smooth 1080p/1440p gaming performance', 'Ray tracing & DLSS/FSR support on supported titles', 'Triple-fan cooling for lower thermals', 'Compact design fits most cabinets'],
  'ram-storage': ['Plug-and-play, no driver installation required', 'Improves boot time and app responsiveness', 'Built for 24x7 reliability', 'Backed by manufacturer warranty'],
  'cabinets-cooling': ['Tempered glass side panel', 'Tool-free drive bays for quick builds', 'Pre-installed cable management channels', 'Supports up to ATX motherboards'],
  'monitors-screens': ['Slim bezel design for multi-monitor setups', 'Flicker-free, low blue light eye care', 'Wall-mountable (VESA compatible)', 'Wide viewing angles'],
  'keyboards-mice-headphones': ['Plug-and-play, zero setup required', 'Ergonomic design for all-day comfort', 'Reliable connection with low latency', 'Compact enough to carry anywhere'],
  'printers-cartridges': ['Print, scan & copy from one compact device', 'Mobile printing support', 'Low cost-per-page ink system', 'Easy cartridge replacement'],
  'cables-accessories': ['Durable braided / reinforced construction', 'Tested for stable signal & power delivery', 'Universal device compatibility', 'Compact enough to carry in a bag'],
};

const DESC_TEMPLATES = {
  'new-laptops': (p) => `The ${p.brand} ${p.name} is built for everyday performance — a balanced mix of portability, display quality, and battery life that suits students, professionals, and light creative work alike. Backed by a full manufacturer warranty.`,
  'refurbished-laptops': (p) => `This ${p.brand} ${p.name} has been tested and certified by our in-house technicians, with any cosmetic wear clearly disclosed. A dependable way to get enterprise-grade hardware at a fraction of the original price.`,
  'custom-pc-builds': (p) => `A ${p.brand} configuration assembled in-house at AK Computer Solutions and burn-in tested for stability. Components can be customized further — talk to us before you order if you'd like to tweak the spec.`,
  'processors-motherboards': (p) => `${p.brand} ${p.name} delivers dependable performance for gaming, content creation, and everyday multitasking, with full manufacturer warranty support.`,
  'graphic-cards': (p) => `${p.brand} ${p.name} is tuned for smooth frame rates in modern titles while staying cool under sustained load — a solid upgrade for any gaming or creative rig.`,
  'ram-storage': (p) => `${p.brand} ${p.name} is a reliable upgrade pick to speed up an existing laptop or desktop, with plug-and-play installation and no special drivers required.`,
  'cabinets-cooling': (p) => `${p.brand} ${p.name} keeps your build cool, quiet, and easy to work inside, with a clean modern look on your desk.`,
  'monitors-screens': (p) => `${p.brand} ${p.name} pairs crisp visuals with eye-comfort features, suited for long work sessions, study, or casual gaming.`,
  'keyboards-mice-headphones': (p) => `${p.brand} ${p.name} is designed for comfortable daily use, balancing reliability and value for home or office setups.`,
  'printers-cartridges': (p) => `${p.brand} ${p.name} is a dependable choice for home or small-office printing needs, with low running costs and simple setup.`,
  'cables-accessories': (p) => `${p.brand} ${p.name} is a small but essential accessory built to be durable and fully compatible with your existing setup.`,
};

export function getSpecs(product) {
  const fn = SPEC_TEMPLATES[product.category];
  if (!fn) return {};
  return fn(product);
}

export function getFeatures(product) {
  return FEATURE_TEMPLATES[product.category] || [];
}

export function getDescription(product) {
  const fn = DESC_TEMPLATES[product.category];
  return fn ? fn(product) : `${product.brand} ${product.name} — quality you can trust from AK Computer Solutions.`;
}

export function getRating(product) {
  const v = 3.6 + seededRandom(product.id + 'rating')() * 1.4;
  return Math.round(v * 10) / 10;
}

export function getReviewCount(product) {
  return seededInt(product.id + 'rc', 6, 248);
}

export function getSku(product) {
  const prefix = product.category.split('-').map((w) => w[0]).join('').toUpperCase();
  return `AK-${prefix}-${product.id.toUpperCase()}`;
}

export function getStock(product) {
  const r = seededInt(product.id + 'stock', 1, 20);
  if (r === 1) return 'out';
  if (r <= 4) return 'low';
  return 'in';
}

export function getStockQty(product) {
  const stock = getStock(product);
  if (stock === 'out') return 0;
  if (stock === 'low') return seededInt(product.id + 'stockqty', 1, 4);
  return seededInt(product.id + 'stockqty', 8, 60);
}

export function getGalleryImages(product) {
  const extra = [1, 2, 3].map((n) => `https://picsum.photos/seed/${product.id}-g${n}/700/560`);
  return [product.image, ...extra];
}

export function getEmiPerMonth(price, months = 9) {
  return Math.round(price / months);
}

export function getProductFaqs(product) {
  const specs = getSpecs(product);
  return [
    {
      question: 'What warranty does this product come with?',
      answer: specs.Warranty
        ? `This product comes with ${specs.Warranty}, handled directly through our service desk.`
        : 'This product comes with standard seller warranty — check the Warranty tab above for details.',
    },
    {
      question: 'Is Cash on Delivery available?',
      answer: 'Cash on Delivery is available in select pincodes. You can check availability using the delivery pincode field on this page.',
    },
    {
      question: 'Can I pay using EMI?',
      answer: 'Yes, No-Cost EMI is available on this product through major bank debit/credit cards at checkout.',
    },
    {
      question: 'What is the return policy for this product?',
      answer: 'Most products can be returned within 7 days of delivery in original packaging. See our Return Policy page for category-specific exceptions.',
    },
  ];
}

export function getDeliveryEstimate(pincode) {
  if (pincode && /^\d{6}$/.test(pincode)) {
    const days = seededInt(pincode + 'eta', 2, 5);
    return `Usually delivered in ${days} business day${days > 1 ? 's' : ''} to ${pincode}`;
  }
  return 'Enter your pincode to check delivery time';
}
