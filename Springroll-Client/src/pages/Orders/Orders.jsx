import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import SharedUrl from "../../api/sharedUrl";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        fetch(SharedUrl.ORD, {
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                const sorted = (data || []).sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setOrders(sorted);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load orders:", err);
                setLoading(false);
            });
    }, []);

    const toggleOrder = (id) => {
        setExpandedOrder(prev => (prev === id ? null : id));
    };

    if (loading) {
        return (
            <p className="text-center mt-16 text-white text-lg">
                Loading orders...
            </p>
        );
    }

    return (
        <div className="bg-gray-900 min-h-screen text-white w-full">

            {/* Fixed Navbar */}
            <Navbar />

            {/* Main content with padding to prevent overlap */}
            <main className="pt-24 max-w-5xl mx-auto px-6">

                <h1 className="text-5xl font-bold mb-6">
                    Your Orders
                </h1>

                {orders.length === 0 && (
                    <p className="text-gray-400 text-lg">
                        You currently have no orders.
                    </p>
                )}

                <div className="space-y-4">

                    {orders.map(order => (
                        <div
                            key={order.id}
                            className="bg-gray-800 rounded-xl border-2 border-green-800 overflow-hidden flex flex-col scroll-mt-24"
                        >

                            {/* Order header */}
                            <button
                                onClick={() => toggleOrder(order.id)}
                                className="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-gray-700 transition"
                            >
                                <div>
                                    <h2 className="text-xl font-semibold text-orange-400">
                                        Order #{order.id}
                                    </h2>
                                    <p className="text-gray-400">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-green-400 font-semibold">
                                        {order.status}
                                    </p>
                                    <p className="text-white font-bold">
                                        {order.totalPrice} €
                                    </p>
                                </div>
                            </button>

                            {/* Expanded items */}
                            {expandedOrder === order.id && (
                                <div className="px-6 pb-5 pt-4 border-t border-gray-700">

                                    <h3 className="text-lg text-gray-300 mb-3">
                                        Ordered Items
                                    </h3>

                                    <div className="space-y-2">
                                        {order.items?.map(item => {
                                            const lineTotal = item.priceAtOrder * item.quantity;

                                            return (
                                                <div
                                                    key={item.itemId}
                                                    className="flex justify-between bg-gray-900 rounded-lg px-4 py-3"
                                                >
                                                    <div>
                                                        <p className="font-medium">
                                                            {item.quantity} × {item.itemName}
                                                        </p>
                                                        <p className="text-sm text-gray-400">
                                                            {item.priceAtOrder} € each
                                                        </p>
                                                    </div>
                                                    <div className="font-semibold">
                                                        {lineTotal.toFixed(2)} €
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Order total */}
                                    <div className="flex justify-between mt-4 pt-4 border-t border-gray-700 text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-green-400">
                                            {order.totalPrice} €
                                        </span>
                                    </div>

                                </div>
                            )}

                        </div>
                    ))}

                </div>

            </main>
        </div>
    );
};

export default Orders;