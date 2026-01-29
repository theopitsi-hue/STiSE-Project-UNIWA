import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

//gia twra, mexri to backend na kanei catch-up
const BACKDROP_URL = "https://cdn.pixabay.com/photo/2015/11/06/15/04/bamboo-1028699_1280.jpg";
const ICON_URL = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pngarts.com%2Ffiles%2F10%2FCircle-PNG-Transparent-Image.png&f=1&nofb=1&ipt=75453769b9e44f72b538b29c8eaddfd56aecf437a0e17737e515f35a8f1d44d5";

// Placeholder for SharedUrl - replace with your actual import
const SharedUrl = {
    CART: "http://localhost:8080/api/cart",
    P_BACKDROP_URL: BACKDROP_URL,
    P_ICON_URL: ICON_URL,
    SR_LOGO: null
};

const CART_MOD_URL = `${SharedUrl.CART}/modify`;

const StoreDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("");
    const [cart, setCart] = useState({});
    const [cartFinalPrice, setCartFinalPrice] = useState(0);

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [customAddress, setCustomAddress] = useState("");

    useEffect(() => {
        // Set address from navigation state if available
        if (location.state?.address) {
            // Check if it's one of the saved addresses
            const isSavedAddress = addresses.includes(location.state.address);
            if (isSavedAddress) {
                setSelectedAddress(location.state.address);
            } else {
                setCustomAddress(location.state.address);
            }
        }

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
                if (data.itemGroups?.length) {
                    setActiveCategory(data.itemGroups[0].name);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                // Redirect if the fetch fails
                navigate("/stores", { replace: true });
            });

        fetch(`${SharedUrl.CART}/get`, { credentials: "include" })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                if (!data) {
                    return;
                }
                const updatedCart = {};

                data.items.forEach((ci) => {
                    updatedCart[ci.itemId] = {
                        item: {
                            id: ci.itemId,
                            name: ci.name,
                            price: ci.price,
                            image: ci.image || SharedUrl.P_BACKDROP_URL,
                        },
                        quantity: ci.quantity,
                    };
                });

                setCart(updatedCart);
                setCartFinalPrice(data.finalPrice);
            })
            .catch((err) => {
                console.error(err);
            });

        //todo: fetch addresses from API
        setAddresses(["test address 1", "test address 2"]);
    }, [slug, navigate, location.state]);

    const modifyCartOnServer = async (itemId, change = 1, clear = false) => {
        try {
            const response = await fetch(CART_MOD_URL, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemId, change, clear }),
            });

            if (!response.ok) return;

            const data = await response.json();
            const updatedCart = {};

            data.items.forEach((ci) => {
                updatedCart[ci.itemId] = {
                    item: {
                        id: ci.itemId,
                        name: ci.name,
                        price: ci.price,
                        image: ci.image || SharedUrl.P_BACKDROP_URL,
                    },
                    quantity: ci.quantity,
                };
            });

            setCart(updatedCart);
            setCartFinalPrice(data.finalPrice);
        } catch (err) {
            console.error("Cart modification exception:", err);
        }
    };

    const addToCart = item => modifyCartOnServer(item.id, 1);
    const removeFromCart = item => modifyCartOnServer(item.id, -1);
    const clearCart = () => modifyCartOnServer(null, 0, true);

    const handlePay = () => {
        const finalAddress = customAddress.trim() || selectedAddress;

        if (!finalAddress) {
            alert("Please select or enter a delivery address");
            return;
        }

        if (cartFinalPrice > 0) {
            navigate("/payment", {
                state: {
                    cart,
                    cartFinalPrice,
                    address: finalAddress,
                },
            });
        }
    };

    if (loading)
        return <p className="text-center mt-8 text-white">Loading store...</p>;

    return (
        <div
            className="bg-gray-900 text-white w-full min-h-screen"
            style={{ paddingTop: "64px" }}
        >
            {/* Navbar */}
            <div className="w-full bg-gray-800 shadow-md px-8 py-4 flex items-center justify-between fixed top-0 z-30 h-16">
                {/* Logo button */}
                <button
                    onClick={() => navigate("/stores")}
                    className="flex items-center gap-2"
                >
                    <img
                        src={SharedUrl.SR_LOGO || SharedUrl.P_ICON_URL}
                        alt="Logo"
                        className="w-12 h-12"
                    />
                    <span className="text-white font-semibold text-lg">Springroll Express</span>
                </button>

                {/* Address field */}
                <div className="flex gap-2">
                    <select
                        value={selectedAddress}
                        disabled={!!customAddress}
                        onChange={e => {
                            setSelectedAddress(e.target.value);
                            setCustomAddress("");
                        }}
                        className="px-3 py-2 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                        <option value="">Select your address</option>
                        {addresses.map((addr, idx) => (
                            <option key={idx} value={addr}>
                                {addr}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Or enter new address"
                        value={customAddress}
                        onChange={e => {
                            setCustomAddress(e.target.value);
                            setSelectedAddress("");
                        }}
                        className="px-3 py-2 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>

                <button
                    onClick={() => navigate("/")}
                    className="bg-green-400 text-black px-4 py-2 rounded hover:bg-green-500 transition"
                >
                    Log Out
                </button>
            </div>

            {/* Banner */}
            <div className="w-full relative mb-4">
                <img
                    src={store?.banner || SharedUrl.P_BACKDROP_URL}
                    alt="Banner"
                    className="w-full h-40 object-cover"
                />
                <img
                    src={ICON_URL}
                    alt="Store Logo"
                    className="absolute -bottom-16 left-7 w-32 h-32 rounded-full border-4 border-white"
                />
            </div>

            {/* Store Info */}
            <div className="pt-20 px-6 pb-4">
                <h1 className="text-3xl font-bold">{store.name}</h1>
                <p className="text-gray-300 mt-2">{store.description}</p>
            </div>

            {/* Categories */}
            {store.itemGroups && store.itemGroups.length > 0 && (
                <div className="px-6 pb-4 overflow-x-auto">
                    <div className="flex space-x-4">
                        {store.itemGroups.map(group => (
                            <button
                                key={group.name}
                                onClick={() => setActiveCategory(group.name)}
                                className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                                    activeCategory === group.name 
                                        ? "bg-green-400 text-black font-semibold" 
                                        : "bg-gray-700 text-white hover:bg-gray-600"
                                }`}
                            >
                                {group.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Content - Items and Cart */}
            <div className="px-6 pb-6 flex gap-6">
                {/* Items Grid */}
                <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(!store?.items || store.items.length === 0) ? (
                            <h1 className="text-xl font-semibold col-span-full">
                                No items available, check back later!
                            </h1>
                        ) : (
                            store.items
                                .filter(
                                    (item) =>
                                        !activeCategory || 
                                        item.itemGroupIds?.includes(activeCategory)
                                )
                                .map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                                    >
                                        <img
                                            src={item.image || SharedUrl.P_BACKDROP_URL}
                                            alt={item.name}
                                            className="h-48 w-full object-cover"
                                        />
                                        <div className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-lg font-semibold flex-1">
                                                    {item.name}
                                                </h3>
                                                <p className="text-lg font-bold ml-2">{item.price} €</p>
                                            </div>
                                            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                                                {item.description || "Delicious item from our menu"}
                                            </p>
                                            <button
                                                onClick={() => addToCart(item)}
                                                className="w-full bg-green-400 text-black px-3 py-2 rounded font-medium hover:bg-green-500 transition"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </div>

                {/* Right Sidebar - Cart */}
                <div className="w-80 flex-shrink-0">
                    <div className="sticky top-20 bg-gray-800 p-4 rounded-lg shadow-lg">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Cart</h2>
                            <button
                                onClick={clearCart}
                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                            >
                                Clear
                            </button>
                        </div>

                        {/* Scrollable cart items */}
                        <div className="max-h-[60vh] overflow-y-auto mb-4">
                            {Object.values(cart).length === 0 ? (
                                <p className="text-gray-400 text-center py-8">Your cart is empty</p>
                            ) : (
                                <div className="space-y-3">
                                    {Object.values(cart).map(({ item, quantity }) => (
                                        <div key={item.id} className="flex items-center gap-3 bg-gray-700 p-2 rounded">
                                            <img
                                                src={item.image || SharedUrl.P_BACKDROP_URL}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate">{item.name}</p>
                                                <p className="text-sm font-bold">{item.price} €</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => removeFromCart(item)}
                                                    className="bg-gray-600 px-2 py-1 rounded hover:bg-gray-500 transition"
                                                >
                                                    -
                                                </button>
                                                <span className="w-6 text-center">{quantity}</span>
                                                <button
                                                    onClick={() => addToCart(item)}
                                                    className="bg-gray-600 px-2 py-1 rounded hover:bg-gray-500 transition"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer - Order button */}
                        <button
                            onClick={handlePay}
                            className="w-full bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={Object.values(cart).length === 0}
                        >
                            Order Total: {cartFinalPrice.toFixed(2)} €
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreDetail;