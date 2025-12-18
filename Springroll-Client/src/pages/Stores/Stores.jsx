import React, { useState} from 'react'

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    fetch("http://localhost:8080/api/stores", {
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setStores(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 sm:p-8 bg-[#0f0f0f] min-h-screen">
      <h1 className="text-3xl font-bold mb-10 text-springOrange text-center">
        Stores
      </h1>
    </div>
  )
}

export default Stores