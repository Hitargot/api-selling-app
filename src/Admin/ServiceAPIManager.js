import { useState, useEffect } from "react";
import axios from "axios";

const ServiceAPIManager = () => {
  const [services, setServices] = useState([]);
  const [apiList, setApiList] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [editingId, setEditingId] = useState(null); // Track if an API is being edited
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_BASE_URL = "https://new-app-site-a384f2c56775.herokuapp.com/api/service-api";

  // Fetch available services for dropdown
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/fetch-all-services`);
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
    fetchAPIList(); // Fetch existing API list
  }, []);

  // Fetch all stored API keys
  const fetchAPIList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fetch-api-list`);
      setApiList(response.data);
    } catch (error) {
      console.error("Error fetching API list:", error);
    }
  };

  // Add or Update API Key
  const addOrUpdateAPIKey = async () => {
    if (!selectedService || !apiKey) {
      setMessage("Please select a service and enter an API key.");
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
      fetchAPIList(); // Refresh the API list
      setSelectedService(""); // Clear selected service
      setApiKey(""); // Clear input field
      setEditingId(null); // Reset editing state
    } catch (error) {
      setMessage(error.response?.data?.error || "Error updating API Key.");
    } finally {
      setLoading(false);
    }
  };

  // Delete API Key
  const deleteAPIKey = async (serviceId) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.delete(`${API_BASE_URL}/delete/${serviceId}`);
      setMessage(response.data.message);
      fetchAPIList(); // Refresh the API list
    } catch (error) {
      setMessage(error.response?.data?.error || "Error deleting API Key.");
    } finally {
      setLoading(false);
    }
  };

  // Edit API Key - Pre-fill input fields
  const editAPIKey = (serviceId, existingApiKey) => {
    setSelectedService(serviceId);
    setApiKey(existingApiKey);
    setEditingId(serviceId); // Track which service is being edited
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Service API Manager</h2>

      {message && <p className="mb-4 text-center text-blue-600">{message}</p>}

      <label className="block mb-2 font-semibold">Select Service:</label>
      <select
        className="w-full p-2 border rounded mb-4"
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

      <label className="block mb-2 font-semibold">API Key:</label>
      <input
        type="text"
        className="w-full p-2 border rounded mb-4"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter API Key"
      />

      <button
        className={`w-full text-white px-4 py-2 rounded ${
          editingId ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
        }`}
        onClick={addOrUpdateAPIKey}
        disabled={loading}
      >
        {loading ? "Saving..." : editingId ? "Update API Key" : "Save API Key"}
      </button>

      <h3 className="text-lg font-bold mt-6">Stored APIs:</h3>
      <ul className="mt-4">
        {apiList.length === 0 ? (
          <p>No APIs added yet.</p>
        ) : (
          apiList.map((api) => (
            <li key={api._id} className="p-3 border rounded mt-2 flex justify-between items-center">
              <span>{api.service.name} - {api.apiKey}</span>
              <div>
                <button
                  className="text-blue-600 mr-4"
                  onClick={() => editAPIKey(api.service._id, api.apiKey)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600"
                  onClick={() => deleteAPIKey(api.service._id)}
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ServiceAPIManager;
