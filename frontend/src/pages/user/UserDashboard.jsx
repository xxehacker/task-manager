import React from "react";
import useUserAuth from "../../hooks/useUserAuth";

function UserDashboard() {
  useUserAuth();

  return <div>Dashboard</div>;
}

export default UserDashboard;
