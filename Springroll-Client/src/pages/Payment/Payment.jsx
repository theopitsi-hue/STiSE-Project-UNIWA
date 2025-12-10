import React, { useState } from "react";
import productA from "./souvlaki.png";

const Payment = () => {
    const [method, setMethod] = useState("card");
    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    const [error, setError] = useState("");

    //Sample cart items
    const [cart, setCart] = useState([
        { id: 1, name: "Springrolls yum yum", price: 8.30, quantity: 1, img: productA },
        { id: 2, name: "Souvlakara", price: 3.80, quantity: 2, img: "https://via.placeholder.com/40" },
    ]);

    return (
        <><div className="w-full max-w-[480px] mx-auto p-6 sm:p-8 bg-[#0f0f0f] rounded-2xl shadow-lg space-y-6">

            {/* Header */}
            <h2 className="text-3xl font-semibold text-springOrange text-center mb-6">
                Payment Method
            </h2>

            {/* Payment Method Tabs */}
            <div className="flex bg-[#1a1a1a] rounded-lg overflow-hidden border border-springOrange/40">
                {["card", "paypal", "cash"].map((m) => (
                    <button
                        key={m}
                        onClick={() => setMethod(m)}
                        className={`w-full py-3 font-semibold transition-colors ${method === m
                            ? "bg-springGreenMedium text-white"
                            : "text-gray-400 hover:text-white"}`}
                    >
                        {m.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* CARD FORM */}
            {method === "card" && (
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Cardholder Name"
                        className="w-full p-3 bg-[#2d2d2d] text-white rounded-lg outline-none" />
                    <input
                        type="text"
                        placeholder="Card Number"
                        className="w-full p-3 bg-[#2d2d2d] text-white rounded-lg outline-none" />
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-1/2 p-3 bg-[#2d2d2d] text-white rounded-lg outline-none" />
                        <input
                            type="password"
                            placeholder="CVV"
                            className="w-1/2 p-3 bg-[#2d2d2d] text-white rounded-lg outline-none" />
                    </div>
                    <button className="w-full p-3 bg-springGreenMedium text-white rounded-lg font-bold">
                        Pay Now
                    </button>
                </div>
            )}

            {/* PAYPAL */}
            {method === "paypal" && (
                <div className="p-4 bg-[#2d2d2d] rounded-lg text-white">
                    <p>You will be redirected to PayPal to complete your payment.</p>
                    <button className="w-full mt-4 p-3 bg-springGreenMedium text-white rounded-lg font-bold">
                        Continue to PayPal
                    </button>
                </div>
            )}
            {/* CASH */}
            {method === "cash" && (
                <div className="p-4 bg-[#2d2d2d] rounded-lg text-white">
                    <p className="mb-2 font-semibold text-springOrange">Cash Payment</p>
                    <p>You will pay the driver upon delivery. Be kind and leave tips yeah?</p>
                    <button className="w-full mt-4 p-3 bg-springGreenMedium text-white rounded-lg font-bold">
                        Confirm Order
                    </button>
                </div>
            )}
        </div>
        <div className="w-80 bg-[#1a1a1a] p-4 rounded-lg space-y-4 flex-shrink-0">
                <h3 className="text-xl font-semibold text-springOrange mb-4 text-center">Your Cart</h3>
                {cart.length === 0 ? (
                    <p className="text-gray-400 text-center">Your cart is empty</p>
                ) : null}
            </div>
        </>

    );
};

export default Payment;