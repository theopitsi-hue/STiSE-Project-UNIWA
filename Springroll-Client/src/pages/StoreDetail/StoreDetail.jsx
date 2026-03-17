import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SharedUrl from "../../api/sharedUrl";
import Navbar from "../../components/Navbar";

const CART_MOD_URL = SharedUrl.CART + "/mod";

const StoreDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("");
    const [cart, setCart] = useState({});
    const [cartFinalPrice, setCartFinalPrice] = useState(0);
    const groupRefs = useRef({});
    const itemsContainerRef = useRef(null);

    const scrollToGroup = (groupName) => {
        setActiveCategory(groupName);
        const el = groupRefs.current[groupName];
        const container = itemsContainerRef.current;
        if (el && container) {
            // scroll the container so the group header is at the top (respecting any sticky header)
            const offset = el.offsetTop - container.offsetTop - 8; // small offset
            container.scrollTo({ top: offset, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        fetch(`${SharedUrl.STORES}/${slug}`, { credentials: "include" })
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

        fetch(`${SharedUrl.CART}/get/${slug}`, { credentials: "include" })
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
            .catch(err => {
                console.error(err);
                navigate("/login", { replace: true });
            });
    }, [slug, navigate]);

    if (loading)
        return <p className="text-center mt-8 text-white">Loading store...</p>;

    const modifyCartOnServer = async (itemId, change = 1, clear = false, storeId = store.id) => {
        try {
            const response = await fetch(CART_MOD_URL, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemId, change, clear, storeId }),
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
                        image: ci.image || SharedUrl.P_BACKDROP_URL,
                    },
                    quantity: ci.quantity,
                };
            });

            setCart(updatedCart);
            setCartFinalPrice(data.finalPrice);
        } catch (err) {
            console.error("Cart modification exception:", err);
            navigate("/login", { replace: true });
        }
    };

    const handlePay = () => {
        if (cartFinalPrice > 0) {
            localStorage.setItem("storeId", store.id);
            navigate("/payment", {
                state: { cart, cartFinalPrice, storeId: store.id }
            });
        }
    };

    const addToCart = (item) => modifyCartOnServer(item.id, 1);
    const removeFromCart = (item) => modifyCartOnServer(item.id, -1);
    const clearCart = () => modifyCartOnServer(null, 0, true);

    return (
        <div
            className="bg-gray-900 text-white w-screen min-h-screen"
            style={{ paddingTop: "64px", width: "100vw" }}
        >
            {/* custom Navbar */}
            <Navbar />

            {/* Banner */}
            <div className="w-full relative">
                <img src={store?.banner || SharedUrl.P_BACKDROP_URL}
                    alt="Banner" className="w-full h-32 relative object-cover"
                    style={{ height: "138px", bottom: "20px" }}
                />
                <img
                    src={store?.icon || SharedUrl.P_ICON_URL}
                    alt="Store Logo"
                    className="absolute -bottom-16 left-7 w-32 h-32 rounded-full border-4 border-white"

                />
            </div>

            {/* Store Info */}
            <div className="pt-2 px-44" style={{ marginTop: '-20px' }}>
                <h1 className="text-xxl font-semibold leading-[1]">{store?.name}</h1>
                <p className="text-gray-300 mt-3 leading-[1]">
                    {store?.description || "Placeholder Description Text"}
                </p>
            </div>

            {/* Main Grid Layout */}
            <div
                className="grid gap-4 mt-4 px-5"
                style={{ gridTemplateColumns: "minmax(150px, 1fr) 3fr minmax(250px, 1fr)" }}
            >
                {/* Left Sidebar - Categories */}
                <div
                    className="sticky bg-gray-900 pr-1 sticky top-28 h-[80vh] w-105"
                    style={{ top: "84px" }}
                >
                    {store?.itemGroups?.filter((group) => store.items?.some((item) => item.itemGroupIds?.includes(group.name))).map((group) => (
                        <button
                            key={group.name}
                            onClick={() => scrollToGroup(group.name)}
                            className={`w-full text-left px-4 py-2 mb-2 rounded-lg transition-colors ${activeCategory === group.name
                                ? "bg-green-400 text-black font-semibold"
                                : "bg-gray-800 text-white hover:bg-gray-700"
                                }`}
                        >
                            {group.name}
                        </button>
                    ))}
                </div>

                {/* Items: grouped by category with scroll targets */}
                <div ref={itemsContainerRef} className="space-y-6 overflow-y-auto h-[80vh] pr-2">
                    {(!store?.items || store.items.length === 0) ? (
                        <h1 className="text-xl font-semibold">No items available, check back later!</h1>
                    ) : (
                        store.itemGroups
                            ?.filter((group) => store.items?.some((item) => item.itemGroupIds?.includes(group.name)))
                            .map((group, gi) => {
                                const groupItems = store.items.filter((item) => item.itemGroupIds?.includes(group.name));
                                return (
                                    <div key={group.name} ref={(el) => (groupRefs.current[group.name] = el)} className="w-full">
                                        <h2 className="text-s font-semibold mb-2" style={{ scrollMarginTop: '80px' }}>{group.name}</h2>

                                        <div className="grid grid-cols-3 gap-3">
                                            {groupItems.length === 0 ? (
                                                <p className="text-gray-400">No items in this category</p>
                                            ) : (
                                                groupItems.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                                                    >
                                                        <img
                                                            src={item.image || SharedUrl.P_BACKDROP_URL}
                                                            alt={item.name}
                                                            className="h-48 w-full object-cover"
                                                        />
                                                        <div className="px-3 py-2 flex flex-col justify-between leading-[2]">
                                                            <div>
                                                                <div className="flex items-center justify-between mb-[1] leading-[1]">
                                                                    <h3 className="text-xl font-semibold leading-[1] whitespace-normal break-words">
                                                                        {item.name}
                                                                    </h3>

                                                                    <p className="mt-2 font-bold">{item.price} €</p>
                                                                </div>
                                                                <p className=" leading-[1] text-gray-400 whitespace-normal break-words">
                                                                    {item.description}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => addToCart(item)}
                                                                className="mb-1 leading-[1] bg-green-400 text-black px-3 py-2 rounded hover:bg-green-500 transition"
                                                            >
                                                                Add to Cart
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        {gi < (store.itemGroups?.length || 0) - 1 && (
                                            <div className="my-4 border-t border-gray-700" />
                                        )}
                                    </div>
                                );
                            })
                    )}
                </div>

                {/* Right Sidebar - Cart */}
                <div
                    className="sticky bg-gray-800 p-2 top-28 h-[80vh] rounded-lg flex flex-col shadow-lg overflow-hidden w-105"
                    style={{ top: "64px" }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2 flex-shrink-0">
                        <h2 className="text-xxl font-semibold m-2 leading-[1]">Cart</h2>
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
                                <div key={item.id} className="flex items-center justify-between mb-2 p-1">
                                    <img
                                        src={item.image || SharedUrl.P_BACKDROP_URL}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1 px-2">
                                        <p className="text-xl font-semibold leading-[1] m-0">{item.name}</p>
                                        <p className="text-m font-bold leading-[2] m-0">{(item.price * quantity).toFixed(2)} €</p>
                                    </div>
                                    <div className="flex items-center space-x-1">
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

                    {/*order button */}
                    <div className="mt-2 flex-shrink-0">
                        <button
                            onClick={handlePay}
                            className={Object.values(cart).length === 0
                                ? "w-full text-xl py-2 rounded bg-gray-600 text-gray-300 cursor-not-allowed"
                                : "w-full text-xl py-2 rounded bg-green-600 text-white underline hover:bg-green-800"
                            }
                            disabled={Object.values(cart).length === 0 || cartFinalPrice < store.minOrder}
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