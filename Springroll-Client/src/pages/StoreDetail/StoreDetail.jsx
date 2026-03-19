import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SharedUrl from "../../api/sharedUrl";
import Navbar from "../../components/Navbar";
import { useUser } from "../../context/UserContext";
import PhotoUpload from "../../components/PhotoUpload";

const CART_MOD_URL = SharedUrl.CART + "/mod";

import { Search, IceCream, Pizza, Coffee, Box, Shell, GlassWater, Plus, MoreHorizontal, Pencil, Heart } from "lucide-react";

const StoreDetail = () => {
    const { slug } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();

    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("");
    const [cart, setCart] = useState({});
    const [cartFinalPrice, setCartFinalPrice] = useState(0);
    const [showItemModal, setShowItemModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [itemForm, setItemForm] = useState({
        name: "",
        description: "",
        price: "",
        itemGroupIds: [],
    });
    const [itemImage, setItemImage] = useState(null);

    const groupRefs = useRef({});
    const itemsContainerRef = useRef(null);

    const scrollToGroup = (groupName) => {
        setActiveCategory(groupName);
        const el = groupRefs.current[groupName];
        const container = itemsContainerRef.current;
        if (el && container) {
            const offset = el.offsetTop - container.offsetTop - 8;
            container.scrollTo({ top: offset, behavior: 'smooth' });
        }
    };

    const resetModal = () => {
        setItemForm({ name: "", description: "", price: "", itemGroupIds: [] });
        setItemImage(null);
        setEditingItem(null);
        setShowItemModal(false);
    };

    const openEditModal = (item) => {
        setItemForm({
            name: item.name,
            description: item.description,
            price: item.price,
            itemGroupIds: item.itemGroupIds || [],
        });
        setItemImage(item.image || null);
        setEditingItem(item);
        setShowItemModal(true);
    };

    const handleSaveItem = async () => {
        if (!itemForm.name || !itemForm.price) return;

        const body = {
            ...itemForm,
            price: parseFloat(itemForm.price),
            store: { id: store.id },
        };

        try {
            const url = editingItem
                ? `${SharedUrl.ITEMS}/${editingItem.id}`
                : `${SharedUrl.ITEMS}`;
            const method = editingItem ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error("Failed to save item");

            const savedItem = await res.json();

            setStore(prev => {
                const updatedItems = editingItem
                    ? prev.items.map(i => (i.id === savedItem.id ? savedItem : i))
                    : [...prev.items, savedItem];
                return { ...prev, items: updatedItems };
            });

            resetModal();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteItem = async () => {
        if (!editingItem) return;
        try {
            const res = await fetch(`${SharedUrl.ITEMS}/${editingItem.id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to delete item");

            setStore(prev => ({
                ...prev,
                items: prev.items.filter(i => i.id !== editingItem.id),
            }));
            resetModal();
        } catch (err) {
            console.error(err);
        }
    };

    const addToCart = (item) => modifyCartOnServer(item.id, 1);
    const removeFromCart = (item) => modifyCartOnServer(item.id, -1);
    const clearCart = () => modifyCartOnServer(null, 0, true);

    const modifyCartOnServer = async (itemId, change = 1, clear = false) => {
        try {
            const response = await fetch(CART_MOD_URL, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemId, change, clear, storeId: store.id }),
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error("Cart modification error:", errText);
                return;
            }

            const data = await response.json();
            const updatedCart = {};
            data.items.forEach(ci => {
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
            navigate("/payment", { state: { cart, cartFinalPrice, storeId: store.id } });
        }
    };

    useEffect(() => {
        fetch(`${SharedUrl.STORES}/${slug}`, { credentials: "include" })
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(data => {
                if (!data) navigate("/stores", { replace: true });
                setStore(data);
                if (data.itemGroups?.length) setActiveCategory(data.itemGroups[0].name);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                navigate("/stores", { replace: true });
            });

        fetch(`${SharedUrl.CART}/get/bs/${slug}`, { credentials: "include" })
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(data => {
                if (!data) return;
                const updatedCart = {};
                data.items.forEach(ci => {
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

    if (loading) return <p className="text-center mt-8 text-white">Loading store...</p>;

    return (
        <div className="bg-gray-900 text-white w-screen min-h-screen" style={{ paddingTop: "64px", width: "100vw" }}>
            <Navbar />

            {<div className="w-full relative">
                <img src={`${SharedUrl.MEDIA_STORES}/${store.slug}/${store.slug}_banner.png?ts=${Date.now()}` || SharedUrl.P_BACKDROP_URL} alt="Banner" className="w-full h-32 object-cover" style={{ height: "500px", bottom: "20px" }} />
                {/* { <img src={store?.icon || SharedUrl.P_ICON_URL} alt="Store Logo" className="absolute -bottom-16 left-7 w-32 h-32 rounded-full border-4 border-white" />} */}
            </div>}

            <div className="pt-4 px-12" style={{ marginTop: '-10px' }}>
                <h1 className="text-xxl font-semibold leading-[1]">{store?.name}</h1>
                <p className="text-gray-300 mt-3 leading-[1]">{store?.description || "Placeholder Description Text"}</p>
            </div>

            <div className="grid gap-4 mt-4 px-5" style={{ gridTemplateColumns: "minmax(150px, 1fr) 3fr minmax(250px, 1fr)" }}>
                {/* Left Sidebar */}
                <div className="sticky bg-gray-900 pr-1 top-28 h-[80vh] w-105">
                    {store?.itemGroups?.filter(g => store.items?.some(i => i.itemGroupIds?.includes(g.name)))
                        .sort((a, b) => b.sortIndex - a.sortIndex)
                        .map(group => (
                            <button key={group.name} onClick={() => scrollToGroup(group.name)}
                                className={`w-full text-left px-4 py-2 mb-2 rounded-lg transition-colors ${activeCategory === group.name ? "bg-green-400 text-black font-semibold" : "bg-gray-800 text-white hover:bg-gray-700"}`}>
                                {group.name}
                            </button>
                        ))}
                </div>
                {/* {<div className="flex justify-end mb-2">
                    <button onClick={() => setShowItemModal(true)} className="bg-green-500 px-3 py-1 rounded hover:bg-green-600 text-white">+ New Item</button>
                </div>} */}
                {/* Items */}



                <div ref={itemsContainerRef} className="space-y-6 overflow-y-auto h-[80vh] pr-2">
                    {user?.role === 2 && (<h2 className="text-s font-semibold mb-2" style={{ scrollMarginTop: '80px' }}>Admin</h2>)}
                    {user?.role === 2 && (
                        <button onClick={() => setShowItemModal(true)} className="relative w-full h-1/4 rounded-lg overflow-hidden shadow hover:shadow-xl transition text-left group border-2 border-dashed border-green-600 bg-gray-800 flex items-center justify-center flex-col">
                            <span className="text-sm text-gray-300 mb-2">Create new Item</span>
                            <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center">
                                <Plus className="w-6 h-6" />
                            </div>
                        </button>
                    )
                    }
                    {(!store?.items || store.items.length === 0) ? (
                        <h1 className="text-xl font-semibold">No items available, check back later!</h1>
                    ) : (
                        store.itemGroups?.filter(g => store.items?.some(i => i.itemGroupIds?.includes(g.name)))

                            .sort((a, b) => b.sortIndex - a.sortIndex)
                            .map((group, gi) => {
                                const groupItems = store.items.filter(i => i.itemGroupIds?.includes(group.name));
                                return (
                                    <div key={group.name} ref={el => (groupRefs.current[group.name] = el)} className="w-full">
                                        <h2 className="text-s font-semibold mb-2" style={{ scrollMarginTop: '80px' }}>{group.name}</h2>
                                        <div className="grid grid-cols-3 gap-3">
                                            {groupItems.map(item => (
                                                <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                                                    <div className="relative">
                                                        <img
                                                            src={item.image || SharedUrl.P_BACKDROP_URL}
                                                            alt={item.name}
                                                            className="h-48 w-full object-cover"
                                                        />

                                                        {/* Top-right edit button */}
                                                        {user?.role === 2 && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // prevent card click
                                                                    openEditModal(item);
                                                                }}
                                                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-black flex items-center justify-center shadow z-20 transition transform scale-100 hover:scale-105"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="px-3 py-2 flex flex-col justify-between leading-[2]">
                                                        <div>
                                                            <div className="flex items-center justify-between mb-[1] leading-[1]">
                                                                <h3 className="text-xl font-semibold leading-[1]">{item.name}</h3>
                                                                <p className="mt-2 font-bold">{item.price} €</p>
                                                            </div>
                                                            <p className="leading-[1] text-gray-400">{item.description}</p>
                                                        </div>

                                                        <button
                                                            onClick={() => addToCart(item)}
                                                            className="mb-1 leading-[1] bg-green-400 text-black px-3 py-2 rounded hover:bg-green-500 transition"
                                                        >
                                                            Add to Cart
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {gi < store.itemGroups.length - 1 && <div className="my-4 border-t border-gray-700" />}
                                    </div>
                                );
                            })
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="sticky bg-gray-800 p-2 top-28 h-[80vh] rounded-lg flex flex-col shadow-lg overflow-hidden w-105">
                    <div className="flex items-center justify-between mb-2 flex-shrink-0">
                        <h2 className="text-xxl font-semibold m-2 leading-[1]">Cart</h2>
                        <button onClick={clearCart} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Clear</button>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {Object.values(cart).length === 0 ? <p className="text-gray-400">Your cart is empty</p> :
                            Object.values(cart).map(({ item, quantity }) => (
                                <div key={item.id} className="flex items-center justify-between mb-2 p-1">
                                    <img src={item.image || SharedUrl.P_BACKDROP_URL} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                    <div className="flex-1 px-2">
                                        <p className="text-xl font-semibold leading-[1]">{item.name}</p>
                                        <p className="text-m font-bold leading-[2]">{(item.price * quantity).toFixed(2)} €</p>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <button onClick={() => removeFromCart(item)} className="bg-gray-700 px-2 rounded hover:bg-gray-600">-</button>
                                        <span>{quantity}</span>
                                        <button onClick={() => addToCart(item)} className="bg-gray-700 px-2 rounded hover:bg-gray-600">+</button>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <div className="mt-2 flex-shrink-0">
                        <button onClick={handlePay}
                            className={Object.values(cart).length === 0 ? "w-full text-xl py-2 rounded bg-gray-600 text-gray-300 cursor-not-allowed" : "w-full text-xl py-2 rounded bg-green-600 text-white hover:bg-green-800"}
                            disabled={Object.values(cart).length === 0 || cartFinalPrice < store.minOrder}>
                            Order Total: {cartFinalPrice.toFixed(2)} €
                        </button>
                    </div>
                </div>

                {/* Create/Edit Item Modal */}
                {showItemModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-gray-900 p-6 rounded-lg w-1/4">
                            <h2 className="text-xl font-semibold mb-4">{editingItem ? "Edit Item" : "Create New Item"}</h2>
                            <div className="flex flex-col space-y-1">
                                <PhotoUpload onFileSelect={setItemImage} preview={itemImage} />

                                <label className="block text-sm text-gray-300">Name</label>
                                <input type="text" placeholder="Name" value={itemForm.name} onChange={e => setItemForm({ ...itemForm, name: e.target.value })} className="p-2 rounded bg-gray-800 text-white" />


                                <label className="block text-sm text-gray-300">Description</label>
                                <textarea placeholder="Description" value={itemForm.description} onChange={e => setItemForm({ ...itemForm, description: e.target.value })} className="p-2 rounded bg-gray-800 text-white" />
                                <label className="block text-sm text-gray-300">Price</label>
                                <input type="number" placeholder="Price" value={itemForm.price} onChange={e => setItemForm({ ...itemForm, price: e.target.value })} className="p-2 rounded bg-gray-800 text-white" />

                                {/* Category Multi-select */}
                                <label className="block text-sm text-gray-300 mb-1">Categories</label>
                                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 pr-2 bg-gray-800 rounded">
                                    {[...(store.itemGroups || [])]
                                        .sort((a, b) => b.sortIndex - a.sortIndex)
                                        .map(group => {
                                            const active = itemForm.itemGroupIds.includes(group.name);
                                            return (
                                                <label
                                                    key={group.name}
                                                    className={`flex items-center gap-2 cursor-pointer text-center select-none rounded px-2 py-1 ${active ? 'bg-green-400 text-black font-semibold' : 'text-gray-300 hover:bg-gray-700'}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={active}
                                                        onChange={() => {
                                                            setItemForm(prev => {
                                                                const updated = active
                                                                    ? prev.itemGroupIds.filter(id => id !== group.name)
                                                                    : [...prev.itemGroupIds, group.name];
                                                                return { ...prev, itemGroupIds: updated };
                                                            });
                                                        }}
                                                        className="themed-checkbox"
                                                    />
                                                    <span className="flex-1">{group.name}</span>
                                                </label>
                                            );
                                        })}
                                </div>

                                <div className="flex justify-between space-x-2">
                                    {editingItem && <button onClick={handleDeleteItem} className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white">Delete</button>}
                                    <button onClick={resetModal} className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600">Cancel</button>
                                    <button onClick={handleSaveItem} className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoreDetail;