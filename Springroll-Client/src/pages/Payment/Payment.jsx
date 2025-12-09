import React, { useState } from "react";

const Payment = () => {
  const [method, setMethod] = useState("card");

  return (
    <div>
      <h2>
        Payment Method
      </h2>
    </div>
  );
};

export default Payment;