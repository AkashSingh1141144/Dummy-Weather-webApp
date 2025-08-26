import { motion } from "framer-motion";
import React, { useState } from "react";

const SearchBox = ({ onSearch }) => {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() !== "") {
      onSearch(city); // 🔹 Home.jsx me function call
      setCity(""); // 🔹 input clear
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-md mb-6 px-4 flex gap-2"
    >
      <input
        type="text"
        placeholder="Search city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-1 py-3 rounded-xl text-gray-100 outline-none 
                   focus:ring-2 ring-yellow-400 text-center"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-xl bg-yellow-400 text-white font-semibold 
                   hover:bg-yellow-500 transition"
      >
        Search
      </button>
    </motion.form>
  );
};

export default SearchBox;
