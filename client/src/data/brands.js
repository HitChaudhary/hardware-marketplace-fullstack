// Static brand data for /brand/:slug pages and the brand strip in navigation/footer.

export const brands = [
  {
    slug: 'dell',
    name: 'Dell',
    tagline: 'Reliable laptops and desktops for work and play',
    banner: 'https://picsum.photos/seed/brand-dell/1200/360',
  },
  {
    slug: 'hp',
    name: 'HP',
    tagline: 'Everyday computing and enterprise-grade reliability',
    banner: 'https://picsum.photos/seed/brand-hp/1200/360',
  },
  {
    slug: 'lenovo',
    name: 'Lenovo',
    tagline: 'ThinkPad durability meets modern performance',
    banner: 'https://picsum.photos/seed/brand-lenovo/1200/360',
  },
  {
    slug: 'asus',
    name: 'ASUS',
    tagline: 'Gaming-first design with serious performance',
    banner: 'https://picsum.photos/seed/brand-asus/1200/360',
  },
  {
    slug: 'acer',
    name: 'Acer',
    tagline: 'Affordable performance for school, work, and gaming',
    banner: 'https://picsum.photos/seed/brand-acer/1200/360',
  },
  {
    slug: 'intel',
    name: 'Intel',
    tagline: 'Processors that power millions of PCs worldwide',
    banner: 'https://picsum.photos/seed/brand-intel/1200/360',
  },
  {
    slug: 'amd',
    name: 'AMD',
    tagline: 'High core-count performance for gaming & creation',
    banner: 'https://picsum.photos/seed/brand-amd/1200/360',
  },
  {
    slug: 'nvidia',
    name: 'NVIDIA',
    tagline: 'GeForce graphics for every kind of gamer',
    banner: 'https://picsum.photos/seed/brand-nvidia/1200/360',
  },
];

export const getBrandBySlug = (slug) =>
  brands.find((b) => b.slug === slug.toLowerCase());

export const slugifyBrand = (name) => name.toLowerCase().replace(/\s+/g, '-');
