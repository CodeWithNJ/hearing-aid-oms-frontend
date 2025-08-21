import { Outlet } from "react-router-dom";

function Orders() {
  return (
    <>
      <h2>Orders Component</h2>
      <Outlet />
    </>
  );
}

export default Orders;
