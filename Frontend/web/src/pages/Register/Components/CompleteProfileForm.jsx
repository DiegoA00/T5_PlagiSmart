import React, { useState } from "react";

const CompleteProfileForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    id: "",
    gender: "",
    country: "",
    city: "",
    phone: "",
    email: "",
    address: "",
    commercialName: "",
    companyName: "",
    companyRUC: "",
    companyAddress: "",
    companyPhone: "",
    executiveDirector: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Información adicional enviada:", formData);
    // Enviar los datos al backend
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6">Personal info</h2>
      <div class='mx-auto w-full flex items-center justify-between gap-10'>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
      </div>

      <div class='mx-auto w-full flex items-center justify-between gap-10'>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">ID</label>
          <input
            type="number"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
  
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          >
            <option value="">Choose an option</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            {/*<option value="other">Other</option>*/}
          </select>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Contact info</h2>

      <div class='mx-auto w-full flex items-center justify-between gap-10'>
        <div className="w-1/3">
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
  
        <div className="w-1/3">
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div className="w-1/3">
          <label className="block text-sm font-medium text-gray-700">Personal phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
      </div>

      <div class='mx-auto w-full flex items-center justify-between gap-10'>
        <div className="w-1/3">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="w-2/3">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Company data</h2>
      <div class='mx-auto w-full flex items-center justify-between gap-10'>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Commercial name</label>
          <input
            type="text"
            name="commercialName"
            value={formData.commercialName}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Company name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>

      <div className="mx-auto w-full flex items-center justify-between gap-10">
        <div className="w-1/3">
          <label className="block text-sm font-medium text-gray-700">R.U.C</label>
          <input
            type="text"
            name="companyRUC"
            value={formData.companyRUC}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="w-2/3">
          <label className="block text-sm font-medium text-gray-700">Company address</label>
          <input
            type="tel"
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>

      <div className="mx-auto w-full flex items-center justify-between gap-10">
        <div className="w-1/3">
          <label className="block text-sm font-medium text-gray-700">Company phone</label>
          <input
            type="tel"
            name="companyPhone"
            value={formData.companyPhone}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="w-2/3">
          <label className="block text-sm font-medium text-gray-700">Executive director</label>
          <input
            type="text"
            name="executiveDirector"
            value={formData.executiveDirector}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Save changes
        </button>
      </div>
    </form>
  );
};

export default CompleteProfileForm;
