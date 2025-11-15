export default function AdminStatsCards({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="
      bg-white rounded-lg shadow p-4 
      transform transition-all duration-200 
      hover:scale-105 hover:shadow-lg cursor-pointer
    ">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
