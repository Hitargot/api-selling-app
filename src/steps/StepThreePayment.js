// steps/StepThreePayment.jsx
import React from "react";
import { FaCopy } from "react-icons/fa";

const StepThreePayment = ({
  formData, handleChange, paymentMethods, selectedPaymentMethod,
  handleCopyAddress, onNext, onBack, formatCountdown, service, selectedPackage
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Choose Payment Method</h2>

      <select name="paymentMethod" onChange={handleChange} value={formData.paymentMethod}
        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500" required>
        <option value="">Select Method</option>
        {paymentMethods.map((method, i) => (
          <option key={i} value={method.name}>{method.name}</option>
        ))}
      </select>

      {selectedPaymentMethod && (
        <div className="border p-4 rounded-md bg-gray-50">
          <p className="text-gray-700">Send <span className="font-bold text-green-600">₦{selectedPackage?.price || service?.price}</span> to the account below:</p>
          <div className="mt-2 flex items-center justify-between bg-white border p-3 rounded-md">
            <span className="text-sm font-mono">{selectedPaymentMethod.address}</span>
            <button onClick={handleCopyAddress} className="text-blue-600 hover:text-blue-800">
              <FaCopy />
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">Expires in: <strong>{formatCountdown()}</strong></p>
        </div>
      )}

      <div className="flex justify-between gap-4">
        <button onClick={onBack} className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100">Back</button>
        <button onClick={onNext} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">Next</button>
      </div>
    </div>
  );
};

export default StepThreePayment;
