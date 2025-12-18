import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const BACKDROP_URL = "https://via.placeholder.com/400x150";
const ICON_URL = "https://via.placeholder.com/80";

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/stores", {
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setStores(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <p className="text-center mt-16 text-white text-lg">
      Loading stores...
    </p>
  );

  return (
    <div className="p-6 sm:p-8 bg-[#0f0f0f] min-h-screen">
      <h1 className="text-3xl font-bold mb-10 text-springOrange text-center">
        Stores
      </h1>

      {stores.length === 0 ? (
        <p className="text-center text-gray-400">
          No stores available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {stores.map(store => (
            <div
              key={store.id}
              onClick={() => navigate(`/stores/${store.slug}`)}
              className="bg-[#1a1a1a] text-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="relative">
                <img
                  src={BACKDROP_URL}
                  alt="Backdrop"
                  className="w-full h-36 object-cover"
                />
                <img
                  src={ICON_URL}
                  alt="Store Icon"
                  className="w-16 h-16 rounded-full border-2 border-white absolute -bottom-8 left-1/2 transform -translate-x-1/2"
                />
              </div>

              <div className="pt-10 pb-6 px-4 text-center">
                <h2 className="text-xl font-semibold mb-1 text-white">
                  {store.name}
                </h2>
                {store.slug && (
                  <p className="text-sm text-gray-400">{store.slug}</p>
                )}
                <button
                  className="mt-3 px-4 py-2 bg-springGreenMedium rounded-full text-white text-sm font-medium hover:bg-springGreenLight transition"
                  onClick={() => navigate(`/stores/${store.slug}`)}
                >
                  Visit Store
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
};
export default Stores;