import React, { useEffect, useState } from 'react';

const Stores = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8080/api/stores", {
            credentials: "include", // if using session cookies
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(data => {
                setStores(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="text-center mt-8">Loading stores...</p>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">All Stores</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {stores.map(store => (
                    <div key={store.id} className="p-4 bg-gray-800 text-white rounded-lg shadow hover:shadow-lg transition">
                        <h2 className="text-xl font-semibold mb-2">{store.name}</h2>
                        {store.description && <p className="text-sm">{store.description}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Stores;
