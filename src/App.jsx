import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, Menu, X, Star, ChevronRight, ArrowRight, Trash2, Plus, LogOut, Save, Tag, Upload } from 'lucide-react';

// --- INITIAL DATA ---
const COMPANY_DETAILS = {
  name: "MRS Cutlery",
  phone: "919278172423",
  displayPhone: "9278172423",
  email: "Mrscutlery@gmail.com"
};

const INITIAL_CATEGORIES = [
  "All",
  "Racks & Storage",
  "Roasters",
  "Trolleys & Stands",
  "Kitchen Tools",
  "Mashers",
  "Cutlery",
  "Whisks"
];

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Kitchen Rack & Storage",
    category: "Racks & Storage",
    image: "/images/rack.jpg",
    description: "High-quality storage solutions for kitchen organization.",
    variants: [
      { name: "Rack Square Pipe", price: "₹232 / KG" },
      { name: "Rack Wire - Normal", price: "₹185 / KG" },
      { name: "Shelf", price: "₹232 / KG" },
    ]
  },
  {
    id: 2,
    name: "Roasters (Wood Handle)",
    category: "Roasters",
    image: "/images/wood-roaster.jpg",
    description: "Premium wooden handle roasters.",
    variants: [
      { name: "Round Small (10\")", price: "₹35 / pcs" },
      { name: "Square Small (10\")", price: "₹35 / pcs" },
    ]
  },
  {
    id: 3,
    name: "Roasters (Steel Handle)",
    category: "Roasters",
    image: "/images/steel-handle.jpg",
    description: "Durable steel handle roasters.",
    variants: [
      { name: "Round Small", price: "₹62 / pcs" },
      { name: "Square Small", price: "₹72 / pcs" },
    ]
  },
  {
    id: 9,
    name: "14 Gauge Premium Cutlery",
    category: "Cutlery",
    image: "", 
    description: "Heavy 14 gauge stainless steel cutlery.",
    variants: [
      { name: "Masala Spoon", price: "₹125 / Dozen" },
      { name: "Tea Spoon", price: "₹145 / Dozen" },
    ]
  }
];

// --- ADMIN COMPONENTS ---

const AdminLogin = ({ onLogin }) => {
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

// password Change //
  
  const handleLogin = (e) => {
    e.preventDefault();
    if (pass === "admin123") {    
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">Incorrect password</p>}
          <button type="submit" className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800">Login</button>
        </form>
        <div className="mt-4 text-center">
            <button onClick={() => window.location.reload()} className="text-sm text-gray-500 hover:text-black">Back to Website</button>
        </div>
      </div>
    </div>
  );
};

const ProductForm = ({ onSave, onCancel, categories }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories.length > 1 ? categories[1] : ""); 
  const [image, setImage] = useState("");
  const [desc, setDesc] = useState("");
  const [variants, setVariants] = useState([{ name: "", price: "" }]);

  // Handle File Upload via FileReader
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) {
        alert("File is too big! Please choose an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { name: "", price: "" }]);
  };

  const removeVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // --- AUTO ADD RUPEE SYMBOL LOGIC ---
    const processedVariants = variants.filter(v => v.name && v.price).map(v => {
        let priceStr = v.price.trim();
        // If it doesn't start with ₹, add it
        if (!priceStr.startsWith('₹')) {
            priceStr = '₹' + priceStr;
        }
        return { ...v, price: priceStr };
    });

    const newProduct = {
      id: Date.now(),
      name,
      category,
      image,
      description: desc,
      variants: processedVariants
    };
    onSave(newProduct);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8 animate-fade-in">
      <h3 className="text-xl font-bold mb-4 border-b pb-2">Add New Product</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700">Product Name</label>
            <input required type="text" className="w-full p-2 border rounded focus:ring-red-500" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">Category</label>
            <select className="w-full p-2 border rounded" value={category} onChange={e => setCategory(e.target.value)}>
              {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* IMAGE UPLOAD SECTION */}
        <div className="border p-4 rounded bg-gray-50">
          <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 font-bold text-sm">
              <Upload size={16}/> Choose File
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            <span className="text-xs text-gray-500">Max 2MB</span>
          </div>
          
          {/* Image Preview */}
          {image && (
            <div className="mt-3">
              <p className="text-xs text-green-600 font-bold mb-1">Image Loaded:</p>
              <img src={image} alt="Preview" className="h-24 w-24 object-contain border bg-white rounded" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">Description</label>
          <textarea className="w-full p-2 border rounded" rows="2" value={desc} onChange={e => setDesc(e.target.value)}></textarea>
        </div>

        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <label className="block text-sm font-bold text-gray-700 mb-2">Sizes & Rates</label>
          {variants.map((variant, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input 
                placeholder="Size / Type (e.g. Small)" 
                className="flex-1 p-2 border rounded" 
                value={variant.name} 
                onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
              />
              <div className="relative w-32">
                <span className="absolute left-2 top-2 text-gray-400">₹</span>
                <input 
                    placeholder="200 / pcs" 
                    className="w-full p-2 pl-6 border rounded" 
                    value={variant.price} 
                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                />
              </div>
              <button type="button" onClick={() => removeVariant(index)} className="text-red-500 hover:text-red-700"><Trash2 size={18}/></button>
            </div>
          ))}
          <button type="button" onClick={addVariant} className="text-sm text-blue-600 font-bold flex items-center gap-1 mt-2">
            <Plus size={16}/> Add another variant
          </button>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 flex items-center gap-2">
            <Save size={18}/> Save Product
          </button>
          <button type="button" onClick={onCancel} className="bg-gray-300 text-black px-6 py-2 rounded font-bold hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const CategoryManager = ({ categories, setCategories }) => {
  const [newCat, setNewCat] = useState("");

  const addCategory = () => {
    if (newCat && !categories.includes(newCat)) {
      setCategories([...categories, newCat]);
      setNewCat("");
    }
  };

  const removeCategory = (cat) => {
    if (window.confirm(`Delete category "${cat}"?`)) {
      setCategories(categories.filter(c => c !== cat));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Tag size={20}/> Manage Categories</h3>
      
      <div className="flex gap-2 mb-4">
        <input 
          type="text" 
          placeholder="New Category Name..." 
          className="flex-1 p-2 border rounded"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
        />
        <button onClick={addCategory} className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700">
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.filter(c => c !== "All").map(cat => (
          <span key={cat} className="bg-gray-100 border border-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
            {cat}
            <button onClick={() => removeCategory(cat)} className="text-gray-400 hover:text-red-600 font-bold">×</button>
          </span>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = ({ products, setProducts, categories, setCategories, onLogout }) => {
  const [showForm, setShowForm] = useState(false);

  // Load Categories & Products on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('mrs_products');
    const savedCategories = localStorage.getItem('mrs_categories');
    
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedCategories) setCategories(JSON.parse(savedCategories));
  }, []);

  // Save whenever they change
  useEffect(() => {
    localStorage.setItem('mrs_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mrs_categories', JSON.stringify(categories));
  }, [categories]);

  const handleAddProduct = (newProduct) => {
    setProducts([newProduct, ...products]);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if(window.confirm("Delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-2xl md:text-3xl font-black text-gray-800">Admin Dashboard</h1>
          <button onClick={onLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2">
            <LogOut size={18}/> <span className="hidden md:inline">Logout</span>
          </button>
        </div>

        {/* --- Category Management --- */}
        <CategoryManager categories={categories} setCategories={setCategories} />

        {/* --- Product Management --- */}
        <div className="mb-6 flex justify-between items-end">
            <h3 className="text-xl font-bold">Product List ({products.length})</h3>
            {!showForm && (
            <button onClick={() => setShowForm(true)} className="bg-black text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-800 shadow-md transition-transform hover:-translate-y-1">
                <Plus size={20}/> Add New Product
            </button>
            )}
        </div>

        {showForm && (
          <ProductForm onSave={handleAddProduct} onCancel={() => setShowForm(false)} categories={categories} />
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
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
                        <img src={p.image} className="w-12 h-12 object-contain border rounded bg-white p-1"/> 
                    ) : <span className="text-gray-400 text-xs italic">No Img</span>}
                  </td>
                  <td className="p-4 font-bold text-gray-800">{p.name}</td>
                  <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs border border-gray-300">{p.category}</span></td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-600 p-2 transition-colors" title="Delete">
                      <Trash2 size={20}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p className="p-8 text-center text-gray-500">No products found. Add one above!</p>}
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
      
      {/* NAVBAR */}
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

      {/* HERO */}
      <header className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-50 -z-10 rounded-bl-[100px] hidden lg:block"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-red-50 rounded-full blur-3xl -z-10 opacity-60"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <span className="text-red-600 font-bold tracking-widest text-sm uppercase mb-4 block">Est. 2025 • High Quality Kitchenware</span>
                <h1 className="text-5xl lg:text-7xl font-serif text-gray-900 leading-tight mb-6">Simple.<br/> Durable.<br/> <span className="italic text-gray-500">Essential.</span></h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 font-light">We craft professional-grade cutlery, racks, and tools designed for the modern Indian kitchen.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a href="#catalog" className="px-8 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2">Browse Catalog <ArrowRight size={18}/></a>
                  <a href={`https://wa.me/${COMPANY_DETAILS.phone}`} className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:border-black hover:text-black transition-all flex items-center justify-center">Contact Sales</a>
                </div>
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
              <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden shadow-2xl relative group">
                <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center text-gray-300">
                  <div className="text-center"><Star size={80} strokeWidth={0.5} className="mx-auto mb-4 text-red-300" /><p className="font-serif text-2xl text-gray-400">Kitchen Essentials</p></div>
                </div>
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-6 py-3 rounded-lg shadow-sm border border-white">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Best Seller</p>
                  <p className="text-lg font-serif text-gray-900">14 Gauge Cutlery</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* CATALOG */}
      <section id="catalog" className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-black uppercase tracking-tight">Product Catalog</h2>
            <div className="h-1 w-20 bg-red-600 mt-4"></div>
          </div>

          {/* DYNAMIC CATEGORY BUTTONS */}
          <div className="flex flex-wrap gap-2 mb-10 border-b border-gray-200 pb-4">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors border-b-2 ${activeCategory === cat ? 'border-red-600 text-red-700 bg-red-50' : 'border-transparent text-gray-500 hover:text-black hover:bg-gray-50'}`}>{cat}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode='popLayout'>
              {filteredProducts.map((product) => (
                <motion.div key={product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col bg-white border border-gray-300 rounded-lg overflow-hidden hover:border-red-500 transition-colors duration-300 h-full">
                  <div className="bg-gray-100 h-56 flex items-center justify-center border-b border-gray-200 relative shrink-0 overflow-hidden">
                    {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 hover:scale-110 transition-transform duration-500" />
                    ) : (
                        <Star className="text-gray-300 w-12 h-12" />
                    )}
                    <span className="absolute top-2 right-2 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm z-10">{product.category}</span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div>
                        <h3 className="text-lg font-bold text-black mb-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-4 leading-snug">{product.description}</p>
                        <div className="border border-gray-200 rounded-md overflow-hidden mb-4">
                          <table className="w-full text-sm text-left">
                              <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200">
                              <tr><th className="px-3 py-2 w-2/3">Size / Type</th><th className="px-3 py-2 w-1/3 text-right">Rate</th></tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                              {product.variants.map((v, idx) => (
                                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}><td className="px-3 py-2 text-gray-700 align-top">{v.name}</td><td className="px-3 py-2 text-right font-bold text-black align-top">{v.price}</td></tr>
                              ))}
                              </tbody>
                          </table>
                        </div>
                    </div>
                    <div className="mt-auto pt-2">
                        <a href={`https://wa.me/${COMPANY_DETAILS.phone}?text=I am interested in ${product.name}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded text-sm transition-colors gap-2"><MessageCircle size={16} /><span>Check Availability</span></a>
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
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                 <img src="/images/logo.jpg" alt="MRS Cutlery" className="h-10 w-auto object-contain rounded-sm" />
                 <h3 className="text-2xl font-serif font-bold text-white">MRS Cutlery</h3>
              </div>
              <p className="text-gray-400 font-medium">Jain Enterprises</p>
              <p className="text-gray-500 mt-4 text-sm leading-relaxed">Providing high-quality kitchenware.</p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h4 className="text-lg font-bold mb-6 text-white border-b-2 border-red-600 pb-2 inline-block">Contact</h4>
              <p className="text-gray-300 mb-3 flex items-center gap-3"><Phone size={14}/> {COMPANY_DETAILS.displayPhone}</p>
              <a href={`https://wa.me/${COMPANY_DETAILS.phone}`} className="mt-8 inline-block bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full text-sm font-bold transition-colors">Chat on WhatsApp</a>
            </div>
          </div>
          <div className="border-t border-gray-900 mt-16 pt-8 text-center text-gray-600 text-sm flex justify-between items-center flex-col md:flex-row">
            <span>© {new Date().getFullYear()} Jain Enterprises. All rights reserved.</span>
            {/* HIDDEN ADMIN LINK */}
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
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  // Sync state with local storage on load
  useEffect(() => {
    const savedProds = localStorage.getItem('mrs_products');
    const savedCats = localStorage.getItem('mrs_categories');
    
    if (savedProds) setProducts(JSON.parse(savedProds));
    else localStorage.setItem('mrs_products', JSON.stringify(INITIAL_PRODUCTS));

    if (savedCats) setCategories(JSON.parse(savedCats));
    else localStorage.setItem('mrs_categories', JSON.stringify(INITIAL_CATEGORIES));
  }, []);

  const handleAdminClick = () => setView('login');
  const handleLoginSuccess = () => setView('admin');
  const handleLogout = () => setView('website');

  return (
    <>
      {view === 'website' && <WebsiteView products={products} categories={categories} onAdminClick={handleAdminClick} />}
      {view === 'login' && <AdminLogin onLogin={handleLoginSuccess} />}
      {view === 'admin' && <AdminDashboard products={products} setProducts={setProducts} categories={categories} setCategories={setCategories} onLogout={handleLogout} />}
    </>
  );
}