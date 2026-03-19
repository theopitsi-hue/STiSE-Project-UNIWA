import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SharedUrl from "../../api/sharedUrl";
import Navbar from "../../components/Navbar";
import { Search, IceCream, Pizza, Coffee, Box, Shell, GlassWater } from "lucide-react";

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselImages = [
    SharedUrl.SR_BANNER1,
    SharedUrl.SR_BANNER2,
    SharedUrl.SR_BANNER3
  ];

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const CategoryIcon = ({ name, className = "w-5 h-5 mr-2" }) => {
    const n = (name || "").toLowerCase();
    if (n.includes("pizza")) return <Pizza className={className} />;
    if (n.includes("ice") || n.includes("shake") || n.includes("dessert") || n.includes("milk")) return <IceCream className={className} />;
    if (n.includes("coffee") || n.includes("cafe") || n.includes("tea")) return <Coffee className={className} />;
    if (n.includes("yogurt")) return <GlassWater className={className} />;
    if (n.includes("sushi")) return <Shell className={className} />;
    return <Box className={className} />;
  };

  // Load categories and prefill selectedCategories from URL
  useEffect(() => {
    fetch(SharedUrl.CATEGORIES, { credentials: "include", headers: { "Content-Type": "application/json" } })
      .then(res => res.json())
      .then(data => {
        const catArr = Array.isArray(data) ? data : [];
        setCategories(catArr);

        const urlCategories = searchParams.get("category");
        if (urlCategories) {
          const slugs = urlCategories.split(",").filter(Boolean);
          setSelectedCategories(slugs);
        }
      })
      .catch(err => {
        console.error(err);
        navigate("/login", { replace: true });
      });
  }, []);

  // Fetch stores whenever selectedCategories changes
  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams();
    if (selectedCategories.length) params.append("category", selectedCategories.join(","));

    fetch(`${SharedUrl.STORES}?${params.toString()}`, { credentials: "include", headers: { "Content-Type": "application/json" } })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setStores(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        navigate("/login", { replace: true });
      });

    // Update URL without reloading
    const newParams = new URLSearchParams(window.location.search);
    if (selectedCategories.length > 0) newParams.set("category", selectedCategories.join(","));
    else newParams.delete("category");
    setSearchParams(newParams, { replace: true });
  }, [selectedCategories]);

  // Client-side search + sort
  useEffect(() => {
    const searchTerm = search.toLowerCase();

    const getDelivery = s => typeof s.deliveryTime === "number" ? s.deliveryTime : parseFloat(s.deliveryTime) || Infinity;
    const getMinOrder = s => typeof s.minOrder === "number" ? s.minOrder : parseFloat(s.minOrder) || Infinity;

    let result = stores.filter(store => (store.name || "").toLowerCase().includes(searchTerm));

    // Sorting
    if (sortBy === "name") result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    else if (sortBy === "deliveryTime") result.sort((a, b) => getDelivery(a) - getDelivery(b));
    else if (sortBy === "minimumOrder") result.sort((a, b) => getMinOrder(a) - getMinOrder(b));

    if (sortDirection === "desc") result.reverse();

    setFilteredStores(result);
  }, [stores, search, sortBy, sortDirection]);

  // Carousel automatic slide
  useEffect(() => {
    const interval = setInterval(() => setCarouselIndex(prev => (prev + 1) % carouselImages.length), 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-center mt-16 text-white text-lg">Loading stores...</p>;

  return (
    <div className="bg-gray-900 min-h-screen text-white w-full">
      <Navbar />

      {/* Carousel */}
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
        {/* Sidebar */}
        <aside className="relative bg-gray-800 rounded-xl p-3 h-fit sticky top-24">
          <h2 className="text-2xl font-semibold mb-2 text-springOrange">Filters</h2>
          <div className="mt-1 space-y-0 text-gray-300">
            <p className="text-xl mb-0 text-springOrange">Categories</p>
            {categories.map(category => {
              const active = selectedCategories.includes(category.slug);
              return (
                <label key={category.id} className={`text-xl flex items-center gap-2 cursor-pointer select-none transition-all rounded px-3 py-1 ${active ? "bg-green-400 text-black font-semibold" : "text-gray-300 hover:bg-gray-700"}`}>
                  <input type="checkbox" className="themed-checkbox" checked={active} onChange={() => {
                    setSelectedCategories(prev => prev.includes(category.slug) ? prev.filter(slug => slug !== category.slug) : [...prev, category.slug]);
                  }} />
                  <span className="flex items-center">
                    <CategoryIcon name={category.name} className="w-5 h-5 mr-3" />
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

        {/* Main Content */}
        <main className="relative w-full">
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search for a store" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full px-12 py-3 rounded-xl bg-gray-800 text-white outline-none focus:ring-2 focus:ring-green-400" />
          </div>

          <div className="grid grid-cols-4 gap-3">
            {filteredStores.map(store => (
              <button key={store.id} onClick={() => navigate(`/stores/${store.slug}`)} className="relative h-52 rounded-lg overflow-hidden shadow hover:shadow-xl transition text-left group border-2 border-green-800" style={{ backgroundImage: `url(${store.image || SharedUrl.P_BACKDROP_URL})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
                <div className="relative z-10 px-3 h-full flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-1">
                    <img src={store.icon || SharedUrl.P_ICON_URL} alt={store.name} className="w-14 h-14 rounded-full border-2 border-white" />
                    <h3 className="text-lg font-semibold">{store.name}</h3>
                  </div>
                  <p className="text-gray-300 line-clamp-2">{store.description || "No description available"}</p>
                  <div className="text-gray-400 flex justify-between">
                    <p>Min. Order: {store.minOrder ?? "-"}€</p>
                    <p>{store.deliveryTime ?? "-"}'</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Stores;