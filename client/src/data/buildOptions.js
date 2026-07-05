// Component options for the Build Your PC tool. `socket` is used for a
// simple CPU <-> Motherboard compatibility check.

export const buildOptions = {
  cpu: [
    { id: 'cpu-1', name: 'Intel Core i3-12100F', price: 8490, socket: 'LGA1700' },
    { id: 'cpu-2', name: 'Intel Core i5-13400F', price: 16990, socket: 'LGA1700' },
    { id: 'cpu-3', name: 'AMD Ryzen 5 5600X', price: 13990, socket: 'AM4' },
    { id: 'cpu-4', name: 'AMD Ryzen 7 7700X', price: 27990, socket: 'AM5' },
  ],
  motherboard: [
    { id: 'mb-1', name: 'Gigabyte B660M DS3H (DDR4)', price: 9490, socket: 'LGA1700' },
    { id: 'mb-2', name: 'MSI B550 Gaming Plus', price: 10990, socket: 'AM4' },
    { id: 'mb-3', name: 'ASUS TUF B650-PLUS', price: 16990, socket: 'AM5' },
  ],
  ram: [
    { id: 'ram-1', name: 'Corsair Vengeance 16GB DDR4 3200MHz', price: 2890 },
    { id: 'ram-2', name: 'Kingston FURY 32GB DDR4 3600MHz', price: 5690 },
    { id: 'ram-3', name: 'Kingston FURY 32GB DDR5 5200MHz', price: 7990 },
  ],
  gpu: [
    { id: 'gpu-0', name: 'No Dedicated GPU (Integrated Graphics)', price: 0 },
    { id: 'gpu-1', name: 'NVIDIA GTX 1650 4GB', price: 12990 },
    { id: 'gpu-2', name: 'NVIDIA RTX 4060 8GB', price: 28990 },
    { id: 'gpu-3', name: 'NVIDIA RTX 4070 12GB', price: 52990 },
  ],
  storage: [
    { id: 'sto-1', name: '500GB NVMe SSD', price: 2990 },
    { id: 'sto-2', name: '1TB NVMe SSD', price: 5490 },
    { id: 'sto-3', name: '2TB Desktop HDD', price: 5290 },
  ],
  cabinet: [
    { id: 'cab-1', name: 'Ant Esports ICE-100 Mid Tower', price: 2390 },
    { id: 'cab-2', name: 'Deepcool MATREXX 30 Micro-ATX', price: 2890 },
    { id: 'cab-3', name: 'Ant Esports ICE-300 ATX RGB', price: 3990 },
  ],
  psu: [
    { id: 'psu-1', name: '450W 80+ Bronze', price: 2490 },
    { id: 'psu-2', name: '650W 80+ Bronze', price: 3990 },
    { id: 'psu-3', name: '750W 80+ Gold', price: 5990 },
  ],
  cooler: [
    { id: 'cool-1', name: 'Stock Air Cooler', price: 0 },
    { id: 'cool-2', name: 'Deepcool AK400 Air Cooler', price: 2190 },
    { id: 'cool-3', name: 'Cooler Master 240mm AIO Liquid Cooler', price: 6490 },
  ],
};

export const buildSteps = [
  { key: 'cpu', label: 'Processor', required: true },
  { key: 'motherboard', label: 'Motherboard', required: true },
  { key: 'ram', label: 'RAM', required: true },
  { key: 'gpu', label: 'Graphics Card', required: false },
  { key: 'storage', label: 'Storage', required: true },
  { key: 'cabinet', label: 'Cabinet', required: true },
  { key: 'psu', label: 'Power Supply', required: true },
  { key: 'cooler', label: 'Cooler', required: false },
];
