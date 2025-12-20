import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Placeholder images
const BACKDROP_URL =
    "https://cdn.pixabay.com/photo/2015/11/06/15/04/bamboo-1028699_1280.jpg";
const ICON_URL =
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pngarts.com%2Ffiles%2F10%2FCircle-PNG-Transparent-Image.png&f=1&nofb=1&ipt=75453769b9e44f72b538b29c8eaddfd56aecf437a0e17737e515f35a8f1d44d5";

const CART_MOD_URL = 'http://localhost:8080/api/cart/mod'

const StoreDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("");
    const [cart, setCart] = useState({});
    const [cartFinalPrice, setCartFinalPrice] = useState(0);


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
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ itemId, change, clear })
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error("Cart modification error:", errText);
                return;
            }

            const data = await response.json(); // CartModificationResponse
            const updatedCart = {};

            data.items.forEach(ci => {
                updatedCart[ci.itemId] = {
                    item: {
                        id: ci.itemId,
                        name: ci.name,
                        price: ci.price,
                        image: ci.image || BACKDROP_URL
                    },
                    quantity: ci.quantity
                };
            });

            setCart(updatedCart);
            setCartFinalPrice(data.finalPrice);
        } catch (err) {
            console.error("Cart modification exception:", err);
        }
    };

    const addToCart = (item) => {
        modifyCartOnServer(item.id, 1); // increase quantity by 1
    };

    const removeFromCart = (item) => {
        modifyCartOnServer(item.id, -1); // decrease quantity by 1
    };

    const clearCart = () => {
        modifyCartOnServer(null, 0, true); // clear flag
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white w-full relative">
            {/* Main Navbar */}
            <div className="w-full bg-gray-800 shadow-md px-8 py-3 flex items-center justify-between fixed top-0 z-30">
                <button
                    onClick={() => navigate("/stores")}
                    className="bg-green-400 text-black px-4 py-2 rounded hover:bg-green-500 transition"
                >
                    Back to Stores
                </button>
                <h1 className="text-xl font-semibold">Springroll Express</h1>
            </div>

            {/* Scrolling Bar */}
            <div className="w-full fixed top-16 z-20 overflow-hidden bg-gradient-to-r from-gray-800 to-green-500 py-2">
                <div className="flex animate-marquee whitespace-nowrap">
                    {/* Duplicate text for smooth loop */}
                    <span className="text-white mx-4 animate-slide-in">
                        Welcome to Springroll Express! Enjoy our fresh spring rolls and daily specials! Free delivery on orders over 20€! Check out our latest offers today!
                    </span>
                    <span className="text-white mx-4 animate-slide-in">
                        Welcome to Springroll Express! Enjoy our fresh spring rolls and daily specials! Free delivery on orders over 20€! Check out our latest offers today!
                    </span>
                </div>
            </div>


            {/* Banner */}
            <div className="w-full relative mt-20">
                <img
                    src={BACKDROP_URL}
                    alt="Banner"
                    className="w-full h-100 object-cover"
                />
                <img
                    src={ICON_URL}
                    alt="Store Logo"
                    className="absolute -bottom-12 left-16 w-24 h-24 rounded-full border-4 border-white"
                />
            </div>

            {/* Store Info */}
            <div className="pt-16 px-16">
                <h1 className="text-xl font-semibold">{store.name}</h1>
                <p className="text-gray-300 mt-3">{store.description}</p>
            </div>

            {/* Main Content */}
            <div className="flex mt-4 px-3 gap-3">
                {/* Left Sidebar - Categories */}
                <div className="w-1/6 sticky top-36 h-[80vh] overflow-y-auto bg-gray-900 pr-1">
                    {store.itemGroups?.map((group) => (
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

                {/* Right Content - Items */}
                <div className="w-3/5 grid grid-cols-2 gap-3">
                    {
                        store.items?.length == 0 || store.items == null ?
                            (
                                <h1 className="text-xl font-semibold">No items available, check back later!</h1>
                            ) : (
                                store.items
                                    ?.filter((item) =>
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
                                            <div className="p-2 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-xl font-semibold">{item.name}</h3>
                                                    <p className="text-gray-300 mt-1">{item.description}</p>
                                                    <p className="mt-2 font-bold">{item.price} €</p>
                                                </div>
                                                <button
                                                    onClick={() => addToCart(item)}
                                                    className="mt-3 bg-green-400 text-black px-3 py-1 rounded hover:bg-green-500 transition"
                                                >
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>

                                    )))}
                </div>

                {/* Right Sidebar - cart */}
                <div className="w-1/4 sticky top-28 h-[80vh] overflow-y-auto bg-gray-800 p-2 rounded-lg flex flex-col justify-between shadow-lg">
                    {/* Top section - Title and Clear Cart */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Cart</h2>
                            <button
                                onClick={clearCart}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Clear
                            </button>
                        </div>

                        {Object.values(cart).length === 0 ? (
                            <p className="text-gray-400">Your cart is empty</p>
                        ) : (
                            <>
                                {Object.values(cart).map(({ item, quantity }) => (
                                    <div key={item.id} className="flex items-center justify-between mb-2">
                                        <img
                                            src={item.image || BACKDROP_URL}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1 px-2">
                                            <p className="text-sm">{item.name}</p>
                                            <p className="text-sm font-bold">{item.price} €</p>
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
                                ))}

                                <div className="mt-4 font-bold">
                                    Total: {cartFinalPrice.toFixed(2)} €
                                </div>
                            </>
                        )}
                    </div>

                    {/* Bottom section - Order button */}
                    <div className="mt-4">
                        <button
                            onClick={() => alert("Order placed!")} // replace with your order logic
                            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                            disabled={Object.values(cart).length === 0} // disable if cart is empty
                        >
                            Order
                        </button>
                    </div>
                </div>


            </div>

            {/* Tailwind keyframes for marquee */}
            <style>{`
    @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-marquee {
    display: inline-flex;
    animation: marquee 15s linear infinite;
  }

  @keyframes slide-in {
    0% { transform: translateX(100%); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateX(0); opacity: 1; }
  }
  .animate-slide-in {
    display: inline-block;
    animation: slide-in 2s ease forwards;
  }
`}</style>
        </div >
    );
};

export default StoreDetail;
