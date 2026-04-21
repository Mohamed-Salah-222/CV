import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">404 Not Found</h1>
      <Link to="/" className="mt-4 inline-block text-blue-600 underline">
        Back home
      </Link>
    </div>
  );
}
