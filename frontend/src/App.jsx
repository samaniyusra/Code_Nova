import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Code_Editor from "./pages/CodeEditor";
import ProtectedRoute from "./components/ProtectRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
    
              <Home />
           
          }
        />
        <Route path="/code" element={<Code_Editor />} />
      </Routes>
    </Router>
  );
};

export default App;
