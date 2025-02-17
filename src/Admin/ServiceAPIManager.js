import { useState, useEffect } from "react";
import axios from "axios";

const ServiceAPIManager = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [fetchedApiKey, setFetchedApiKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_BASE_URL = "https://new-app-site-a384f2c56775.herokuapp.com/api/service-api";

  // Fetch available services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/services`);
        setServices(response.data.services);
      } catch (error) {
        setMessage("Error fetching services.");
      }
    };

    fetchServices();
  }, []);

  // Fetch API key when a service is selected
  useEffect(() => {
    if (selectedService) {
      fetchAPIKey(selectedService);
    }
  }, [selectedService]);

  // Fetch API Key
  const fetchAPIKey = async (serviceId) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.get(`${API_BASE_URL}/fetch/${serviceId}`);
      setFetchedApiKey(response.data.apiKey);
      setApiKey(response.data.apiKey || ""); // Set API key in input field
    } catch (error) {
      setFetchedApiKey(null);
      setApiKey("");
      setMessage(error.response?.data?.error || "API Key not found.");
    } finally {
      setLoading(false);
    }
  };

  // Add or Update API Key
  const addOrUpdateAPIKey = async () => {
    if (!selectedService) {
      setMessage("Please select a service.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${API_BASE_URL}/add-or-update`, {
        serviceId: selectedService,
        apiKey,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || "Error updating API Key.");
    } finally {
      setLoading(false);
    }
  };

  // Delete API Key
  const deleteAPIKey = async () => {
    if (!selectedService) {
      setMessage("Please select a service.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.delete(`${API_BASE_URL}/delete/${selectedService}`);
      setMessage(response.data.message);
      setFetchedApiKey(null);
      setApiKey("");
    } catch (error) {
      setMessage(error.response?.data?.error || "Error deleting API Key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Service API Manager</h2>

      {message && <p className="mb-4 text-center text-blue-600">{message}</p>}

      {/* Dropdown for selecting a service */}
      <label className="block mb-2 font-semibold">Select Service:</label>
      <select
        className="w-full p-2 border rounded mb-4"
        value={selectedService}
        onChange={(e) => setSelectedService(e.target.value)}
      >
        <option value="">-- Select a Service --</option>
        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.name}
          </option>
        ))}
      </select>

      {/* API Key Input */}
      <label className="block mb-2 font-semibold">API Key:</label>
      <input
        type="text"
        className="w-full p-2 border rounded mb-4"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter API Key"
      />

      <div className="flex space-x-2">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={addOrUpdateAPIKey}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save API Key"}
        </button>

        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={deleteAPIKey}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete API Key"}
        </button>
      </div>

      {/* Display fetched API Key */}
      {fetchedApiKey && (
        <div className="mt-4 p-3 bg-gray-100 border rounded">
          <h3 className="text-lg font-semibold">Stored API Key:</h3>
          <p className="text-gray-700">{fetchedApiKey}</p>
        </div>
      )}
    </div>
  );
};

export default ServiceAPIManager;
