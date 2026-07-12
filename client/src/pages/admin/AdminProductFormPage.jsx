import { useState, useEffect } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useProductStore } from '../../context/ProductStoreContext';
import { categories } from '../../data/categories';
import { apiFetch } from '../../utils/api';

const BADGES = ['', 'sale', 'new', 'hot', 'refurb'];

const inputCls = "w-full px-3 py-2.5 rounded-lg bg-s1 border border-b2 text-t1 text-sm outline-none focus:border-acc transition-colors";
const selectCls = `${inputCls} cursor-pointer`;
const textareaCls = "w-full px-3 py-2.5 rounded-lg bg-s1 border border-b2 text-t1 text-sm outline-none focus:border-acc transition-colors resize-y min-h-[100px]";

// Helper utility to auto-generate slugs cleanly
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')         // Replace spaces with -
    .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
    .replace(/\-\-+/g, '-');       // Replace multiple - with single -
};

export default function AdminProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { getProduct, addProduct, updateProduct } = useProductStore();

  // Guard Clause: Verify item exists if we are explicitly editing a target ID
  const existing = isEdit ? getProduct(id) : null;

  // Form State Definition matching the Mongoose Schema parameters completely
  const [form, setForm] = useState({
    name: '',
    slug: '',
    brand: '',
    category: categories[0]?.slug || '',
    price: '',
    oldPrice: '',
    badge: '',
    image: '',
    description: '',
    featured: false,
    inStock: true,
    stockQty: '',
    specs: {
      ram: '',
      storage: '',
      processor: '',
      graphics: '',
      display: '',
      battery: '',
      weight: '',
      cooler: ''
    }
  });

  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Effect: Hydrate form schema fields if target item updates or mounts
  useEffect(() => {
    if (isEdit && existing) {
      setForm({
        name: existing.name || '',
        slug: existing.slug || '',
        brand: existing.brand || '',
        category: existing.category || categories[0]?.slug || '',
        price: existing.price ?? '',
        oldPrice: existing.oldPrice ?? '',
        badge: existing.badge || '',
        image: existing.image || '',
        description: existing.description || '',
        featured: existing.featured === true,
        inStock: existing.inStock !== false,
        stockQty: existing.stockQty ?? '',
        specs: {
          ram: existing.specs?.ram || '',
          storage: existing.specs?.storage || '',
          processor: existing.specs?.processor || '',
          graphics: existing.specs?.graphics || '',
          display: existing.specs?.display || '',
          battery: existing.specs?.battery || '',
          weight: existing.specs?.weight || '',
          cooler: existing.specs?.cooler || ''
        }
      });
    }
  }, [id, isEdit, existing]);

  // If we are editing but no entry matches your state array, kick back to overview safely
  if (isEdit && !existing) {
    return <Navigate to="/admin/products" replace />;
  }

  // Universal Base Input Tracker
  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    
    setForm((f) => {
      const updated = { ...f, [field]: value };
      // Auto-populate slug when modifying the name (only on new items)
      if (field === 'name' && !isEdit) {
        updated.slug = slugify(value);
      }
      return updated;
    });
  };

  // Dedicated nested input field tracker for Mixed Specification Schemas
  const setSpec = (specName) => (e) => {
    const { value } = e.target;
    setForm((f) => ({
      ...f,
      specs: {
        ...f.specs,
        [specName]: value
      }
    }));
  };

  // Binary Image File Stream Pipeline Handler (Cloudinary Endpoint)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setUploading(true);
    
    const data = new FormData();
    data.append('image', file);

    try {
      const resData = await apiFetch('/products/upload-image', {
        method: 'POST',
        body: data,
        authAs: 'admin', 
      });

      if (resData && resData.success) {
        setForm((prev) => ({ ...prev, image: resData.imageUrl }));
      } else {
        setError(resData?.message || 'Failed to upload image asset.');
      }
    } catch (err) {
      console.error('Image Upload Error:', err);
      setError(err.message || 'Could not communicate with the server upload pipeline.');
    } finally {
      setUploading(false);
    }
  };

  // Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Primary Field Validations based on Schema "required: true" properties
    if (!form.name.trim() || !form.slug.trim() || !form.brand.trim() || !form.category.trim() || form.price === '') {
      setError('Product Name, Slug, Brand, Category, and Price fields are mandatory.');
      return;
    }

    if (!form.image) {
      setError('Please upload a product image before saving.');
      return;
    }

    if (uploading) return;

    // Filter out completely blank technical specs so empty strings don't clutter the database record
    const cleanedSpecs = {};
    Object.keys(form.specs).forEach(key => {
      if (form.specs[key] && form.specs[key].toString().trim()) {
        cleanedSpecs[key] = form.specs[key].toString().trim();
      }
    });

    const payload = {
      ...form,
      specs: cleanedSpecs
    };

    try {
      if (isEdit) {
        await updateProduct(id, payload);
      } else {
        await addProduct(payload);
      }
      
      setSaved(true);
      setTimeout(() => navigate('/admin/products'), 800);
    } catch (err) {
      setError(err.message || 'Failed to save product to database catalog.');
    }
  };

  // Simple clean evaluation to track if the item classified belongs to a laptop category
  const showLaptopSpecs = form.category.toLowerCase().includes('laptop');

  return (
    <div className="space-y-5 px-1 sm:px-0">
      
      {/* Dynamic Header Info Banner */}
      <div>
        <h2 className="text-2xl font-extrabold text-t1 tracking-tight">
          {isEdit ? 'Edit Product' : 'Add Product'}
        </h2>
        <p className="text-sm text-t3 mt-1">
          {isEdit ? `Updating catalog values for: ${existing?.name}` : 'Fill in the specifications below to register a new unit to the computer store index.'}
        </p>
      </div>

      {/* Main Core Form Card Container */}
      <div className="bg-s2 border border-b1 rounded-card shadow-card p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg font-medium">
              ⚠️ {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-t3">Product Title</label>
              <input className={inputCls} placeholder="e.g. ASUS ROG Zephyrus G16" value={form.name} onChange={set('name')} required />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-t3">SEO URL Slug</label>
              <input className={inputCls} placeholder="e.g. asus-rog-zephyrus-g16" value={form.slug} onChange={set('slug')} required />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-t3">Brand Namespace</label>
              <input className={inputCls} placeholder="e.g. ASUS, Lenovo, HP" value={form.brand} onChange={set('brand')} required />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-t3">Category Classification</label>
              <select className={selectCls} value={form.category} onChange={set('category')}>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-t3">Sale Price (₹)</label>
              <input className={inputCls} placeholder="Selling Price amount" type="number" min="0" value={form.price} onChange={set('price')} required />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-t3">Old Listing Price (MSRP, Optional)</label>
              <input className={inputCls} placeholder="Original list price" type="number" min="0" value={form.oldPrice} onChange={set('oldPrice')} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-t3">Visual Promo Tag Badge</label>
              <select className={selectCls} value={form.badge} onChange={set('badge')}>
                <option value="">No Badge Activated</option>
                {BADGES.filter(Boolean).map((b) => <option key={b} value={b}>{b.toUpperCase()}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-t3">Available Inventory Stock Units</label>
              <input className={inputCls} placeholder="Items count total" type="number" min="0" value={form.stockQty} onChange={set('stockQty')} />
            </div>

            {/* Contextual Technical Specs Expansion Panel */}
            {showLaptopSpecs && (
              <div className="sm:col-span-2 p-4 bg-s1 border border-b2 rounded-xl space-y-4 animate-fadeIn">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-acc border-b border-b2 pb-1.5 flex items-center gap-2">
                  💻 Laptop Architectural Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase text-t3">System Memory (RAM)</label>
                    <input className={inputCls} placeholder="e.g. 16GB DDR5 5600MHz" value={form.specs.ram} onChange={setSpec('ram')} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase text-t3">Primary Storage / SSD</label>
                    <input className={inputCls} placeholder="e.g. 1TB NVMe PCIe Gen4 SSD" value={form.specs.storage} onChange={setSpec('storage')} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase text-t3">Processor Core (CPU)</label>
                    <input className={inputCls} placeholder="e.g. Intel Core i7-14700HX" value={form.specs.processor} onChange={setSpec('processor')} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase text-t3">Graphics Controller (GPU)</label>
                    <input className={inputCls} placeholder="e.g. NVIDIA RTX 4060 8GB (140W)" value={form.specs.graphics} onChange={setSpec('graphics')} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase text-t3">Display</label>
                    <input className={inputCls} placeholder="e.g. 15.6&quot; FHD IPS 144Hz" value={form.specs.display} onChange={setSpec('display')} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase text-t3">Battery</label>
                    <input className={inputCls} placeholder="e.g. 4-Cell, up to 10 hrs" value={form.specs.battery} onChange={setSpec('battery')} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase text-t3">Weight</label>
                    <input className={inputCls} placeholder="e.g. 1.69 kg" value={form.specs.weight} onChange={setSpec('weight')} />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[11px] font-bold uppercase text-t3">Cooling Solution / Thermal System (Optional)</label>
                    <input className={inputCls} placeholder="e.g. Dual-Fan Liquid Metal Vapor Chamber" value={form.specs.cooler} onChange={setSpec('cooler')} />
                  </div>
                </div>
              </div>
            )}

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-t3">Product Description</label>
              <textarea className={textareaCls} placeholder="Write high-level copy details or marketing features..." value={form.description} onChange={set('description')} />
            </div>
            
            {/* Responsive Cloudinary Image Dropzone Interface Module */}
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-t3 block">Product Image Display Asset</label>
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-dashed border-b2 rounded-lg bg-s1 w-full">
                
                {form.image ? (
                  <div className="relative w-24 h-24 rounded-md overflow-hidden border border-b1 shrink-0 bg-white p-1 shadow-sm flex items-center justify-center">
                    <img 
                      src={form.image} 
                      alt="Product media upload thumbnail preview" 
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, image: '' }))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-600 shadow transition-colors"
                      title="Purge Image Link"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-s2 rounded-md border border-b1 flex items-center justify-center text-2xl shrink-0 text-slate-400" title="Placeholder Empty box">
                    📷
                  </div>
                )}

                {/* Local Uploader Action Controls triggers */}
                <div className="flex-1 w-full text-center sm:text-left space-y-1">
                  <label className={`
                    inline-block px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all w-full sm:w-auto text-center
                    ${uploading ? 'bg-b2 text-t3 cursor-not-allowed' : 'bg-acc-g text-white hover:opacity-90 shadow-md'}
                  `}>
                    {uploading ? 'Piping Stream to Cloudinary...' : '📁 Choose Product Image File'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload} 
                      disabled={uploading} 
                    />
                  </label>
                  <p className="text-[11px] text-t3">Accepts web extension formats up to a maximum file footprint size of 5MB.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <label className="flex items-center gap-3 cursor-pointer select-none text-sm text-t2 font-medium">
              <input type="checkbox" checked={form.inStock} onChange={set('inStock')} className="w-4 h-4 accent-acc rounded" />
              Set immediate stock visibility tracking (Visible inside storefront catalog indices if checked)
            </label>

            <label className="flex items-center gap-3 cursor-pointer select-none text-sm text-t2 font-medium">
              <input type="checkbox" checked={form.featured} onChange={set('featured')} className="w-4 h-4 accent-acc rounded" />
              Feature this product (Will prioritize placement in hero sliders/featured sections)
            </label>
          </div>

          {/* Submit Action Block Buttons footer layouts */}
          <div className="flex items-center gap-3 pt-3 border-t border-b1">
            <button 
              type="submit" 
              disabled={uploading || saved}
              className={`px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition-all shadow-sm ${uploading || saved ? 'bg-b2 text-t3 cursor-not-allowed' : 'bg-acc-g hover:opacity-90'}`}
            >
              {saved ? 'Processing...' : (isEdit ? 'Save Changes' : 'Add Product')}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/admin/products')}
              className="px-5 py-2.5 rounded-lg bg-s1 border border-b2 text-t1 text-sm font-semibold hover:border-b3 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            {saved && (
              <span className="text-grn text-sm font-bold flex items-center gap-1 animate-pulse">
                ✓ Saved Successfully! Redirecting...
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}