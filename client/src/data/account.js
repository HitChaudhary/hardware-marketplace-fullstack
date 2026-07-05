import { products } from './products';

export const mockUser = {
  name: 'Aditya Kulkarni',
  email: 'aditya.kulkarni@example.com',
  phone: '+91 98765 43210',
  joined: 'March 2024',
};

export const mockAddresses = [
  {
    id: 'addr-1',
    label: 'Home',
    name: 'Aditya Kulkarni',
    line1: '14, Shree Krishna Society',
    line2: 'Near Andheri Station',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400058',
    phone: '+91 98765 43210',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Office',
    name: 'Aditya Kulkarni',
    line1: '3rd Floor, Tech Park One',
    line2: 'SEEPZ',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400096',
    phone: '+91 98765 43210',
    isDefault: false,
  },
];

const pick = (id) => products.find((p) => p.id === id);

export const mockOrders = [
  {
    id: 'AKC-100245',
    date: '12 Jun 2026',
    status: 'Delivered',
    total: 42500,
    items: [{ product: pick('feat-1'), qty: 1 }],
    tracking: ['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'],
    currentStep: 4,
  },
  {
    id: 'AKC-100198',
    date: '28 May 2026',
    status: 'Shipped',
    total: 28990,
    items: [{ product: pick('gc-1'), qty: 1 }],
    tracking: ['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'],
    currentStep: 2,
  },
  {
    id: 'AKC-100176',
    date: '14 May 2026',
    status: 'Processing',
    total: 5980,
    items: [
      { product: pick('rs-1'), qty: 1 },
      { product: pick('ca-3'), qty: 1 },
    ],
    tracking: ['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'],
    currentStep: 0,
  },
  {
    id: 'AKC-100120',
    date: '02 Apr 2026',
    status: 'Cancelled',
    total: 1690,
    items: [{ product: pick('kh-1'), qty: 1 }],
    tracking: ['Ordered', 'Cancelled'],
    currentStep: 1,
  },
].filter((o) => o.items.every((it) => it.product));
