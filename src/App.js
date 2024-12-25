import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import First from "./com/First.jsx";
import Register from './com/Register.jsx';
import Login from './com/Login.jsx';
import Home from './com/Home.jsx';
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<First />} />
          <Route path="/sign" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/Home" element={<Home/>}/>


        </Routes>
      </Router>
    </div>
  );
};

export default App;
