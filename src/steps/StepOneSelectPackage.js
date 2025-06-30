// steps/StepOneSelectPackage.jsx
import React from "react";

const StepOneSelectPackage = ({ packages, onSelect }) => {
  if (!packages.length) return <p className="text-center py-6">No packages available</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Choose a Package</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {packages.map((pkg, i) => (
          <div
            key={i}
            className="border p-4 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() => onSelect(pkg)}
          >
            <h3 className="text-xl font-bold text-orange-600">{pkg.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
            <ul className="text-sm text-gray-700 list-disc list-inside">
              {pkg.features?.map((f, j) => <li key={j}>{f}</li>)}
            </ul>
            <div className="mt-4 font-semibold text-green-600">₦{pkg.price?.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepOneSelectPackage;
