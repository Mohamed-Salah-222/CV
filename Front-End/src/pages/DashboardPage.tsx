import { useUser } from "@clerk/react";

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome, {user?.firstName ?? "there"}</h1>
      <p className="mt-2 text-gray-600">Your dashboard is coming soon.</p>
    </div>
  );
}
