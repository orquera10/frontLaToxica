import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Calendar from "./components/Calendar";
import Login from "./components/Login"; // Asumiendo que tienes un componente Login

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path={"/calendar"} element={<Calendar/>} />
          <Route path={"/"} element={<Login/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
