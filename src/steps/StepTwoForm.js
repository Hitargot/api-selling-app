// steps/StepTwoForm.jsx
import React from "react";

const StepTwoForm = ({ formData, handleChange, onNext, onBack, loading, selectedPackage }) => {
  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onNext(); }}>
      <h2 className="text-2xl font-semibold text-gray-800">Your Details</h2>

      <div>
        <label className="block font-medium text-gray-700">Full Name</label>
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
          className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500" required />
      </div>

      <div>
        <label className="block font-medium text-gray-700">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange}
          className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500" required />
      </div>

      <div>
        <label className="block font-medium text-gray-700">Phone Number</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
          className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500" required />
      </div>

      <div className="flex justify-between gap-4">
        <button type="button" onClick={onBack} className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100">Back</button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
          {loading ? "Loading..." : "Next"}
        </button>
      </div>
    </form>
  );
};

export default StepTwoForm;
