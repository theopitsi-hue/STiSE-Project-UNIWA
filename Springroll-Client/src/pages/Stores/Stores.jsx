import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SharedUrl from "../../api/sharedUrl";
import Navbar from "../../components/Navbar";
import { Search, IceCream, Pizza, Coffee, Box, Shell, GlassWater, Plus, MoreHorizontal, Pencil, Heart } from "lucide-react";
import { useUser } from "../../context/UserContext";

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategorySortIndex, setNewCategorySortIndex] = useState(0);
  const [categoryDeleting, setCategoryDeleting] = useState(false);
  const [newCategoryIconName, setNewCategoryIconName] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const [carouselIndex, setCarouselIndex] = useState(0);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newMinOrder, setNewMinOrder] = useState(0);
  const [newDeliveryTime, setNewDeliveryTime] = useState(0);
  const [newOwnerEmail, setNewOwnerEmail] = useState("");
  const [newSelectedCategories, setNewSelectedCategories] = useState([]);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [editingStore, setEditingStore] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const carouselImages = [
    SharedUrl.SR_BANNER1,
    SharedUrl.SR_BANNER2,
    SharedUrl.SR_BANNER3
  ];

  const navigate = useNavigate();
  const { user } = useUser();

  const CategoryIcon = ({ name, className = "w-5 h-5 mr-2" }) => {
    const match = ICON_OPTIONS.find(opt => opt.name === name);
    if (match && match.Component) return <match.Component className={className} />;

    //fallback
    return <Box className={className} />;
  };

  //available icon choices for categories
  const ICON_OPTIONS = [
    { name: 'Box', Component: Box },
    { name: 'IceCream', Component: IceCream },
    { name: 'Pizza', Component: Pizza },
    { name: 'Coffee', Component: Coffee },
    { name: 'GlassWater', Component: GlassWater },
    { name: 'Shell', Component: Shell },
    { name: 'Heart', Component: Heart },
    { name: 'MoreHorizontal', Component: MoreHorizontal },
    { name: 'Search', Component: Search },
    { name: 'Plus', Component: Plus },
    { name: 'Pencil', Component: Pencil }
  ];

  const isValidEmail = (email) => {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const openEditModal = (store) => {
    setEditingStore(store);
    setNewName(store.name || "");
    setNewDescription(store.description || "");
    setNewMinOrder(typeof store.minOrder === 'number' ? store.minOrder : parseInt(store.minOrder) || 0);
    setNewDeliveryTime(typeof store.deliveryTime === 'number' ? store.deliveryTime : parseInt(store.deliveryTime) || 0);
    setNewOwnerEmail(store.ownerEmail || (store.owner && store.owner.email) || "");
    setNewSelectedCategories(Array.isArray(store.categories) ? store.categories : []);
    setCreateError("");
    setShowCreateModal(true);
  };

  // Load categories (extract to function so we can refresh after creating a category)
  const loadCategories = () => {
    fetch(SharedUrl.CATEGORIES, { credentials: "include", headers: { "Content-Type": "application/json" } })
      .then(res => res.json())
      .then(data => {
        const catArr = Array.isArray(data) ? data : [];
        // sort by numeric sortIndex (fallback to 0)
        catArr.sort((a, b) => (Number(b.sortIndex) || 0) - (Number(a.sortIndex) || 0));
        console.log(data);
        setCategories(catArr);
      })
      .catch(err => {
        console.error("Category Loading Error:" + err);
        navigate("/login", { replace: true });
      });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Load stores (can be re-used after creating a store)
  const loadStores = () => {
    setLoading(true);
    fetch(`${SharedUrl.STORES}`, { credentials: "include", headers: { "Content-Type": "application/json" } })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setStores(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("STORE Loading Error:" + err);
        setLoading(false);
        navigate("/login", { replace: true });
      });
  };

  useEffect(() => {
    loadStores();
  }, []);

  // Client-side search + sort + category filter
  useEffect(() => {
    const searchTerm = search.toLowerCase();

    const getDelivery = s => typeof s.deliveryTime === "number" ? s.deliveryTime : parseFloat(s.deliveryTime) || Infinity;
    const getMinOrder = s => typeof s.minOrder === "number" ? s.minOrder : parseFloat(s.minOrder) || Infinity;

    let result = stores.filter(store => (store.name || "").toLowerCase().includes(searchTerm));

    // Category filtering: keep stores that include any selected category by name
    if (selectedCategories.length > 0) {
      result = result.filter(store => Array.isArray(store.categories) && store.categories.some(c => selectedCategories.includes(c.name)));
    }

    // Sorting
    if (sortBy === "name") result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    else if (sortBy === "deliveryTime") result.sort((a, b) => getDelivery(a) - getDelivery(b));
    else if (sortBy === "minimumOrder") result.sort((a, b) => getMinOrder(a) - getMinOrder(b));

    if (sortDirection === "desc") result.reverse();

    setFilteredStores(result);
  }, [stores, search, sortBy, sortDirection, selectedCategories]);

  // Carousel automatic slide
  useEffect(() => {
    const interval = setInterval(() => setCarouselIndex(prev => (prev + 1) % carouselImages.length), 15000);
    return () => clearInterval(interval);
  }, []);

  const confirmDisabled = creating || deleting || !newName.trim() || !isValidEmail(newOwnerEmail) || newSelectedCategories.length === 0;

  if (loading) return <p className="text-center mt-16 text-white text-lg">Loading stores...</p>;

  return (
    <div className="bg-gray-900 min-h-screen text-white w-full">
      <Navbar />

      {/*Carousel */}
      <div className="relative w-full mb-6 h-96 rounded-xl overflow-hidden shadow-lg">
        {carouselImages.map((img, idx) => (
          <img key={idx} src={img || SharedUrl.P_BACKDROP_URL} alt={`carousel-${idx}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === carouselIndex ? "opacity-100" : "opacity-0"}`} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent/10 to-transparent" />
        <div className="absolute bottom-2 left-5 text-left">
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">Welcome to Springroll Express</h1>
          <p className="text-xl md:text-2xl text-gray-300 mt-2">Fast delivery, happy taste buds</p>
        </div>
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2">
          {carouselImages.map((_, idx) => (
            <button key={idx} className={`w-3 h-3 rounded-full ${idx === carouselIndex ? "bg-green-400" : "bg-gray-500"}`} onClick={() => setCarouselIndex(idx)} />
          ))}
        </div>
      </div>

      <div className="pt-0 px-3 w-full grid grid-cols-[260px_1fr] gap-6">
        {/*Sidebar */}
        <aside className="relative bg-gray-800 rounded-xl p-3 h-fit sticky top-24">
          <h2 className="text-2xl font-semibold mb-2 text-springOrange">Filters</h2>
          <div className="mt-1 space-y-0 text-gray-300">
            <p className="text-xl mb-0 text-springOrange">Categories</p>
            {user?.role === 2 && (
              <div>
                <button onClick={() => { setEditingCategory(null); setNewCategoryName(""); setNewCategorySortIndex(0); setShowNewCategoryModal(true); }} className="w-full h-8 rounded-lg flex items-center gap-3 px-3 bg-gray-800 border-2 border-dashed border-green-600 text-gray-300 hover:bg-gray-700">
                  <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-lg">New Category</span>
                </button>
              </div>)
            }
            {categories.map(category => {
              const active = selectedCategories.includes(category.name);
              return (
                <label key={category.id} className={`text-xl flex items-center gap-2 cursor-pointer select-none transition-all rounded px-3 py-1 ${active ? "bg-green-400 text-black font-semibold" : "text-gray-300 hover:bg-gray-700"}`}>
                  <input type="checkbox" className="themed-checkbox" checked={active} onChange={() => {
                    setSelectedCategories(prev => prev.includes(category.name) ? [] : [category.name]);
                  }} />

                  {user?.role === 2 && (
                    < button type="button" onClick={(e) => {
                      e.stopPropagation();
                      setEditingCategory(category);
                      setNewCategoryName(category.name || "");
                      setNewCategoryIconName(category.iconName || "Box")
                      setNewCategorySortIndex(typeof category.sortIndex === 'number' ? category.sortIndex : parseInt(category.sortIndex) || 0);
                      setCategoryError("");
                      setShowNewCategoryModal(true);
                    }} className="w-7 h-7 flex items-center justify-center rounded bg-gray-700 text-gray-200 hover:bg-gray-800 mr-1">
                      <Pencil className="w-4 h-4" />
                    </button>
                  )
                  }

                  <span className="flex items-center">
                    <CategoryIcon name={category.iconName} className="w-5 h-5 mr-3" />
                    <span>{category.name}</span>
                  </span>
                </label>
              );
            })}
          </div>

          <div className="mt-4">
            <p className="text-xl mb-1 text-springOrange">Sort By</p>
            {["name", "deliveryTime", "minimumOrder"].map(key => (
              <label key={key} className={`text-lg flex items-center gap-2 cursor-pointer select-none transition-all rounded px-3 py-1 ${sortBy === key ? "bg-green-400 text-black font-semibold" : "text-gray-300 hover:bg-gray-700"}`}>
                <input type="radio" name="sort" className="themed-checkbox" checked={sortBy === key} onChange={() => setSortBy(key)} />
                <span className="flex-1">{key === "name" ? "Name" : key === "deliveryTime" ? "Delivery Time" : "Minimum Order"}</span>
              </label>
            ))}
          </div>
        </aside>

        {/*Main Content */}
        <main className="relative w-full">
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search for a store" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full px-12 py-3 rounded-xl bg-gray-800 text-white outline-none focus:ring-2 focus:ring-green-400" />
          </div>

          <div className="grid grid-cols-4 gap-3">
            {user?.role === 2 && (
              <button onClick={() => setShowCreateModal(true)} className="relative h-52 rounded-lg overflow-hidden shadow hover:shadow-xl transition text-left group border-2 border-dashed border-green-600 bg-gray-800 flex items-center justify-center flex-col">
                <span className="text-sm text-gray-300 mb-2">Create new store</span>
                <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <Plus className="w-6 h-6" />
                </div>
              </button>
            )}
            {filteredStores.map(store => (
              <div key={store.id} className="relative h-52">
                {/* Outer card button */}
                <button
                  onClick={() => navigate(`/stores/${store.slug}`)}
                  className="absolute inset-0 w-full h-full rounded-lg overflow-hidden shadow hover:shadow-xl transition text-left group border-2 border-green-800"
                  style={{
                    backgroundImage: `url(${store.image || SharedUrl.P_BACKDROP_URL})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
                  <div className="relative z-10 px-3 h-full flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={store.icon || SharedUrl.P_ICON_URL}
                        alt={store.name}
                        className="w-14 h-14 rounded-full border-2 border-white"
                      />
                      <h3 className="text-lg font-semibold">{store.name}</h3>
                    </div>
                    <p className="text-gray-300 line-clamp-2">
                      {store.description || "No description available"}
                    </p>
                    <div className="text-gray-400 flex justify-between">
                      <p>Min. Order: {store.minOrder ?? "-"}€</p>
                      <p>{store.deliveryTime ?? "-"}'</p>
                    </div>
                  </div>
                </button>

                {/* Edit button (inner button now a sibling) */}
                {user?.role === 2 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevents triggering the card click
                      openEditModal(store);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-black flex items-center justify-center shadow z-20 transition transform scale-100"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}

                {/* Example: Fave icon (optional, same sibling pattern) */}
                {user?.role === 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="absolute top-3 right-14 w-8 h-8 rounded-full bg-white/90 text-black flex items-center justify-center shadow z-20"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      {/*Create Store Modal */}
      {showCreateModal && (
        <>
          <div className="fixed inset-0 bg-black/60 z-30" onClick={() => !creating && setShowCreateModal(false)} />
          <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
            <form onSubmit={e => e.preventDefault()} className="w-full max-w-lg bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-semibold mb-4 text-white"> Store Editing</h3>
              {createError && <p className="text-red-400 mb-2">{createError}</p>}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Name</label>
                  <input value={newName} onChange={e => setNewName(e.target.value)} className="w-full px-3 py-2 rounded bg-gray-700 text-white outline-none" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Description</label>
                  <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} className="w-full px-3 py-2 rounded bg-gray-700 text-white outline-none" rows={3} />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Categories</label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 pr-2 bg-gray-800 rounded">
                    {categories.map(cat => {
                      const active = newSelectedCategories.some(c => c.id === cat.id);
                      return (
                        <label key={cat.id} className={`flex items-center gap-2 cursor-pointer select-none rounded px-2 py-1 ${active ? 'bg-green-400 text-black font-semibold' : 'text-gray-300 hover:bg-gray-700'}`}>
                          <input type="checkbox" checked={active} onChange={() => {
                            setNewSelectedCategories(prev => prev.some(c => c.id === cat.id) ? prev.filter(x => x.id !== cat.id) : [...prev, cat]);
                          }} className="themed-checkbox" />
                          <span className="flex-1">{cat.name}</span>

                        </label>

                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Min Order (€)</label>
                    <input type="number" value={newMinOrder} onChange={e => setNewMinOrder(parseInt(e.target.value || 0))} className="w-full px-3 py-2 rounded bg-gray-700 text-white outline-none" min={0} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Delivery Time (min)</label>
                    <input type="number" value={newDeliveryTime} onChange={e => setNewDeliveryTime(parseInt(e.target.value || 0))} className="w-full px-3 py-2 rounded bg-gray-700 text-white outline-none" min={0} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Owner Email</label>
                  <input type="email" value={newOwnerEmail} onChange={e => { setNewOwnerEmail(e.target.value); if (createError) setCreateError(""); }} className={`w-full px-3 py-2 rounded bg-gray-700 text-white outline-none ${newOwnerEmail && !isValidEmail(newOwnerEmail) ? 'border border-red-500' : ''}`} required />
                  {newOwnerEmail && !isValidEmail(newOwnerEmail) && <p className="text-red-400 text-sm mt-1">Please enter a valid email address.</p>}
                </div>
                {newSelectedCategories.length === 0 && <p className="text-yellow-300 text-sm">Please select at least one category.</p>}
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={creating || deleting}
                  onClick={() => {
                    if (creating || deleting) return;
                    setShowCreateModal(false);
                    setNewName("");
                    setNewDescription("");
                    setNewMinOrder(0);
                    setNewDeliveryTime(0);
                    setNewOwnerEmail("");
                    setNewSelectedCategories([]);
                    setCreateError("");
                    setEditingStore(null);
                  }}
                  className="px-4 py-2 rounded bg-gray-700 text-white"
                >Cancel</button>

                {editingStore && (
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={async () => {
                      if (deleting) return;
                      if (!editingStore || !editingStore.id) return;
                      if (!window.confirm("Are you sure you want to delete this store? This cannot be undone.")) return;
                      setCreateError("");
                      setDeleting(true);
                      try {
                        const res = await fetch(`${SharedUrl.STORES}/${editingStore.id}`, { method: 'DELETE', credentials: 'include' });
                        if (!res.ok) {
                          const txt = await res.text().catch(() => "");
                          throw new Error(txt || `HTTP ${res.status}`);
                        }
                        setShowCreateModal(false);
                        setEditingStore(null);
                        setNewName(""); setNewDescription(""); setNewMinOrder(0); setNewDeliveryTime(0); setNewOwnerEmail(""); setNewSelectedCategories([]);
                        await loadStores();
                      } catch (err) {
                        console.error("Delete store error:", err);
                        setCreateError(err.message || "Delete failed");
                      } finally {
                        setDeleting(false);
                      }
                    }}
                    className={`px-4 py-2 rounded ${deleting ? 'bg-gray-600 text-gray-300' : 'bg-red-600 text-white font-semibold'}`}
                  >{deleting ? 'Deleting...' : 'Delete'}</button>
                )}

                <button type="button" disabled={confirmDisabled} onClick={async () => {
                  setCreateError("");
                  if (!newName.trim()) { setCreateError("Name is required"); return; }
                  if (!newOwnerEmail.trim() || !isValidEmail(newOwnerEmail)) { setCreateError("Valid owner email is required"); return; }
                  if (newSelectedCategories.length === 0) { setCreateError("At least one category is required"); return; }
                  setCreating(true);
                  try {
                    const payload = {
                      name: newName,
                      description: newDescription,
                      minOrder: Number.isFinite(Number(newMinOrder)) ? Number(newMinOrder) : 0,
                      deliveryTime: Number.isFinite(Number(newDeliveryTime)) ? Number(newDeliveryTime) : 0,
                      ownerEmail: newOwnerEmail,
                      categories: newSelectedCategories.map(c => c.id)
                    };

                    let res;
                    if (editingStore && editingStore.id) {
                      // Edit existing store
                      res = await fetch(`${SharedUrl.STORES}/${editingStore.id}`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                    } else {
                      // Create new store
                      res = await fetch(SharedUrl.STORES, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                    }

                    if (!res.ok) {
                      const txt = await res.text().catch(() => "");
                      throw new Error(txt || `HTTP ${res.status}`);
                    }

                    // success: close and refresh list
                    setShowCreateModal(false);
                    setNewName(""); setNewDescription(""); setNewMinOrder(0); setNewDeliveryTime(0); setNewOwnerEmail(""); setNewSelectedCategories([]);
                    setEditingStore(null);
                    await loadStores();
                  } catch (err) {
                    console.error("Create/Edit store error:", err);
                    setCreateError(err.message || "Operation failed");
                  } finally {
                    setCreating(false);
                  }
                }} className={`px-4 py-2 rounded ${confirmDisabled ? 'bg-gray-600 text-gray-300' : 'bg-green-500 text-black font-semibold'}`}>{creating ? (editingStore ? 'Saving...' : 'Creating...') : (editingStore ? 'Save' : 'Confirm')}</button>
              </div>
            </form>
          </div>
        </>
      )}

      {/*new Category Modal */}
      {showNewCategoryModal && (
        <>
          <div className="fixed inset-0 bg-black/60 z-30" onClick={() => !creatingCategory && setShowNewCategoryModal(false)} />
          <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
            <form onSubmit={e => e.preventDefault()} className="w-full max-w-sm bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-3 text-white">{editingCategory ? 'Edit Category' : 'Create Category'}</h3>
              {categoryError && <p className="text-red-400 mb-2">{categoryError}</p>}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Name</label>
                  <input value={newCategoryName} onChange={e => { setNewCategoryName(e.target.value); if (categoryError) setCategoryError(""); }} className="w-full px-3 py-2 rounded bg-gray-700 text-white outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Icon</label>
                  <div className="flex items-center gap-2">
                    <select value={newCategoryIconName} onChange={e => setNewCategoryIconName(e.target.value)} className="px-3 py-2 rounded bg-gray-700 text-white outline-none w-full">
                      <option value="">{newCategoryIconName || "Box"}</option>
                      {ICON_OPTIONS.map(opt => (
                        <option key={opt.name} value={opt.name}>{opt.name}</option>
                      ))}
                    </select>
                    <div className="w-10 h-10 flex items-center justify-center">
                      {(() => {
                        const found = ICON_OPTIONS.find(i => i.name === newCategoryIconName);
                        const Preview = found ? found.Component : null;
                        return Preview ? <Preview className="w-6 h-6 text-gray-200" /> : <Box className="w-6 h-6 text-gray-200" />;
                      })()}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">Sort Index</label>
                  <input type="number" value={newCategorySortIndex} onChange={e => setNewCategorySortIndex(parseInt(e.target.value || 0))} className="w-full px-3 py-2 rounded bg-gray-700 text-white outline-none" />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button type="button" disabled={creatingCategory || categoryDeleting} onClick={() => { if (creatingCategory || categoryDeleting) return; setShowNewCategoryModal(false); setNewCategoryName(""); setNewCategorySortIndex(0); setNewCategoryIconName("Box"); setCategoryError(""); setEditingCategory(null); }} className="px-4 py-2 rounded bg-gray-700 text-white">Cancel</button>

                {editingCategory && (
                  <button type="button" disabled={categoryDeleting || creatingCategory} onClick={async () => {
                    if (categoryDeleting || creatingCategory) return;
                    if (!editingCategory || !editingCategory.id) return;
                    if (!window.confirm("Are you sure you want to delete this category? This cannot be undone.")) return;
                    setCategoryError("");
                    setCategoryDeleting(true);
                    try {
                      const res = await fetch(`${SharedUrl.CATEGORIES}/${editingCategory.id}`, { method: 'DELETE', credentials: 'include' });
                      if (!res.ok) {
                        const txt = await res.text().catch(() => "");
                        throw new Error(txt || `HTTP ${res.status}`);
                      }
                      setShowNewCategoryModal(false);
                      setEditingCategory(null);
                      setNewCategoryName("");
                      setNewCategorySortIndex(0);
                      await loadCategories();
                    } catch (err) {
                      console.error("Delete category error:", err);
                      setCategoryError(err.message || "Delete failed");
                    } finally {
                      setCategoryDeleting(false);
                    }
                  }} className={`px-4 py-2 rounded ${categoryDeleting ? 'bg-gray-600 text-gray-300' : 'bg-red-600 text-white font-semibold'}`}>{categoryDeleting ? 'Deleting...' : 'Delete'}</button>
                )}

                <button type="button" disabled={creatingCategory || categoryDeleting || !newCategoryName.trim()} onClick={async () => {
                  setCategoryError("");
                  if (!newCategoryName.trim()) { setCategoryError("Name required"); return; }
                  setCreatingCategory(true);
                  try {
                    const payload = { name: newCategoryName, sortIndex: Number.isFinite(Number(newCategorySortIndex)) ? Number(newCategorySortIndex) : 0, iconName: newCategoryIconName };

                    let res;
                    if (editingCategory && editingCategory.id) {
                      // Edit existing category
                      res = await fetch(`${SharedUrl.CATEGORIES}/${editingCategory.id}`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                    } else {
                      // Create new category
                      res = await fetch(SharedUrl.CATEGORIES, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                    }

                    if (!res.ok) {
                      const txt = await res.text().catch(() => "");
                      throw new Error(txt || `HTTP ${res.status}`);
                    }

                    setShowNewCategoryModal(false);
                    setNewCategoryName("");
                    setNewCategorySortIndex(0);
                    setEditingCategory(null);
                    await loadCategories();
                  } catch (err) {
                    console.error("Create/Edit category error:", err);
                    setCategoryError(err.message || "Operation failed");
                  } finally {
                    setCreatingCategory(false);
                  }
                }} className={`px-4 py-2 rounded ${(!newCategoryName.trim() || creatingCategory || categoryDeleting) ? 'bg-gray-600 text-gray-300' : 'bg-green-500 text-black font-semibold'}`}>{creatingCategory ? (editingCategory ? 'Saving...' : 'Creating...') : (editingCategory ? 'Save' : 'Create')}</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Stores;