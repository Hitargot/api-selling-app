import { useState, useEffect } from "react";
import axios from "axios";
import apiUrl from '../utils/api';

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
        const response = await axios.get(`${apiUrl}/fetch-all-services`);
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
      const response = await axios.get(`${apiUrl}/fetch-api-list`);
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
      const response = await axios.post(`${apiUrl}/add-or-update`, {
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
      const response = await axios.delete(`${apiUrl}/delete/${serviceId}`);
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
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg w-full sm:w-4/5 md:w-3/4 lg:w-1/2 xl:w-1/3">
      <h2 className="text-2xl font-bold mb-4 text-center">Service API Manager</h2>

      {message && <p className="mb-4 text-center text-blue-600 text-sm">{message}</p>}

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
        className={`w-full min-w-full text-white px-4 py-2 rounded transition duration-200 ${
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
          <p className="text-sm text-gray-600 text-center">No APIs added yet.</p>
        ) : (
          apiList.map((api) => (
            <li
              key={api._id}
              className="p-3 border rounded mt-2 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center"
            >
              <span className="text-sm break-all">{api.service.name} - {api.apiKey}</span>
              <div className="mt-2 sm:mt-0 flex gap-2">
                <button
                  className="text-blue-600 text-sm"
                  onClick={() => editAPIKey(api.service._id, api.apiKey)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 text-sm"
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
