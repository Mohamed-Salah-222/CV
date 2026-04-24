import { useParams, Link, useNavigate } from "react-router-dom";
import { templates } from "@/data/templates";

export default function TemplateDetailPage() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const template = templates.find((t) => t.id === name);

  if (!template) {
    return (
      <div className="p-8">
        <h1 className="text-xl text-red-600">Template not found</h1>
        <Link to="/templates" className="mt-4 text-blue-600 hover:underline">
          Back to templates
        </Link>
      </div>
    );
  }

  const handleUseTemplate = () => {
    navigate(`/cv-builder?template=${template.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/templates"
          className="mb-6 inline-block text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to templates
        </Link>
        
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="aspect-[3/4] overflow-hidden bg-gray-100">
            <img
              src={template.thumbnail}
              alt={template.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
            <p className="mt-2 text-gray-600">Template preview for {template.name}</p>
            <button 
              onClick={handleUseTemplate}
              className="mt-4 rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
            >
              Use this template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}