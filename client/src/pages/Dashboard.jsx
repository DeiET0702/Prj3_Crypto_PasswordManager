import React, { useState } from 'react';

const Dashboard = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Microsoft', created: '3 days ago', updated: '3 days ago' },
    { id: 2, name: '', created: '4 days ago', updated: '4 days ago' },
    { id: 3, name: '', created: '4 days ago', updated: '4 days ago' },
    { id: 4, name: '', created: '4 days ago', updated: '4 days ago' },
    { id: 5, name: '', created: '5 days ago', updated: '5 days ago' },
    { id: 6, name: '', created: '5 days ago', updated: '5 days ago' },
    { id: 7, name: 'APICreds', created: '11 days ago', updated: '11 days ago' },
    { id: 8, name: 'Encrypted Content', created: '9 months ago', updated: '9 months ago' },
  ]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    const filteredItems = items.filter((item) =>
      item.name.toLowerCase().includes(query) ||
      item.created.toLowerCase().includes(query) ||
      item.updated.toLowerCase().includes(query)
    );
    setItems(filteredItems);
  };

  const handleShare = (id) => {
    alert(`Sharing domain with ID ${id} without exposing master keys.`);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Dashboard</h2>

      {/* Search bar */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Enter search information..."
          className="border border-gray-300 rounded-lg p-2 w-2/3"
          onChange={handleSearch}
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          onClick={() => alert('Create Item button clicked!')}
        >
          + New Item
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border-b">No.</th>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Created Time</th>
              <th className="p-3 border-b">Updated Time</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{item.id}</td>
                <td className="p-3 border-b">{item.name || <span className="w-32 h-8 bg-gray-300 inline-block"></span>}</td>
                <td className="p-3 border-b">{item.created}</td>
                <td className="p-3 border-b">{item.updated}</td>
                <td className="p-3 border-b">
                  <button
                    className="text-blue-500 hover:underline mr-2"
                    onClick={() => alert(`Edit item ${item.id}`)}
                  >
                    📝
                  </button>
                  <button
                    className="text-red-500 hover:underline mr-2"
                    onClick={() => alert(`Delete item ${item.id}`)}
                  >
                    🗑️
                  </button>
                  {/* Share Button */}
                  <button
                    className="text-green-500 hover:underline"
                    onClick={() => handleShare(item.id)}
                  >
                    🔐 Share
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-center text-gray-600 mt-4">
        <a href="login.html" className="text-blue-500 hover:underline">Back to Login</a>
      </p>
    </div>
  );
};

export default Dashboard;
