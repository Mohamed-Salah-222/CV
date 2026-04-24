import { Link } from "react-router-dom";
import { templates } from "@/data/templates";

export default function TemplateViewPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Choose a Template</h1>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <Link
              key={template.id}
              to={`/template/${template.id}`}
              className="group overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg"
            >
              <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900">{template.name}</h2>
                <p className="mt-1 text-sm text-gray-500">Click to preview</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}