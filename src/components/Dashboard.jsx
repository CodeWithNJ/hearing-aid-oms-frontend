import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <>
      <h1>Dashboard Component</h1>
      <Outlet />
    </>
  );
}

export default Dashboard;
