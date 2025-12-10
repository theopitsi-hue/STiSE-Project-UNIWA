import React, { useState } from "react";

const Payment = () => {
    const [method, setMethod] = useState("card");

    return (
        <div className="min-h-screen w-full flex justify-center items-start py-10 bg-[#000501]">
            <div className="w-full max-w-lg bg-[#1e1e1e] p-6 rounded-xl shadow-lg">
                <h2 className="text-3xl font-semibold text-springOrange mb-6">
                    Payment Method
                </h2>
                {/* Payment Method Tabs */}
                <div className="flex mb-6 bg-[#2d2d2d] rounded-lg overflow-hidden">
                    {["card", "paypal", "cash"].map((m) => (
                        <button
                            key={m}
                            onClick={() => setMethod(m)}
                            className={`w-full py-3 font-semibold transition-colors ${method === m
                                ? "bg-springOrange text-black"
                                : "text-white hover:bg-[#3a3a3a]"
                                }`}
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
                            className="w-full p-3 bg-[#2d2d2d] text-white rounded-lg outline-none"
                        />
                        <input
                            type="text"
                            placeholder="Card Number"
                            className="w-full p-3 bg-[#2d2d2d] text-white rounded-lg outline-none"
                        />
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="MM/YY"
                                className="w-1/2 p-3 bg-[#2d2d2d] text-white rounded-lg outline-none"
                            />
                            <input
                                type="password"
                                placeholder="CVV"
                                className="w-1/2 p-3 bg-[#2d2d2d] text-white rounded-lg outline-none"
                            />
                        </div>
                        <button className="w-full p-3 bg-springOrange text-black rounded-lg font-bold">
                            Pay Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payment;