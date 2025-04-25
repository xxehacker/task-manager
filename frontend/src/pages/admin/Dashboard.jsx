import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import AXIOS_INSTANCE from "../../utils/axiosInstance";
import { API_ENDPOINTS } from "../../utils/apiPath";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import useUserAuth from "../../hooks/useUserAuth";
import InfoCard from "../../components/cards/InfoCard";
import { addThousandSeperator } from "../../utils/helper";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskListTable";
import PieChartComponent from "../../components/PieChartComponent.jsx";
import { Bar } from "recharts";
import BarChartComponent from "../../components/BarChartComponent.jsx";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

function Dashboard() {
  useUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = React.useState(null);
  const [pieChartData, setPieChartData] = React.useState([]);
  const [barChartData, setBarChartData] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const preparePieChartData = (data) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevel = data?.taskPriorityLevel || null;

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.pending || 0 },
      { status: "In Progress", count: taskDistribution?.inProgress || 0 },
      { status: "Completed", count: taskDistribution?.completed || 0 },
    ];
    setPieChartData(taskDistributionData);

    const taskPriorityLevelData = [
      { priority: "Low", count: taskPriorityLevel?.low || 0 },
      { priority: "Medium", count: taskPriorityLevel?.medium || 0 },
      { priority: "High", count: taskPriorityLevel?.high || 0 },
    ];
    setBarChartData(taskPriorityLevelData);
  };

  const getDashboardData = async () => {
    try {
      const response = await AXIOS_INSTANCE.get(
        API_ENDPOINTS.TASKS.GET_DASHBOARD_DATA
      );

      if (response.data) {
        setDashboardData(response.data);
        preparePieChartData(response.data?.charts || null);
      }
    } catch (error) {
      console.log("Error fetching dashboard data", error);
      throw error;
    }
  };

  React.useEffect(() => {
    getDashboardData();
    return () => {}; // cleanup
  }, []);

  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl">
              Good morning: {user?.username}
            </h2>
            <p className="text-xm mdLtext-[13px] text-gray-400 mt-1.5">
              {moment().format("dddd Do MMMM YYYY")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          <InfoCard
            label="Total Tasks"
            value={addThousandSeperator(
              dashboardData?.charts?.taskDistribution?.All || 0
            )}
            color="bg-[#1A202C]"
          />
          <InfoCard
            label="Pending Tasks"
            value={addThousandSeperator(
              dashboardData?.charts?.taskDistribution?.pending || 0
            )}
            color="bg-[#F56565]"
          />
          <InfoCard
            label="In Progress Tasks"
            value={addThousandSeperator(
              dashboardData?.charts?.taskDistribution?.inProgress || 0
            )}
            color="bg-[#FFC107]"
          />
          <InfoCard
            label="Completed Tasks"
            value={addThousandSeperator(
              dashboardData?.charts?.taskDistribution?.completed || 0
            )}
            color="bg-[#38A169]"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:rid-cols-2 gap-5 my-4 md:my-6">
        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Task Distribution</h5>
            </div>
            <PieChartComponent
              chartData={pieChartData}
              label="Total Balance"
              colors={COLORS}
            />
          </div>
        </div>
        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Task Priority</h5>
            </div>
            <BarChartComponent chartData={barChartData} />
          </div>
        </div>
        <div className="md:col-end-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Recent Tasks</h5>
              <button className="card-btn" onClick={onSeeMore}>
                See More <LuArrowRight className="text-base" />
              </button>
            </div>
            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
