export default function AdminActionCards({
  title,
  description,
  color = "bg-blue-600",
}: {
  title: string;
  description: string;
  color?: string;
}) {
  return (
    <div
      className={`${color} text-white p-6 rounded-lg shadow hover:shadow-xl hover:scale-[1.02] transition cursor-pointer`}
    >
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-white/80">{description}</p>
    </div>
  );
}
