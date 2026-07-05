// Static category data — this mirrors what a future /api/categories
// endpoint (Express + MongoDB) would return. Swap the import in
// pages/Home.jsx and pages/CategoryPage.jsx for a fetch() call once
// the backend is ready; the shape below can stay the same.

export const categories = [
  {
    slug: 'new-laptops',
    name: 'Brand New Laptops',
    icon: '💻',
    description: 'Latest-generation laptops from leading brands, sealed in box.',
  },
  {
    slug: 'refurbished-laptops',
    name: 'Refurbished Laptops',
    icon: '♻️',
    description: 'Certified, tested, and reliable pre-owned laptops at honest prices.',
  },
  {
    slug: 'custom-pc-builds',
    name: 'Custom PC Builds',
    icon: '🖥️',
    description: 'Gaming rigs and workstations assembled and stress-tested in-house.',
  },
  {
    slug: 'processors-motherboards',
    name: 'Processors & Motherboards',
    icon: '🧩',
    description: 'Intel & AMD processors paired with the right motherboard.',
  },
  {
    slug: 'graphic-cards',
    name: 'Graphic Cards',
    icon: '🎮',
    description: 'NVIDIA and AMD GPUs for gaming, editing, and rendering.',
  },
  {
    slug: 'ram-storage',
    name: 'RAM & Storage',
    icon: '💾',
    description: 'RAM kits, NVMe SSDs, SATA SSDs, HDDs, and pendrives.',
  },
  {
    slug: 'cabinets-cooling',
    name: 'Cabinets & Cooling',
    icon: '🌀',
    description: 'PC cabinets, AIO liquid coolers, and air coolers.',
  },
  {
    slug: 'monitors-screens',
    name: 'Monitors & Screens',
    icon: '🖼️',
    description: 'Laptop and desktop screens for work, study, and gaming.',
  },
  {
    slug: 'keyboards-mice-headphones',
    name: 'Keyboards, Mice & Headphones',
    icon: '⌨️',
    description: 'Wired and wireless input devices plus headphones.',
  },
  {
    slug: 'printers-cartridges',
    name: 'Printers & Cartridges',
    icon: '🖨️',
    description: 'Printers, ink, toner powder, and cartridges.',
  },
  {
    slug: 'cables-accessories',
    name: 'Cables & Accessories',
    icon: '🔌',
    description: 'Power cables, VGA/HDMI cables, stands, adapters & cleaning kits.',
  },
];

export const getCategoryBySlug = (slug) =>
  categories.find((c) => c.slug === slug);
