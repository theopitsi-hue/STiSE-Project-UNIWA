import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

//gia twra, mexri to backend na kanei catch-up
const BACKDROP_URL = "https://cdn.pixabay.com/photo/2015/11/06/15/04/bamboo-1028699_1280.jpg";
const ICON_URL = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pngarts.com%2Ffiles%2F10%2FCircle-PNG-Transparent-Image.png&f=1&nofb=1&ipt=75453769b9e44f72b538b29c8eaddfd56aecf437a0e17737e515f35a8f1d44d5";

const Stores = () => {
    const { user } = useUser(); //to get data about the signed-in user
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
            {user?.role === 2 && ( //enabling admin-only functionality
                <button className="bg-red-500 text-white px-4 py-2 rounded">
                    Admin Panel for {user.username}
                </button>
            )}
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
