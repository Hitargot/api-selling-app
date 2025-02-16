import React, { useEffect, useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "../AdminStyle/DashboardHome.css";


function DashboardHome() {
  const [services, setServices] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = "https://new-app-site-a384f2c56775.herokuapp.com";
  //const apiUrl = "http://localhost:5000";
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, purchasesRes, paymentsRes] = await Promise.all([
          fetch(`${apiUrl}/api/services`).then((res) => res.json()),
          fetch(`${apiUrl}/api/admin/purchases`).then((res) =>
            res.json()
          ),
          fetch(`${apiUrl}/api/payments`).then((res) => res.json()),
        ]);

        setServices(servicesRes);
        setPurchases(purchasesRes);
        setPayments(paymentsRes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare Data for Charts
  const purchasesData = purchases.map((purchase) => ({
    name: purchase.serviceName,
    amount: purchase.price,
  }));

  const paymentsData = payments.map((payment) => ({
    name: payment.method,
    amount: payment.amount,
  }));

  const servicesData = services.map((service) => ({
    name: service.name,
    value: 1,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD"];

  return (
<div className="dashboard-container">
      <h2>📊 Admin Dashboard</h2>

      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div>
          {/* Bar Chart: Purchases & Payments */}
          <h3>Transactions Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={purchasesData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" name="Purchase Amount" />
            </BarChart>
          </ResponsiveContainer>

          <h3>Payments Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentsData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#82ca9d" name="Payment Amount" />
            </BarChart>
          </ResponsiveContainer>

          {/* Pie Chart: Services Distribution */}
          <h3>Services Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={servicesData} cx="50%" cy="50%" outerRadius={100} fill="#FF8042" dataKey="value">
                {servicesData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default DashboardHome;
