import { useState, useEffect } from "react";
import axios from "axios";
import apiUrl from "../utils/api";

const ServiceAPIManager = () => {
  const [services, setServices] = useState([]);
  const [apiList, setApiList] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/service-api/fetch-all-services`);
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
    fetchAPIList();
  }, []);

  const fetchAPIList = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/service-api/fetch-api-list`);
      setApiList(response.data);
    } catch (error) {
      console.error("Error fetching API list:", error);
    }
  };

  const addOrUpdateAPIKey = async () => {
    if (!selectedService || !apiKey) {
      setMessage("Please select a service and enter an API key.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${apiUrl}/api/service-api/add-or-update`, {
        serviceId: selectedService,
        apiKey,
      });

      setMessage(response.data.message);
      fetchAPIList();
      setSelectedService("");
      setApiKey("");
      setEditingId(null);
    } catch (error) {
      setMessage(error.response?.data?.error || "Error updating API Key.");
    } finally {
      setLoading(false);
    }
  };

  const deleteAPIKey = async (serviceId) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.delete(`${apiUrl}/api/service-api/delete/${serviceId}`);
      setMessage(response.data.message);
      fetchAPIList();
    } catch (error) {
      setMessage(error.response?.data?.error || "Error deleting API Key.");
    } finally {
      setLoading(false);
    }
  };

  const editAPIKey = (serviceId, existingApiKey) => {
    setSelectedService(serviceId);
    setApiKey(existingApiKey);
    setEditingId(serviceId);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
        🔐 Manage API Keys
      </h2>

      {message && (
        <div className="text-sm text-blue-600 text-center mb-4">
          {message}
        </div>
      )}

      <div className="space-y-4">
        {/* Service Select */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Service</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            <option value="">-- Select a Service --</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        {/* API Key Input */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">API Key</label>
          <input
            type="text"
            placeholder="Enter API Key"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        {/* Save/Update Button */}
        <button
          className={`w-full text-white py-2 rounded-md transition duration-200 ${
            editingId
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-orange-600 hover:bg-orange-700"
          }`}
          onClick={addOrUpdateAPIKey}
          disabled={loading}
        >
          {loading ? "Saving..." : editingId ? "Update API Key" : "Save API Key"}
        </button>
      </div>

      {/* Stored APIs */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-3 text-gray-800">Stored APIs</h3>

        {apiList.length === 0 ? (
          <p className="text-sm text-gray-500">No APIs added yet.</p>
        ) : (
          <ul className="space-y-3">
            {apiList.map((api) => (
              <li
                key={api._id}
                className="border border-gray-200 rounded-lg p-3 flex flex-col md:flex-row md:justify-between md:items-center gap-2"
              >
                <span className="text-sm break-all">
                  <span className="font-medium text-gray-700">{api.service.name}</span>:{" "}
                  <span className="text-gray-600">{api.apiKey}</span>
                </span>
                <div className="flex gap-4 text-sm">
                  <button
                    onClick={() => editAPIKey(api.service._id, api.apiKey)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAPIKey(api.service._id)}
                    disabled={loading}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ServiceAPIManager;
