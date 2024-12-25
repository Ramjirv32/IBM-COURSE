import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function First() {
  return (
    <div className="min-h-screen bg-[#0F1117]">
      <Navbar />
      <div className="bg-[#0F1117] text-white min-h-screen flex items-center justify-center font-sans pt-16">
        <div className="text-center max-w-2xl px-4">
          <h1 className="text-4xl font-semibold tracking-tight mb-4">Welcome to the Social Media Dashboard App!</h1>
          <p className="text-gray-400 text-lg mb-8">Explore and manage your social media accounts in one place.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button className="bg-[#1A1D24] hover:bg-[#2A2D34] text-white font-medium py-2.5 px-5 rounded-lg transition-colors">
              FACESNAP
            </button>
            <button className="bg-[#1A1D24] hover:bg-[#2A2D34] text-white font-medium py-2.5 px-5 rounded-lg transition-colors">
              INSTABOOK
            </button>
            <button className="bg-[#1A1D24] hover:bg-[#2A2D34] text-white font-medium py-2.5 px-5 rounded-lg transition-colors">
              TWEETCHAT
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default First; 