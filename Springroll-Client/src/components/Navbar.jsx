import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SharedUrl from "../api/sharedUrl";
import { useUser } from "../context/UserContext";

const Navbar = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [addingAddress, setAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState("");
    const [open, setOpen] = useState(false);

    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [confirmDeleteLabel, setConfirmDeleteLabel] = useState("");

    // New state for expandable actions
    const [actionsOpen, setActionsOpen] = useState(false);

    const dropdownRef = useRef(null);
    const actionsRef = useRef(null); // ref for the actions menu

    if (!user) return <p>Loading user...</p>;

    // ---------------- FETCH ADDRESSES ----------------
    const fetchAddresses = async () => {
        fetch(SharedUrl.ADDR, {
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(data => {
                setAddresses(data || []);
                if (data?.length) setSelectedAddress(data[0].id);
            })
            .catch(console.error);
    }

    useEffect(() => {
        fetchAddresses();
    }, []);

    // ---------------- CLICK OUTSIDE ----------------
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
            if (actionsRef.current && !actionsRef.current.contains(e.target)) {
                setActionsOpen(false);
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
                body: JSON.stringify({ address: newAddress })
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error("Failed to add address:", errText);
                return;
            }

            const saved = await res.json();
            setAddresses(prev => [...prev, saved]);
            setSelectedAddress(saved.id);
            setNewAddress("");
            setAddingAddress(false);
            fetchAddresses();

        } catch (err) {
            console.error("Error adding address:", err);
        }
    };

    // ---------------- CONFIRM DELETE ----------------
    const confirmDelete = (id, label) => {
        setConfirmDeleteId(id);
        setConfirmDeleteLabel(label);
    };

    // ---------------- DELETE ADDRESS ----------------
    const deleteAddress = async () => {
        if (!confirmDeleteId) return;

        try {
            const response = await fetch(`${SharedUrl.ADDR}/${Number(confirmDeleteId)}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (response.status === 204) {
                const remaining = addresses.filter(a => a.id !== Number(confirmDeleteId));
                setAddresses(remaining);
                if (selectedAddress === confirmDeleteId) {
                    setSelectedAddress(remaining.length ? remaining[0].id : "");
                }
            } else if (response.status === 404) {
                console.error("Address not found or not owned by user");
            } else {
                console.error("Failed to delete address:", response.status);
            }
        } catch (err) {
            console.error("Error deleting address:", err);
        } finally {
            setConfirmDeleteId(null);
            setConfirmDeleteLabel("");
        }
    };

    // ---------------- LOGOUT ----------------
    const logout = () => {
        fetch(SharedUrl.API + "/account/auth/logout", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        })
            .finally(() => navigate("/"));
    };

    // ---------------- ACTION BUTTON HANDLER ----------------
    const handleActionClick = (action) => {
        console.log("Clicked action:", action);
        setActionsOpen(false);
    };

    const selectedLabel =
        Array.isArray(addresses)
            ? "Delivering To - " + addresses.find(a => a.id === selectedAddress)?.address
            : "Select delivery address";

    return (
        <>
            <div className="w-full bg-gray-800 shadow-md px-8 py-4 flex items-center justify-between fixed top-0 z-30 h-14">
                {/* Logo */}
                <button
                    onClick={() => navigate("/stores")}
                    className="flex items-center gap-2"
                >
                    <img
                        src={SharedUrl.SR_LOGO || SharedUrl.P_ICON_URL}
                        alt="Logo"
                        className="w-13 h-12"
                    />
                    <span className="text-xl font-semibold">Springroll Express</span>
                </button>

                {/* ADDRESS DROPDOWN */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setOpen(o => !o)}
                        className="px-4 py-2 rounded-xl w-100 bg-gray-700 text-white flex items-center justify-between w-64 focus:ring-2 focus:ring-green-400"
                    >
                        <span className="truncate">{selectedLabel || "Add Delivery Address"}</span>
                        <span>▾</span>
                    </button>

                    {open && (
                        <div className="absolute mt-2 w-100 w-64 bg-gray-800 rounded-xl shadow-lg z-40 border-2 border-green-500">
                            {addresses.filter(addr => addr.id != null).map(addr => (
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
                                            confirmDelete(addr.id, addr.address);
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
                        <div className="absolute right-0 mt-2 bg-gray-800 p-3 rounded-xl shadow-lg w-72 z-50 border-2 border-green-800">
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

                {/* EXPANDABLE ACTION BUTTON */}
                <div className="relative ml-2" ref={actionsRef}>
                    <button
                        onClick={() => setActionsOpen(o => !o)}
                        className="bg-gray-700 w-40 focus:ring-2 focus:ring-green-400 text-white px-2 py-1 rounded hover:bg-gray-700 transition"
                    >
                        <div className="flex items-center gap-2">
                            <img
                                src={user.icon_url || SharedUrl.P_ICON_URL}
                                alt={"user_pfp"}
                                className="w-8 h-8 rounded-full border-2 border-white"
                            />
                            <span className="text-m font-bold">
                                User: {user.username}
                            </span>
                        </div>
                    </button>

                    {actionsOpen && (
                        <div className="absolute mt-1 flex flex-col gap-1 w-40 bg-gray-800 rounded shadow-lg border-2 border-green-600 z-50">
                            <button
                                onClick={() => handleActionClick("Favourites")}
                                className="text-m font-semibold px-3 py-1 hover:bg-gray-700 rounded text-white"
                            >
                                Favourites
                            </button>
                            <button
                                onClick={() => handleActionClick("Orders")}
                                className="text-m font-semibold px-3 py-1 hover:bg-gray-700 rounded text-white"
                            >
                                Orders
                            </button>
                            <button
                                onClick={logout}
                                className="text-m font-semibold px-3 py-1 hover:bg-gray-700 rounded text-white"
                            >
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* DELETE CONFIRM MODAL */}
            {confirmDeleteId && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-green-800 rounded-xl p-6 w-[360px] shadow-xl">
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Delete address "{confirmDeleteLabel}"?
                        </h3>

                        <p className="text-gray-300 mb-4 break-words">
                            You wont be able to undo this action.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setConfirmDeleteId(null);
                                    setConfirmDeleteLabel("");
                                }}
                                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={deleteAddress}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
