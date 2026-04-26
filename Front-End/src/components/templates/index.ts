import type { templateTypes } from "@cv/types";
import { ClassicTemplate } from "./ClassicTemplate";
import { ModernTemplate } from "./ModernTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import { ExecutiveTemplate } from "./ExecutiveTemplate";

export interface TemplateInfo {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
}

export const templates: TemplateInfo[] = [
  {
    id: "modern",
    name: "Modern",
    thumbnail: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjUwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iI2Y4ZjhmdiIvPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iNjAiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSIyMCIgeT0iMTUiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTIiIGZpbGw9IiM0ZjQ2ZTUiLz48cmVjdCB4PSIyMCIgeT0iMzUiIHdpZHRoPSIxNjAiIGhlaWdodD0iNiIgZmlsbD0iI2EwYWVjMCIvPjxyZWN0IHg9IjIwIiB5PSI4MCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjgiIGZpbGw9IiM0ZjQ2ZTUiLz48cmVjdCB4PSIyMCIgeT0iOTUiIHdpZHRoPSIxNjAiIGhlaWdodD0iMjAiIGZpbGw9IiNmZmYiIHJ4PSI0Ii8+PHJlY3QgeD0iMjAiIHk9IjEyNSIgd2lkdGg9IjYwIiBoZWlnaHQ9IjgiIGZpbGw9IiM0ZjQ2ZTUiLz48cmVjdCB4PSIyMCIgeT0iMTQwIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZmZmIiByeD0iNCIvPjwvc3ZnPg==",
    description: "Clean professional look with indigo accents",
  },
  {
    id: "classic",
    name: "Classic",
    thumbnail: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjUwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHg9IjIwIiB5PSIxNSIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzMzMyIvPjxyZWN0IHg9IjIwIiB5PSIzMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIyIiBmaWxsPSIjMzMzIi8+PHJlY3QgeD0iMjAiIHk9IjUwIiB3aWR0aD0iNTAiIGhlaWdodD0iNiIgZmlsbD0iIzMzMyIvPjxyZWN0IHg9IjIwIiB5PSI2MCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2Y5ZjlmdSIvPjxyZWN0IHg9IjIwIiB5PSIxMTAiIHdpZHRoPSI1MCIgaGVpZ2h0PSI2IiBmaWxsPSIjMzMzIi8+PHJlY3QgeD0iMjAiIHk9IjEyMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2Y5ZjlmdSIvPjwvc3ZnPg==",
    description: "Traditional serif professional format",
  },
  {
    id: "minimal",
    name: "Minimal",
    thumbnail: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjUwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjEyIiBmaWxsPSIjMTExIi8+PHJlY3QgeD0iMjAiIHk9IjQwIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjQiIGZpbGw9IiM2NjYiLz48cmVjdCB4PSIyMCIgeT0iODAiIHdpZHRoPSIxNjAiIGhlaWdodD0iNDAiIGZpbGw9IiNmOGY4ZjgiLz48cmVjdCB4PSIzMCIgeT0iODAiIHdpZHRoPSI0IiBoZWlnaHQ9IjQwIiBmaWxsPSIjZWVlIi8+PHJlY3QgeD0iMjAiIHk9IjEzMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2Y4ZjhmOCIvPjxyZWN0IHg9IjMwIiB5PSIxMzAiIHdpZHRoPSI0IiBoZWlnaHQ9IjQwIiBmaWxsPSIjZWVlIi8+PC9zdmc+",
    description: "Ultra-clean with maximum whitespace",
  },
  {
    id: "executive",
    name: "Executive",
    thumbnail: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjUwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHdpZHRoPSI3MCIgaGVpZ2h0PSIyNTAiIGZpbGw9IiMyZDM3NDgiLz48cmVjdCB4PSI4MCIgeT0iMjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iOCIgZmlsbD0iIzJkMzc0OCIvPjxyZWN0IHg9IjgwIiB5PSIzNSIgd2lkdGg9IjgwIiBoZWlnaHQ9IjQiIGZpbGw9IiNlMmU4ZjAiLz48cmVjdCB4PSI4MCIgeT0iNTUiIHdpZHRoPSIxMDAiIGhlaWdodD0iNCIgZmlsbD0iIzRhNTU2OCIvPjxyZWN0IHg9IjgwIiB5PSI3MCIgd2lkdGg9Ijg1IiBoZWlnaHQ9IjQiIGZpbGw9IiM0YTU1NjgiLz48cmVjdCB4PSIxMCIgeT0iMjAiIHdpZHRoPSI1MCIgaGVpZ2h0PSI2IiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iMTAiIHk9IjMwIiB3aWR0aD0iNDAiIGhlaWdodD0iNCIgZmlsbD0iI2EwYWVjMCIvPjwvc3ZnPg==",
    description: "Sophisticated 2-column layout for experienced professionals",
  },
];

export function getTemplateComponent(templateId: string | undefined): React.FC<{ data: templateTypes.CVData }> {
  switch (templateId) {
    case "classic":
      return ClassicTemplate;
    case "executive":
      return ExecutiveTemplate;
    case "modern":
    default:
      return ModernTemplate;
  }
}

export { ClassicTemplate, ModernTemplate, MinimalTemplate, ExecutiveTemplate };