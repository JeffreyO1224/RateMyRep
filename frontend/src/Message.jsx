import React, { useState } from "react";
import { useParams } from "react-router-dom";
import api from "./api";
const Message = () => {
    const billNameList = [];
    // bills checked in repPage are added to a local list
    // need a way to pass that list here to be parsed into GPT
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        zipCode: "",
        effects: "",
        changes: "",
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted data:", formData);
    // You can add further logic here (e.g., API call)
    try {
        const response = await api.get(`/generate/${formData}`)
        setData(json);
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  

  

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
      />
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        name="zipcode"
        placeholder="Zipcode"
        value={formData.zipcode}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        name="effects"
        placeholder="What are the effects of the bills you selected?"
        value={formData.effects}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        name="changes"
        placeholder="Things you would change about the bills you selected"
        value={formData.effects}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        Submit
      </button>
    </form>
  );
};

export default Message;