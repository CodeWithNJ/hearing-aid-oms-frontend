import React from "react";
import { Outlet } from "react-router-dom";

function Customers() {
  return (
    <>
      <h2>Customers Component</h2>
      <Outlet />
    </>
  );
}

export default Customers;
