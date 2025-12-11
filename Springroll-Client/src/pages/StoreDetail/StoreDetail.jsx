import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Placeholder images
const BACKDROP_URL = "https://via.placeholder.com/800x300";
const ICON_URL = "https://via.placeholder.com/100";

const StoreDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("");

    useEffect(() => {
        fetch(`http://localhost:8080/api/stores/${slug}`, { credentials: "include" })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (!data) {
                    // If no store found, redirect to /stores
                    navigate("/stores", { replace: true });
                    return;
                }
                setStore(data);
                if (data.categories?.length) setActiveCategory(data.categories[0].name);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                // Redirect if the fetch fails
                navigate("/stores", { replace: true });
            });
    }, [slug, navigate]);

    if (loading) return <p className="text-center mt-8 text-white">Loading store...</p>;

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Banner */}
            <div className="relative">
                <img src={BACKDROP_URL} alt="Banner" className="w-full h-60 object-cover" />
                <img
                    src={ICON_URL}
                    alt="Store Logo"
                    className="w-24 h-24 rounded-full border-4 border-white absolute -bottom-12 left-8"
                />
            </div>

            {/* Store Info */}
            <div className="pt-16 px-6">
                <h1 className="text-3xl font-bold">{store.name}</h1>
                <p className="text-gray-300 mt-2">{store.description}</p>
            </div>

            {/* Categories */}
            {store.categories && store.categories.length > 0 && (
                <div className="mt-6 px-4 overflow-x-auto flex space-x-4">
                    {store.categories.map(cat => (
                        <button
                            key={cat.name}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`px-4 py-2 rounded-full whitespace-nowrap ${activeCategory === cat.name ? "bg-springGreenMedium text-black" : "bg-gray-700 text-white"
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Items */}
            <div className="mt-6 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {store.items
                    ?.filter(item => item.category === activeCategory)
                    .map(item => (
                        <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                            <img src={item.image || BACKDROP_URL} alt={item.name} className="h-40 w-full object-cover" />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">{item.name}</h3>
                                <p className="text-gray-300 mt-1">{item.description}</p>
                                <p className="mt-2 font-bold">{item.price} $</p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default StoreDetail;
