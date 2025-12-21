import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SharedUrl from "../../api/sharedUrl";

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [adreses, setAdresses] = useState([]);
  const [selectedAdress, setSelAdresses] = useState([]);
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
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setCategories(data || []);
      })
      .catch(err => {
        console.error(err);
      });

    //todo: fetch adresses
    setAdresses(["test1", "test2"])
    //setSelAdresses()
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
      {/* Navbar */}
      <div className="w-full bg-gray-800 shadow-md px-8 py-4 flex items-center justify-between fixed top-0 z-30 h-14">
        {/* Logo button */}
        <button
          onClick={() => navigate("/stores")}
          className="flex items-center gap-2"
        >
          <img
            src={SharedUrl.SR_LOGO || SharedUrl.P_ICON_URL}
            alt="Logo"
            className="w-13 h-12"
          />
          <span className="text-2xl text-white font-semibold text-xl">Springroll Express</span>
        </button>

        {/* Address selection field */}
        <select
          value={selectedAdress || "Set Delivery Adress"}
          //onChange={(e) => setSelectedAddress(e.target.value)}
          className="px-2 py-2 rounded-xl bg-gray-700 text-white outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="" disabled>Select your address</option>
          {adreses.map((addr, idx) => (
            <option key={idx} value={addr}>{addr}</option>
          ))}
        </select>

        {/* Other navbar items */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="bg-green-400 text-black px-4 py-2 rounded hover:bg-green-500 transition"
          >
            Log Out
          </button>
        </div>
      </div>


      {/*main layout */}
      <div className="pt-20 px-3 w-full grid grid-cols-[260px_1fr] gap-6">
        {/* sidebar */}
        <aside className="bg-gray-800 rounded-xl p-3 h-fit sticky top-24">
          <h2 className="text-2xl font-semibold mb-3 text-springOrange bold">Filters</h2>

          {/* categgories */}
          <div className="mt-1 space-y-3 text-sm text-gray-300">
            <p className="text-xl text-springOrange leading-[1]">Categories</p>
            {categories.map(category => (
              <label key={category.id} className="text-xl flex items-center leading-[1] gap-2 cursor-pointer select-none text-gray-300">
                <input
                  type="checkbox"
                  //onChange={(e) => categoryClicked(e.target.checked)}
                  className="themed-checkbox"
                />
                <span className="checkbox-box" />
                <span>{category.name}</span>
              </label>
            )
            )}
          </div>
          {/* offers */}
          <div className="mt-6 space-y-3 text-sm text-gray-300">
            <p className="text-xl text-springOrange leading-[1]">Offers</p>
            <label className="text-xl flex items-center leading-[1] gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                //checked={freeDelivery}
                //onChange={(e) => setFreeDelivery(e.target.checked)}
                className="themed-checkbox"
              />
              <span className="checkbox-box" />
              <span>Free delivery</span>
            </label>
          </div>
        </aside>

        {/* content */}
        <main className="w-full">
          {/* search bar */}
          <input
            type="text"
            placeholder="Search for a store"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-8 px-5 py-3 rounded-xl bg-gray-800 text-white outline-none focus:ring-2 focus:ring-green-400"
          />

          {/* store grid */}
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
                {/* gradient overlay */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/50 transition bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />

                {/*content */}
                <div className="relative z-10 px-3 h-full flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src={store.icon || SharedUrl.P_ICON_URL}
                      alt={store.name}
                      className="w-14 h-14 rounded-full border-2 border-white"
                    />
                    <h3 className="text-lg font-semibold leading-[1] text-white mt-[6px]">
                      {store.name}
                    </h3>
                  </div>
                  {store.name && (
                    <p className="text-m text-gray-300 leading-[1.2] line-clamp-2">
                      {store?.description || "Placeholder Description Text !!! Placeholder Description Text !!! Placeholder Description Text !!!"}
                    </p>
                  )}
                  <div className="text-gray-400 leading-[0.2] flex items-center justify-between">
                    <p>Min. Order: {store?.minprice || "ph"}€</p>
                    <p>{store.mindeliverytime || "ph"}'</p>
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
