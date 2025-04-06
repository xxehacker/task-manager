import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/admin/Dashboard";
import CreateTask from "./pages/admin/CreateTask";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageTasks from "./pages/admin/ManageTasks";
import UserDashboard from "./pages/user/UserDashboard";
import MyTasks from "./pages/user/MyTasks";
import ViewTaskDetails from "./pages/user/ViewTaskDetails";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/*admin routes  */}W
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/create-task" element={<CreateTask />} />
              <Route path="/admin/manage-users" element={<ManageUsers />} />
              <Route path="/admin/manage-tasks" element={<ManageTasks />} />
            </Route>
            {/*user routes  */}
            <Route element={<PrivateRoute allowedRoles={["user"]} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/tasks" element={<MyTasks />} />
              <Route
                path="/user/task-details/:taskId"
                element={<ViewTaskDetails />}
              />
            </Route>
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
