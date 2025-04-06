import React from "react";
import { Outlet } from "react-router-dom";

function PrivateRoute() {
  return <Outlet />;
}

export default PrivateRoute;
