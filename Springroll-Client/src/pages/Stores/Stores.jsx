import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SharedUrl from "../../api/sharedUrl";
import Navbar from "../../components/Navbar";

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(SharedUrl.STORES, {
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setStores(data || []);
        setFilteredStores(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    fetch(SharedUrl.CATEGORIES, {
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(data => setCategories((Array.isArray(data) ? data : [])))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const result = stores.filter(store =>
      store.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredStores(result);
  }, [search, stores]);

  if (loading) {
    return (
      <p className="text-center mt-16 text-white text-lg">
        Loading stores...
      </p>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white w-full">
      {/* custom Navbar */}
      <Navbar />

      {/* Main layout */}
      <div className="pt-20 px-3 w-full grid grid-cols-[260px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="bg-gray-800 rounded-xl p-3 h-fit sticky top-24">
          <h2 className="text-2xl font-semibold mb-3 text-springOrange">
            Filters
          </h2>

          <div className="mt-1 space-y-3 text-gray-300">
            <p className="text-xl text-springOrange">Categories</p>
            {categories.map(category => (
              <label
                key={category.id}
                className="text-xl flex items-center gap-2 cursor-pointer select-none"
              >
                <input type="checkbox" className="themed-checkbox" />
                <span className="checkbox-box" />
                <span>{category.name}</span>
              </label>
            ))}
          </div>

          <div className="mt-6 space-y-3 text-gray-300">
            <p className="text-xl text-springOrange">Offers</p>
            <label className="text-xl flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="themed-checkbox" />
              <span className="checkbox-box" />
              <span>Free delivery</span>
            </label>
          </div>
        </aside>

        {/* Content */}
        <main className="w-full">
          <input
            type="text"
            placeholder="Search for a store"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-8 px-5 py-3 rounded-xl bg-gray-800 text-white outline-none focus:ring-2 focus:ring-green-400"
          />

          <div className="grid grid-cols-4 gap-3">
            {filteredStores.map(store => (
              <button
                key={store.id}
                onClick={() => navigate(`/stores/${store.slug}`)}
                className="relative h-52 rounded-lg overflow-hidden shadow hover:shadow-xl transition text-left group border-2 border-green-800"
                style={{
                  backgroundImage: `url(${store.image || SharedUrl.P_BACKDROP_URL})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
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
                    <h3 className="text-lg font-semibold">
                      {store.name}
                    </h3>
                  </div>

                  <p className="text-gray-300 line-clamp-2">
                    {store.description || "No description available"}
                  </p>

                  <div className="text-gray-400 flex justify-between">
                    <p>Min. Order: {store.minprice ?? "-"}€</p>
                    <p>{store.mindeliverytime ?? "-"}'</p>
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
