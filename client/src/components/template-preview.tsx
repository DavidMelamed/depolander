import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TemplatePreviewProps {
  colorScheme: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  sections: Array<{
    type: string;
    content: any;
    styles: any;
  }>;
}

export function TemplatePreview({ colorScheme, sections }: TemplatePreviewProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-100 border-b">
        <h3 className="font-medium">Live Preview</h3>
      </div>
      
      <div 
        className="h-[600px] overflow-y-auto"
        style={{ backgroundColor: colorScheme.background, color: colorScheme.text }}
      >
        {sections.map((section, index) => (
          <div
            key={index}
            className="p-6"
            style={{ 
              ...section.styles,
              backgroundColor: section.type === 'hero' ? colorScheme.primary : 
                             section.type === 'benefits' ? colorScheme.secondary :
                             colorScheme.background
            }}
          >
            {section.type === 'hero' && (
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-4" style={{ color: section.type === 'hero' ? '#fff' : colorScheme.text }}>
                  {section.content.title}
                </h1>
                <p className="text-lg" style={{ color: section.type === 'hero' ? '#fff' : colorScheme.text }}>
                  {section.content.description}
                </p>
              </div>
            )}
            
            {section.type === 'benefits' && (
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">
                  {section.content.title}
                </h2>
                <p className="text-lg">
                  {section.content.description}
                </p>
              </div>
            )}
            
            {section.type === 'evidence' && (
              <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-3xl font-bold mb-4" style={{ color: colorScheme.primary }}>
                  {section.content.title}
                </h2>
                <p className="text-lg">
                  {section.content.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
