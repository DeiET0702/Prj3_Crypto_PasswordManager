import React, { useState } from 'react';
import axios from 'axios';

const SharePassword = () => {
  const [receiverId, setReceiverId] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [message, setMessage] = useState('');

  const handleShare = async () => {
    try {
      const response = await axios.post('http://localhost:8000/share', {
        sender_id: 'senderId', // Set the sender's ID
        receiver_id: receiverId,
        item_id: credentialId,
      });

      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error sharing password: ' + error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">🔐 Share Password</h2>
      <input
        type="text"
        placeholder="Enter receiver's username"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
        className="border p-2 rounded mb-2"
      />
      <input
        type="text"
        placeholder="Enter Credential ID"
        value={credentialId}
        onChange={(e) => setCredentialId(e.target.value)}
        className="border p-2 rounded mb-2"
      />
      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={handleShare}
      >
        Share
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default SharePassword;
