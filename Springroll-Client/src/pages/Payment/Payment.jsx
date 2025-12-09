import React, { useState } from "react";

const Payment = () => {
    const [method, setMethod] = useState("card");

    return (
        <div className="min-h-screen w-full flex justify-center items-start py-10 bg-springGreenDark">
            <div className="w-full max-w-lg bg-[#1e1e1e] p-6 rounded-xl shadow-lg">
                <h2 className="text-3xl font-semibold text-springOrange mb-6">
                    Payment Method
                </h2>
            </div>
        </div>
    );
};

export default Payment;