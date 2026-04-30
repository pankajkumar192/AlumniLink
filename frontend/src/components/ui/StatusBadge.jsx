import React from "react";

const StatusBadge = ({ status }) => {
  let styles = "bg-gray-500/10 text-gray-400 border-gray-500/20";
  
  const statusLower = status?.toLowerCase();
  
  if (statusLower === "active" || statusLower === "completed" || statusLower === "approved") {
    styles = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  } else if (statusLower === "pending" || statusLower === "in progress") {
    styles = "bg-orange-500/10 text-orange-400 border-orange-500/20";
  } else if (statusLower === "inactive" || statusLower === "rejected" || statusLower === "failed") {
    styles = "bg-red-500/10 text-red-400 border-red-500/20";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border uppercase tracking-wider ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        statusLower === "active" || statusLower === "completed" || statusLower === "approved" ? "bg-emerald-400" :
        statusLower === "pending" || statusLower === "in progress" ? "bg-orange-400" :
        statusLower === "inactive" || statusLower === "rejected" || statusLower === "failed" ? "bg-red-400" :
        "bg-gray-400"
      }`} />
      {status}
    </span>
  );
};

export default StatusBadge;
