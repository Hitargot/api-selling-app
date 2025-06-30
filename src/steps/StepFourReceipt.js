// steps/StepFourReceipt.jsx
import React from "react";

const StepFourReceipt = ({ handleFileChange, handleSubmit, loading, onBack }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Upload Receipt</h2>

      <input type="file" accept="image/*" onChange={handleFileChange}
        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500" required />

      <div className="flex justify-between gap-4">
        <button type="button" onClick={onBack} className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100">Back</button>
        <button type="submit" disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default StepFourReceipt;
