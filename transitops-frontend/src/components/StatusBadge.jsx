const colors = {
  AVAILABLE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  ON_TRIP: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  IN_SHOP: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  RETIRED: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400",
  OFF_DUTY: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400",
  SUSPENDED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  DRAFT: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400",
  DISPATCHED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`badge ${colors[status] || "bg-gray-100 text-gray-800"}`}>
      {status?.replace("_", " ")}
    </span>
  );
}
