import React, { useState} from 'react'

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <div className="p-6 sm:p-8 bg-[#0f0f0f] min-h-screen">
      <h1 className="text-3xl font-bold mb-10 text-springOrange text-center">
        Stores
      </h1>
    </div>
  )
}

export default Stores