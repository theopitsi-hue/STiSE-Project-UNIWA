import React, { useEffect, useState } from 'react';
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

    if (loading) return <p className="text-center mt-8 text-white">Loading stores...</p>;

    return (
        <div className="p-8 bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-white text-center">All Stores</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {stores.map(store => (
                    <button
                        key={store.id}
                        onClick={() => navigate(`/stores/${store.slug}`)}
                        className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition text-left focus:outline-none"
                    >
                        {/* Backdrop Image */}
                        <div className="relative">
                            <img src={BACKDROP_URL} alt="Backdrop" className="w-full h-32 object-cover" />

                            {/* Round Icon */}
                            <img
                                src={ICON_URL}
                                alt="Store Icon"
                                className="w-16 h-16 rounded-full border-2 border-white absolute -bottom-8 left-1/2 transform -translate-x-1/2"
                            />
                        </div>

                        {/* Store Info */}
                        <div className="pt-10 pb-4 px-4 text-center">
                            <h2 className="text-xl font-semibold mb-2">{store.name}</h2>
                            {store.slug && <p className="text-sm text-gray-300">{store.slug}</p>}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Stores;
