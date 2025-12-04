import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, Menu, X, Star, ChevronRight, ArrowRight, Trash2, Plus, LogOut, Save, Tag, Upload, Loader2, Image as ImageIcon, Pencil } from 'lucide-react';

const API_URL = "http://localhost:5000/api";

const COMPANY_DETAILS = {
  name: "MRS Cutlery",
  phone: "919278172423",
  displayPhone: "9278172423",
  email: "Mrscutlery@gmail.com"
};

// --- ADMIN LOGIN (Responsive) ---
const AdminLogin = ({ onLogin }) => {
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pass === "admin123") {
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" value={pass} onChange={(e) => setPass(e.target.value)} />
          </div>
          {error && <p className="text-red-500 text-sm">Incorrect password</p>}
          <button type="submit" className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 font-bold transition-transform active:scale-95">Login</button>
        </form>
        <button onClick={() => window.location.reload()} className="w-full text-center mt-6 text-sm text-gray-500 hover:text-black">Back to Website</button>
      </div>
    </div>
  );
};

// --- PRODUCT FORM (Responsive Stacking - UPDATED FOR EDIT) ---
const ProductForm = ({ onSave, onCancel, categories, initialData }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[1] || "All");
  const [image, setImage] = useState("");
  const [desc, setDesc] = useState("");
  const [variants, setVariants] = useState([{ name: "", price: "" }]);
  const [uploading, setUploading] = useState(false);

  // Effect to populate form when editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setCategory(initialData.category || categories[1] || "All");
      setImage(initialData.image || "");
      setDesc(initialData.description || "");
      setVariants(initialData.variants && initialData.variants.length > 0 
        ? initialData.variants 
        : [{ name: "", price: "" }]);
    }
  }, [initialData, categories]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const res = await fetch(`${API_URL}/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      setImage(data.imageUrl);
    } catch (error) {
      alert("Upload failed. Is the server running?");
    }
    setUploading(false);
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedVariants = variants.filter(v => v.name && v.price).map(v => {
      let priceStr = v.price.trim();
      if (!priceStr.startsWith('₹')) priceStr = '₹' + priceStr;
      return { ...v, price: priceStr };
    });
    
    // Pass existing ID if editing
    const productData = { 
      name, 
      category, 
      image, 
      description: desc, 
      variants: processedVariants 
    };

    if (initialData && initialData.id) {
      productData.id = initialData.id;
    }

    onSave(productData);
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200 mb-8 animate-fade-in">
      <h3 className="text-xl font-bold mb-4 border-b pb-2">
        {initialData ? "Edit Product" : "Add New Product"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Responsive Grid: 1 col on mobile, 2 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700">Product Name</label>
            <input required type="text" className="w-full p-2 border rounded" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">Category</label>
            <select className="w-full p-2 border rounded" value={category} onChange={e => setCategory(e.target.value)}>
              {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="border p-4 rounded bg-gray-50">
          <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 font-bold text-sm w-full sm:w-auto justify-center">
              {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
              {uploading ? "Uploading..." : "Choose File"}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
            {image && <img src={image} alt="Preview" className="h-16 w-16 object-contain border bg-white rounded" onError={(e) => e.target.style.display = 'none'} />}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">Description</label>
          <textarea className="w-full p-2 border rounded" rows="2" value={desc} onChange={e => setDesc(e.target.value)}></textarea>
        </div>

        <div className="bg-gray-50 p-3 md:p-4 rounded border border-gray-200">
          <label className="block text-sm font-bold text-gray-700 mb-2">Sizes & Rates</label>
          {variants.map((variant, index) => (
            <div key={index} className="flex gap-2 mb-2 items-center">
              <input placeholder="Size / Type" className="flex-1 p-2 border rounded text-sm min-w-0" value={variant.name} onChange={(e) => handleVariantChange(index, 'name', e.target.value)} />
              <div className="relative w-24 md:w-32 shrink-0">
                <span className="absolute left-2 top-2 text-gray-400 text-sm">₹</span>
                <input placeholder="200" className="w-full p-2 pl-5 md:pl-6 border rounded text-sm" value={variant.price} onChange={(e) => handleVariantChange(index, 'price', e.target.value)} />
              </div>
              <button type="button" onClick={() => setVariants(variants.filter((_, i) => i !== index))} className="text-red-500 p-1"><Trash2 size={18} /></button>
            </div>
          ))}
          <button type="button" onClick={() => setVariants([...variants, { name: "", price: "" }])} className="text-sm text-blue-600 font-bold flex items-center gap-1 mt-2"><Plus size={16} /> Add variant</button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button type="submit" disabled={uploading} className="bg-green-600 text-white px-6 py-3 rounded font-bold hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-50">
            <Save size={18} /> {initialData ? "Update Product" : "Save Product"}
          </button>
          <button type="button" onClick={onCancel} className="bg-gray-200 text-black px-6 py-3 rounded font-bold hover:bg-gray-300 flex items-center justify-center">Cancel</button>
        </div>
      </form>
    </div>
  );
};

// --- CATEGORY MANAGER (Responsive) ---
const CategoryManager = ({ categories, onAdd, onRemove }) => {
  const [newCat, setNewCat] = useState("");
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Tag size={20} /> Manage Categories</h3>
      <div className="flex gap-2 mb-4">
        <input type="text" placeholder="New Category Name..." className="flex-1 p-2 border rounded text-sm" value={newCat} onChange={(e) => setNewCat(e.target.value)} />
        <button onClick={() => { if (newCat) { onAdd(newCat); setNewCat(""); } }} className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 text-sm">Add</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.filter(c => c !== "All").map(cat => (
          <span key={cat} className="bg-gray-100 border border-gray-300 px-3 py-1 rounded-full text-xs md:text-sm flex items-center gap-2">
            {cat} <button onClick={() => onRemove(cat)} className="text-gray-400 hover:text-red-600 font-bold">×</button>
          </span>
        ))}
      </div>
    </div>
  );
};

// --- ADMIN DASHBOARD (Responsive Tables - UPDATED FOR EDIT) ---
const AdminDashboard = ({ products, categories, refreshData, onLogout }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Track which product is being edited

  const handleSaveProduct = async (productData) => {
    let url = `${API_URL}/products`;
    let method = 'POST';

    // If ID exists, it's an update (PUT)
    if (productData.id) {
        url = `${API_URL}/products/${productData.id}`;
        method = 'PUT';
    }

    await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    refreshData();
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Delete this product?")) {
      await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
      refreshData();
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setShowForm(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleAddCategory = async (cat) => {
    await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: cat })
    });
    refreshData();
  };

  const handleRemoveCategory = async (cat) => {
    if (window.confirm(`Remove category ${cat}?`)) {
      await fetch(`${API_URL}/categories/${cat}`, { method: 'DELETE' });
      refreshData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-xl md:text-2xl font-black text-gray-800">Admin Dashboard</h1>
          <button onClick={onLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2 text-sm w-full md:w-auto justify-center"><LogOut size={16} /> Logout</button>
        </div>

        <CategoryManager categories={categories} onAdd={handleAddCategory} onRemove={handleRemoveCategory} />

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <h3 className="text-xl font-bold">Product List ({products.length})</h3>
          {!showForm && <button onClick={handleAddNew} className="bg-black text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-800 shadow-md w-full sm:w-auto justify-center"><Plus size={20} /> Add New Product</button>}
        </div>

        {showForm && (
            <ProductForm 
                onSave={handleSaveProduct} 
                onCancel={() => { setShowForm(false); setEditingProduct(null); }} 
                categories={categories}
                initialData={editingProduct} 
            />
        )}

        {/* RESPONSIVE TABLE WRAPPER */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-bold">
                <tr>
                  <th className="p-4 border-b">Image</th>
                  <th className="p-4 border-b">Name</th>
                  <th className="p-4 border-b">Category</th>
                  <th className="p-4 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b hover:bg-gray-50 last:border-0">
                    <td className="p-4 w-20">
                      {p.image ? (
                        <img src={p.image} className="w-12 h-12 object-contain border rounded bg-white p-1" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                      ) : null}
                      <span className="text-gray-400 text-xs italic" style={{ display: p.image ? 'none' : 'block' }}>No Img</span>
                    </td>
                    <td className="p-4 font-bold text-gray-800 text-sm">{p.name}</td>
                    <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs border border-gray-300">{p.category}</span></td>
                    <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleEditClick(p)} className="text-blue-500 hover:text-blue-700 p-2" title="Edit">
                                <Pencil size={20} />
                            </button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="text-gray-400 hover:text-red-600 p-2" title="Delete">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && <p className="p-8 text-center text-gray-500">No products found. Is the server running?</p>}
        </div>
      </div>
    </div>
  );
};

// --- PUBLIC WEBSITE ---
const WebsiteView = ({ products, categories, onAdminClick }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-red-200 selection:text-red-900">
      <nav className="fixed w-full bg-black/95 backdrop-blur-md z-50 border-b border-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center">
              <a href="#">
                <img src="/images/logo.jpg" alt="MRS Cutlery" className="h-12 w-auto object-contain" />
              </a>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-300 hover:text-white font-medium transition-colors text-sm uppercase tracking-wide">Home</a>
              <a href="#catalog" className="text-gray-300 hover:text-white font-medium transition-colors text-sm uppercase tracking-wide">Catalog</a>
              <a href={`https://wa.me/${COMPANY_DETAILS.phone}`} className="flex items-center gap-2 text-white font-bold bg-red-600 border border-red-600 px-6 py-2 rounded-full hover:bg-white hover:text-red-600 transition-all duration-300 shadow-lg shadow-red-900/20">
                <Phone size={16} />
                <span>{COMPANY_DETAILS.displayPhone}</span>
              </a>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2 hover:bg-gray-800 rounded-md transition-colors">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-black border-b border-gray-800">
              <div className="px-4 pt-2 pb-6 space-y-1">
                <a href="#" className="block px-3 py-3 text-base font-bold text-gray-300 hover:bg-gray-900 hover:text-white rounded-md">Home</a>
                <a href="#catalog" className="block px-3 py-3 text-base font-bold text-gray-300 hover:bg-gray-900 hover:text-white rounded-md">Catalog</a>
                <a href={`https://wa.me/${COMPANY_DETAILS.phone}`} className="block px-3 py-3 text-base font-bold text-red-500">WhatsApp Us</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>


      <header className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-50 -z-10 rounded-bl-[100px] hidden lg:block"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-red-50 rounded-full blur-3xl -z-10 opacity-60"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <span className="text-red-600 font-bold tracking-widest text-xs md:text-sm uppercase mb-4 block">Est. 2025 • High Quality Kitchenware</span>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-gray-900 leading-tight mb-6">Simple.<br /> Durable.<br /> <span className="italic text-gray-500">Essential.</span></h1>
                <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 font-light">We craft professional-grade cutlery, racks, and tools designed for the modern Indian kitchen.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a href="#catalog" className="px-8 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 shadow-lg flex items-center justify-center gap-2">Browse Catalog <ArrowRight size={18} /></a>
                  <a href={`https://wa.me/${COMPANY_DETAILS.phone}`} className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:border-black transition-all flex items-center justify-center">Contact Sales</a>
                </div>
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative hidden md:block">
              <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden shadow-2xl relative group">
                <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center text-gray-300">
                  <div className="text-center"><Star size={80} strokeWidth={0.5} className="mx-auto mb-4 text-red-300" /><p className="font-serif text-2xl text-gray-400">Kitchen Essentials</p></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      <section id="catalog" className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-black uppercase tracking-tight">Product Catalog</h2>
            <div className="h-1 w-20 bg-red-600 mt-4"></div>
          </div>

          <div className="flex flex-wrap gap-2 mb-10 border-b border-gray-200 pb-4 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${activeCategory === cat ? 'border-red-600 text-red-700 bg-red-50' : 'border-transparent text-gray-500 hover:text-black hover:bg-gray-50'}`}>{cat}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode='popLayout'>
              {filteredProducts.map((product) => (
                <motion.div key={product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col bg-white border border-gray-300 rounded-lg overflow-hidden hover:border-red-500 transition-colors duration-300 h-full">
                  <div className="bg-gray-100 h-56 flex items-center justify-center border-b border-gray-200 relative shrink-0 overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 hover:scale-110 transition-transform duration-500" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                    ) : null}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ display: product.image ? 'none' : 'flex' }}>
                      <div className="text-gray-300 flex flex-col items-center"><ImageIcon size={48} strokeWidth={1} /><span className="text-xs mt-2">No Image</span></div>
                    </div>
                    <span className="absolute top-2 right-2 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm z-10">{product.category}</span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div>
                      <h3 className="text-lg font-bold text-black mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 leading-snug">{product.description}</p>
                      <div className="border border-gray-200 rounded-md overflow-hidden mb-4">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200">
                            <tr><th className="px-3 py-2">Size / Type</th><th className="px-3 py-2 text-right whitespace-nowrap w-24">Rate</th></tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {product.variants.map((v, idx) => (
                              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-3 py-2 text-gray-700 align-top">{v.name}</td>
                                <td className="px-3 py-2 text-right font-bold text-black align-top whitespace-nowrap">{v.price}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="mt-auto pt-2">
                      <a href={`https://wa.me/${COMPANY_DETAILS.phone}?text=I am interested in ${product.name}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg text-sm transition-colors gap-2"><MessageCircle size={16} /><span>Check Availability</span></a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <footer className="bg-black text-white py-16 border-t-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
              <div>
                <img
                  src="\images\logo.jpg"
                  alt="MRS Cutlery Logo"
                  className="h-16 w-auto mb-4 mx-auto md:mx-0"
                />
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h4 className="text-lg font-bold mb-6 text-white border-b-2 border-red-600 pb-2 inline-block">Contact</h4>
              <p className="text-gray-300 mb-3 flex items-center gap-3"><Phone size={14} /> {COMPANY_DETAILS.displayPhone}</p>
              <a href={`https://wa.me/${COMPANY_DETAILS.phone}`} className="mt-8 inline-block bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full text-sm font-bold transition-colors">Chat on WhatsApp</a>
            </div>
          </div>
          <div className="border-t border-gray-900 mt-16 pt-8 text-center text-gray-600 text-sm flex justify-between items-center flex-col md:flex-row">
            <span>© {new Date().getFullYear()} Jain Enterprises. All rights reserved.</span>
            <button onClick={onAdminClick} className="text-gray-800 hover:text-gray-600 text-xs mt-4 md:mt-0">Admin Login</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- MAIN APP CONTROLLER ---
export default function App() {
  const [view, setView] = useState('website'); // 'website', 'login', 'admin'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/data`);
      if (!res.ok) throw new Error("Server not responding");
      const data = await res.json();
      setProducts(data.products || []);
      setCategories(data.categories || []);
    } catch (e) {
      console.error("Backend not running or error fetching data", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdminClick = () => setView('login');
  const handleLoginSuccess = () => setView('admin');
  const handleLogout = () => setView('website');

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-10 h-10 animate-spin text-red-600" /></div>
  }

  return (
    <>
      {view === 'website' && <WebsiteView products={products} categories={categories} onAdminClick={handleAdminClick} />}
      {view === 'login' && <AdminLogin onLogin={handleLoginSuccess} />}
      {view === 'admin' && <AdminDashboard products={products} categories={categories} refreshData={fetchData} onLogout={handleLogout} />}
    </>
  );
}