import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:9000/sig", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify({ username, password, email }),
      });

      const ans = await response.json(); 
      console.log(ans);
      if (!response.ok) {
        throw new Error(ans.error || 'Network response was not ok');
      }
    } catch (error) {
      console.log("error:", error.message);
    }
  };

  return (
    <div className="bg-[#0F1117] text-white min-h-screen flex items-center justify-center font-sans pt-16">
      <button 
        onClick={() => navigate('/')}
        className="absolute top-20 left-8 text-white hover:text-gray-300 flex items-center gap-2"
      >
        <IoArrowBack size={24} />
        <span>Back</span>
      </button>
      <div className="bg-[#1A1D24] p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold tracking-tight text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-400">Username</label>
            <input
              type="text"
              id="username"
              className="w-full p-2 mt-2 bg-[#0F1117] border border-gray-700 rounded-lg text-white"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-2 mt-2 bg-[#0F1117] border border-gray-700 rounded-lg text-white"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-2 mt-2 bg-[#0F1117] border border-gray-700 rounded-lg text-white"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white hover:bg-gray-100 text-[#0F1117] font-medium py-2.5 px-8 rounded-lg transition-colors"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
