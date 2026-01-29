import React, { useState, useEffect, useRef } from "react";
import SharedUrl from "../../api/sharedUrl";
import { useNavigate } from "react-router-dom";

const Payment = () => {
    const [method, setMethod] = useState("card");
    const [cart, setCart] = useState({});
    const [cartFinalPrice, setCartFinalPrice] = useState(0);
    const navigate = useNavigate();

    // ---------------- ADDRESS DROPDOWN STATE ----------------
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [addingAddress, setAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState("");
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    // ---------------- FETCH ADDRESSES ----------------
    const fetchAddresses = async () => {
        try {
            const res = await fetch(SharedUrl.ADDR, {
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            setAddresses(data || []);
            if (data?.length) setSelectedAddress(data[0].id);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    // ---------------- CLICK OUTSIDE ----------------
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // ---------------- ADD ADDRESS ----------------
    const addNewAddress = async () => {
        if (!newAddress.trim()) return;
        try {
            const res = await fetch(SharedUrl.ADDR, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address: newAddress }),
            });
            if (!res.ok) throw new Error(await res.text());
            const saved = await res.json();
            setAddresses((prev) => [...prev, saved]);
            setSelectedAddress(saved.id);
            setNewAddress("");
            setAddingAddress(false);
            fetchAddresses();
        } catch (err) {
            console.error("Error adding address:", err);
        }
    };

    // ---------------- CART FETCH ----------------
    useEffect(() => {
        fetch(`${SharedUrl.CART}/get`, { credentials: "include" })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                if (!data) return;

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
            .catch((err) => console.error(err));
    }, []);

    const modifyCartOnServer = async (itemId, change = 1, clear = false) => {
        try {
            const response = await fetch(SharedUrl.CART + "/modify", {
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

    const selectedLabel =
        Array.isArray(addresses)
            ? addresses.find((a) => a.id === selectedAddress)?.address
            : "Select delivery address";

    return (
        <div
            className="relative min-h-screen w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${SharedUrl.SR_CHECKOUT_BANNER})` }}
        >
            {/* Full page black overlay */}
            <div className="absolute inset-0 bg-black/70 z-0"></div>

            <div className="relative z-10 flex flex-col items-center w-full">
                {/* Logo + Text */}
                <div className="flex items-center my-6">
                    <img
                        src={SharedUrl.SR_LOGO}
                        alt="Logo"
                        className="w-64 h-64 object-contain"
                    />
                    <div>
                        <h1 className="text-4xl font-bold text-white">
                            Springroll Express
                        </h1>
                        <h2 className="text-xl italic text-green-400">
                            Thank you for shopping with us!
                        </h2>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row w-full max-w-[1200px] p-6 sm:p-8 bg-[#0f0f0f] rounded-2xl shadow-lg gap-6">
                    {/* Left: Payment Method */}
                    <div className="flex-1 space-y-6">
                        <h2 className="text-3xl font-semibold text-springOrange text-center mb-6">
                            Payment Method
                        </h2>

                        <div className="flex bg-[#1a1a1a] rounded-lg overflow-hidden border border-springOrange/40">
                            {["card", "paypal", "cash"].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMethod(m)}
                                    className={`w-full py-3 font-semibold transition-colors ${method === m
                                        ? "bg-springGreenMedium text-white"
                                        : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    {m.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        {/* Payment input fields */}
                        {method === "card" && (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Cardholder Name"
                                    className="w-full px-5 py-3 rounded-xl bg-gray-800 text-white outline-none focus:ring-2 focus:ring-green-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Card Number"
                                    className="w-full px-5 py-3 rounded-xl bg-gray-800 text-white outline-none focus:ring-2 focus:ring-green-400"
                                />
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        className="w-full px-5 py-3 rounded-xl bg-gray-800 text-white outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                    <input
                                        type="password"
                                        placeholder="CVV"
                                        className="w-full px-5 py-3 rounded-xl bg-gray-800 text-white outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>
                            </div>
                        )}

                        {method === "paypal" && (
                            <div className="p-4 bg-gray-800 rounded-lg text-white">
                                <p>You will be redirected to PayPal to complete your payment.</p>
                            </div>
                        )}

                        {method === "cash" && (
                            <div className="p-4 bg-gray-800 rounded-lg text-white">
                                <p>
                                    You will pay the driver upon delivery. Be kind and leave tips
                                    yeah?
                                </p>
                            </div>
                        )}
                        {/* --------- ADDRESS DROPDOWN --------- */}
                        <h2 className="text-3xl font-semibold text-springOrange text-center mb-3 pt-4 anchor-bottom m-2">
                            Delivery Address
                        </h2>
                        <div className="relative mt-2" ref={dropdownRef}>
                            <button
                                onClick={() => setOpen((o) => !o)}
                                className="px-4 py-2 rounded-xl w-full bg-gray-700 text-white flex items-center justify-between focus:ring-2 focus:ring-green-400"
                            >
                                <span className="truncate">
                                    {selectedLabel || "Add Delivery Address"}
                                </span>
                                <span>▾</span>
                            </button>

                            {open && (
                                <div className="absolute text-white mt-2 w-full bg-gray-800 rounded-xl shadow-lg z-40 border-2 border-green-500">
                                    {addresses.filter((addr) => addr.id != null).map((addr) => (
                                        <div
                                            key={addr.id}
                                            className="flex rounded-xl items-center justify-between px-3 py-2 hover:bg-gray-700"
                                        >
                                            <span
                                                onClick={() => {
                                                    setSelectedAddress(addr.id);
                                                    setOpen(false);
                                                }}
                                                className="flex-1 cursor-pointer truncate"
                                            >
                                                {addr.address}
                                            </span>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Optional: handle delete here
                                                }}
                                                className="ml-2 text-gray-400 bold hover:text-red-400 text-sm"
                                                title="Delete address"
                                            >
                                                X
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => {
                                            setAddingAddress(true);
                                            setOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-green-400 hover:bg-gray-700 rounded-b-xl"
                                    >
                                        + Add new address
                                    </button>
                                </div>
                            )}

                            {addingAddress && (
                                <div className="absolute text-white right-0 mt-2 bg-gray-800 p-3 rounded-xl shadow-lg w-full z-50 border-2 border-green-800">
                                    <input
                                        type="text"
                                        value={newAddress}
                                        onChange={(e) => setNewAddress(e.target.value)}
                                        placeholder="Enter new address"
                                        className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white outline-none"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={addNewAddress}
                                            className="flex-1 bg-green-400 text-black py-1 rounded hover:bg-green-500"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setAddingAddress(false);
                                                setNewAddress("");
                                            }}
                                            className="flex-1 bg-gray-600 py-1 rounded hover:bg-gray-500"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Cart */}
                    <div className="w-full lg:w-1/2 bg-gray-800 p-4 rounded-lg flex flex-col text-gray-300 border-2 border-green-800">
                        <div className="flex-1 overflow-y-auto max-h-[500px]">
                            {Object.keys(cart).length === 0 ? (
                                <p className="text-gray-400 text-center">Your cart is empty</p>
                            ) : (
                                Object.values(cart).map(({ item, quantity }) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between mb-2 p-3 m-0 bg-gray-900 rounded "
                                    >
                                        <img
                                            src={item.image || SharedUrl.P_BACKDROP_URL}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1 px-2">
                                            <p className="text-xl text-gray-200 font-semibold leading-[1] m-1">
                                                {item.name}
                                            </p>
                                            <p className="text-xl font-bold leading-[1] m-1">
                                                {item.price} €
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span>{quantity}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="border-t text-xl p-3 border-gray-700 pt-2 flex justify-between text-white font-bold mt-2">
                            <span>Total:</span>
                            <span>{cartFinalPrice}€</span>
                        </div>

                        <button className="w-full p-3 bg-green-600 text-white rounded-lg font-bold mt-[2] hover:bg-green-800 transition">
                            Pay Now
                        </button>
                        <button
                            className="w-full p-3 bg-gray-500 text-white rounded-lg font-bold mt-2 hover:bg-springOrange transition"
                            onClick={() => navigate("/stores")}
                        >
                            Forgot Something?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
