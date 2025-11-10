// app/order-status/[id]/page.tsx
export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params; // ⬅️ unwrap
  return (
    <div>
      <p>{id}</p>
    </div>
  );
}
