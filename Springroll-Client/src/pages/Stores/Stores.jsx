import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const BACKDROP_URL = "https://via.placeholder.com/400x150";
const ICON_URL = "https://via.placeholder.com/80";

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Address state
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [customAddress, setCustomAddress] = useState("");

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

    // TODO: fetch addresses from API
    // For now, using placeholder addresses
    setAddresses(["123 Main St, City", "456 Oak Ave, Town"]);
  }, []);

  const handleStoreClick = (store) => {
    const finalAddress = customAddress.trim() || selectedAddress;

    if (!finalAddress) {
      alert("Please select or enter a delivery address before visiting a store");
      return;
    }

    // Navigate to store with address in state
    navigate(`/stores/${store.slug}`, {
      state: { address: finalAddress }
    });
  };

  if (loading) return (
    <p className="text-center mt-16 text-white text-lg">
      Loading stores...
    </p>
  );

  return (
    <div className="p-6 sm:p-8 bg-[#0f0f0f] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-springOrange text-center">
        Stores
      </h1>

      {/* Address Selection Section */}
      <div className="max-w-4xl mx-auto mb-10 bg-[#1a1a1a] p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">
          Delivery Address
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-2">
              Select from saved addresses
            </label>
            <select
              value={selectedAddress}
              disabled={!!customAddress}
              onChange={e => {
                setSelectedAddress(e.target.value);
                setCustomAddress("");
              }}
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-springGreenMedium focus:outline-none transition"
            >
              <option value="">Select your address</option>
              {addresses.map((addr, idx) => (
                <option key={idx} value={addr}>
                  {addr}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-2">
              Or enter a new address
            </label>
            <input
              type="text"
              placeholder="Enter delivery address"
              value={customAddress}
              onChange={e => {
                setCustomAddress(e.target.value);
                setSelectedAddress("");
              }}
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-springGreenMedium focus:outline-none transition"
            />
          </div>
        </div>

        {(selectedAddress || customAddress) && (
          <div className="mt-4 p-3 bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-springGreenMedium">Delivering to:</span>{" "}
              {customAddress || selectedAddress}
            </p>
          </div>
        )}
      </div>

      {stores.length === 0 ? (
        <p className="text-center text-gray-400">
          No stores available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {stores.map(store => (
            <div
              key={store.id}
              onClick={() => handleStoreClick(store)}
              className="bg-[#1a1a1a] text-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-transform duration-200"
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStoreClick(store);
                  }}
                  className="mt-3 px-4 py-2 bg-springGreenMedium rounded-full text-white text-sm font-medium hover:bg-springGreenLight transition"
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