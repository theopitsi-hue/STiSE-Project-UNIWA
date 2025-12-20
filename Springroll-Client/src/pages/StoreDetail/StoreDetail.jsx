import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Placeholder images
const BACKDROP_URL =
    "https://cdn.pixabay.com/photo/2015/11/06/15/04/bamboo-1028699_1280.jpg";
const ICON_URL =
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pngarts.com%2Ffiles%2F10%2FCircle-PNG-Transparent-Image.png&f=1&nofb=1&ipt=75453769b9e44f72b538b29c8eaddfd56aecf437a0e17737e515f35a8f1d44d5";

const CART_MOD_URL = "http://localhost:8080/api/cart/mod";

const StoreDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("");
    const [cart, setCart] = useState({});
    const [cartFinalPrice, setCartFinalPrice] = useState(0);

    const marqueeRef = useRef(null);

    const HEADER_HEIGHT = 64;
    const MARQUEE_HEIGHT = 40;
    const HEADER_TOTAL = HEADER_HEIGHT + MARQUEE_HEIGHT;

    useEffect(() => {
        fetch(`http://localhost:8080/api/stores/${slug}`, { credentials: "include" })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                if (!data) {
                    navigate("/stores", { replace: true });
                    return;
                }
                setStore(data);
                if (data.itemGroups?.length) setActiveCategory(data.itemGroups[0].name);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                navigate("/stores", { replace: true });
            });
    }, [slug, navigate]);

    if (loading)
        return <p className="text-center mt-8 text-white">Loading store...</p>;

    const modifyCartOnServer = async (itemId, change = 1, clear = false) => {
        try {
            const response = await fetch(CART_MOD_URL, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemId, change, clear }),
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error("Cart modification error:", errText);
                return;
            }

            const data = await response.json();
            const updatedCart = {};

            data.items.forEach((ci) => {
                updatedCart[ci.itemId] = {
                    item: {
                        id: ci.itemId,
                        name: ci.name,
                        price: ci.price,
                        image: ci.image || BACKDROP_URL,
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

    const addToCart = (item) => modifyCartOnServer(item.id, 1);
    const removeFromCart = (item) => modifyCartOnServer(item.id, -1);
    const clearCart = () => modifyCartOnServer(null, 0, true);

    return (
        <div
            className="bg-gray-900 text-white w-full y-full"
            style={{ paddingTop: `${HEADER_TOTAL}px` }}
        >
            {/* Navbar */}
            <div
                className="w-full bg-gray-800 shadow-md px-8 py-3 flex items-center justify-between fixed top-0 z-30"
                style={{ height: `${HEADER_HEIGHT}px` }}
            >
                <button
                    onClick={() => navigate("/stores")}
                    className="bg-green-400 text-black px-4 py-2 rounded hover:bg-green-500 transition"
                >
                    Back to Stores
                </button>
                <h1 className="text-xl font-semibold">{store?.name || "Store"}</h1>
            </div>

            {/* Marquee */}
            <div
                className="w-full fixed z-20 overflow-hidden bg-gradient-to-t from-gray-900 to-green-700 py-2"
                style={{ top: `${HEADER_HEIGHT}px`, height: `${MARQUEE_HEIGHT}px` }}
            >
                <div className="flex whitespace-nowrap animate-marquee" ref={marqueeRef}>
                    <span className="text-white mx-4">
                        Welcome to {store?.name}! Enjoy our fresh items and daily specials! Free delivery
                        on orders over 20€!
                    </span>
                    <span className="text-white mx-4">
                        Welcome to {store?.name}! Enjoy our fresh items and daily specials! Free delivery
                        on orders over 20€!
                    </span>
                </div>
            </div>

            {/* Banner */}
            <div className="w-full relative">
                <img src={BACKDROP_URL} alt="Banner" className="w-full h-1/2 relative object-cover" />
                <img
                    src={ICON_URL}
                    alt="Store Logo"
                    className="absolute -bottom-16 left-7 w-32 h-32 rounded-full border-4 border-white"
                />
            </div>

            {/* Store Info */}
            <div className="pt-2 px-44">
                <h1 className="text-xl font-semibold leading-[1]">{store?.name}</h1>
                <p className="text-gray-300 mt-3 leading-[1]">
                    Fresh and delicious items curated just for you!
                </p>
            </div>

            {/* Main Grid Layout */}
            <div
                className="grid gap-3 mt-4 px-3"
                style={{ gridTemplateColumns: "minmax(150px, 1fr) 3fr minmax(250px, 1fr)" }}
            >
                {/* Left Sidebar - Categories */}
                <div
                    className="sticky bg-gray-900 pr-1 sticky top-28 h-[80vh]"
                    style={{ top: `${HEADER_TOTAL}px` }}
                >
                    {store?.itemGroups?.map((group) => (
                        <button
                            key={group.name}
                            onClick={() => setActiveCategory(group.name)}
                            className={`w-full text-left px-4 py-2 mb-2 rounded-lg transition-colors ${activeCategory === group.name
                                ? "bg-green-400 text-black font-semibold"
                                : "bg-gray-800 text-white hover:bg-gray-700"
                                }`}
                        >
                            {group.name}
                        </button>
                    ))}
                </div>

                {/* Items */}
                <div className="grid grid-cols-2 gap-3">
                    {(!store?.items || store.items.length === 0) ? (
                        <h1 className="text-xl font-semibold">
                            No items available, check back later!
                        </h1>
                    ) : (
                        store.items
                            .filter(
                                (item) =>
                                    item.itemGroupIds?.includes(activeCategory) || activeCategory === "popular"
                            )
                            .map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                                >
                                    <img
                                        src={item.image || BACKDROP_URL}
                                        alt={item.name}
                                        className="h-48 w-full object-cover"
                                    />
                                    <div className="px-3 py-2 flex flex-col justify-between leading-[2]">
                                        <div>
                                            <div className="flex items-center justify-between mb-[1] leading-[1]">
                                                <h3 className="text-xl font-semibold leading-[1] whitespace-normal break-words">
                                                    {item.name}
                                                </h3>
                                                <p className="mt-2 font-bold leading-[1]">{item.price} €</p>
                                            </div>
                                            <p className="text-gray-300 mt-1 leading-[1.1]">{item.description || ""}</p>
                                        </div>
                                        <button
                                            onClick={() => addToCart(item)}
                                            className="mt-1 leading-[1] bg-green-400 text-black px-3 py-2 rounded hover:bg-green-500 transition"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))
                    )}
                </div>

                {/* Right Sidebar - Cart */}
                <div
                    className="sticky bg-gray-800 p-2 top-28 h-[80vh] rounded-lg flex flex-col shadow-lg overflow-hidden w-105"
                    style={{ top: `${HEADER_TOTAL}px` }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2 flex-shrink-0">
                        <h2 className="text-lg font-semibold m-2 leading-[1]">Cart</h2>
                        <button
                            onClick={clearCart}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                            Clear
                        </button>
                    </div>

                    {/* Scrollable cart items */}
                    <div className="overflow-y-auto flex-1">
                        {Object.values(cart).length === 0 ? (
                            <p className="text-gray-400">Your cart is empty</p>
                        ) : (
                            Object.values(cart).map(({ item, quantity }) => (
                                <div key={item.id} className="flex items-center justify-between mb-2">
                                    <img
                                        src={item.image || BACKDROP_URL}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1 px-2">
                                        <p className="text-sm font-semibold leading-[1] m-0">{item.name}</p>
                                        <p className="text-xs text-gray-300 leading-[1.2] m-0 whitespace-normal break-words">
                                            {item.name}
                                        </p>
                                        <p className="text-sm font-bold leading-[2] m-0">{item.price} €</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => removeFromCart(item)}
                                            className="bg-gray-700 px-2 rounded hover:bg-gray-600"
                                        >
                                            -
                                        </button>
                                        <span>{quantity}</span>
                                        <button
                                            onClick={() => addToCart(item)}
                                            className="bg-gray-700 px-2 rounded hover:bg-gray-600"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer - always visible order button */}
                    <div className="mt-2 flex-shrink-0">
                        <button
                            onClick={() => alert("Order placed!")}
                            className="w-full bg-green-600 text-white underline bold py-2 rounded hover:bg-green-800"
                            disabled={Object.values(cart).length === 0}
                        >
                            Order Total: {cartFinalPrice.toFixed(2)} €
                        </button>
                    </div>
                </div>


            </div>

            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 15s linear infinite;
        }
      `}</style>
        </div>
    );
};

export default StoreDetail;
