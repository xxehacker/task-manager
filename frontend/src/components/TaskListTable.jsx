import React from "react";
import moment from "moment";

const TaskListTable = ({ tableData }) => {
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inProgress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="overflow-x-auto p-0 rounded-lg mt-3">
      <table className="min-w-full">
        <thead>
          <tr className="text-left">
            <th className="py-3 px-4 text-gray-80 font-medium text-[13px]">
              Name
            </th>
            <th className="py-3 px-4 text-gray-80 font-medium text-[13px]">
              Status
            </th>
            <th className="py-3 px-4 text-gray-80 font-medium text-[13px]">
              Priority
            </th>
            <th className="py-3 px-4 text-gray-80 font-medium text-[13px]">
              Created At
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item) => (
            <tr className="border-t border-gray-200" key={item?._id}>
              <td className="my-3 mx-4 text-gray-700 text-[13px] line-clamp-1 overflow-hidden">
                {item.title}
              </td>
              <td className="py-4 px-4">
                <span
                  className={`px-2 py-1 text-xs rounded inline-block ${getStatusBadgeColor(
                    item?.status
                  )}`}
                >
                  {item?.status}
                </span>
              </td>
              <td className="py-4 px-4">
                {" "}
                <span
                  className={`px-2 py-1 text-xs rounded inline-block ${getPriorityBadgeColor(
                    item?.priority
                  )}`}
                >
                  {item?.priority}
                </span>
              </td>
              <td className="py-4 px-4 text-gray-700 text-[13px] text-nowrap hideen md:table-cell">
                {item?.createdAt
                  ? moment(item?.createdAt).format("Do MMM YYYY")
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskListTable;
