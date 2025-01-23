import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import SectionEditor from "@/components/section-editor";

interface ContentVersion {
  id: number;
  drugName: string;
  condition: string;
  content: any;
  version: number;
  isActive: boolean;
  language: string;
  createdAt: string;
  updatedAt: string;
}

interface LanguageVersion {
  id: number;
  contentVersionId: number;
  language: string;
  translatedContent: any;
  lastTranslated: string;
  status: "pending" | "completed" | "needs_review";
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

interface Template {
  id: number;
  name: string;
  description: string;
  structure: any;
  defaultStyles: any;
  createdAt: string;
  updatedAt: string;
  sections?: any[];
}

interface Deployment {
  id: number;
  contentVersionId: number;
  domain: string;
  subdomain: string | null;
  status: string;
  analyticsId: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const { toast } = useToast();

  // Fetch templates
  const { data: templates } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  // Fetch content versions
  const { data: contentVersions } = useQuery<ContentVersion[]>({
    queryKey: ["/api/content-versions"],
  });

  // Fetch deployments
  const { data: deployments } = useQuery<Deployment[]>({
    queryKey: ["/api/deployments"],
  });

  // Fetch supported languages
  const { data: languages } = useQuery<Language[]>({
    queryKey: ["/api/languages"],
  });

  // Fetch translations for selected version
  const { data: translations } = useQuery<LanguageVersion[]>({
    queryKey: ["/api/content-versions", selectedVersion, "translations"],
    enabled: !!selectedVersion,
  });

  // Create new template
  const createTemplate = useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      structure: any;
    }) => {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({
        title: "Success",
        description: "Template created",
      });
    },
  });

  // Create deployment
  const createDeployment = useMutation({
    mutationFn: async (data: {
      contentVersionId: number;
      domain: string;
      subdomain?: string;
      configuration: any;
    }) => {
      const res = await fetch("/api/deployments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deployments"] });
      toast({
        title: "Success",
        description: "Deployment created",
      });
    },
  });

  // Create translation
  const createTranslation = useMutation({
    mutationFn: async ({
      id,
      language,
    }: {
      id: number;
      language: string;
    }) => {
      const res = await fetch(`/api/content-versions/${id}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/content-versions", selectedVersion, "translations"],
      });
      toast({
        title: "Success",
        description: "Translation created",
      });
    },
  });

  // Validate translation
  const validateTranslation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/language-versions/${id}/validate`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: (data) => {
      if (data.isValid) {
        toast({
          title: "Success",
          description: "Translation is valid",
        });
      } else {
        toast({
          title: "Warning",
          description: `Found ${data.issues.length} issues with the translation`,
          variant: "destructive",
        });
      }
    },
  });

  // Create new content version
  const createContent = useMutation({
    mutationFn: async (data: { url: string }) => {
      const res = await fetch("/api/generate-from-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content-versions"] });
      toast({
        title: "Success",
        description: "New content version created",
      });
    },
  });

  // Schedule content refresh
  const scheduleRefresh = useMutation({
    mutationFn: async ({
      id,
      frequency,
    }: {
      id: number;
      frequency: string;
    }) => {
      const res = await fetch(`/api/content-versions/${id}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frequency }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Refresh schedule created",
      });
    },
  });

  // Analyze content for updates
  const analyzeContent = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/content-versions/${id}/analyze`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/content-versions", selectedVersion, "suggestions"],
      });
      toast({
        title: "Success",
        description: "Content analysis complete",
      });
    },
  });

  // Fetch suggestions for selected version
  const { data: suggestions } = useQuery<UpdateSuggestion[]>({
    queryKey: ["/api/content-versions", selectedVersion, "suggestions"],
    enabled: !!selectedVersion,
  });

  interface UpdateSuggestion {
    id: number;
    contentVersionId: number;
    suggestedChanges: {
      changes: Array<{
        field: string;
        currentValue: string;
        suggestedValue: string;
        reason: string;
        priority: "low" | "medium" | "high";
      }>;
      summary: string;
    };
    reason: string;
    priority: "low" | "medium" | "high";
    status: "pending" | "approved" | "rejected";
    createdAt: string;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Content Management Dashboard</h1>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Landing Page Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Create Template Form */}
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Create New Template</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const formData = new FormData(form);
                      createTemplate.mutate({
                        name: formData.get("name") as string,
                        description: formData.get("description") as string,
                        structure: {
                          sections: [
                            {
                              id: 1,
                              type: "hero",
                              name: "Hero Section",
                              isEditable: true,
                              order: 0,
                              content: {
                                title: "Default Hero Title",
                                description: "Default hero description goes here",
                              },
                              styles: {
                                backgroundColor: "#ffffff",
                                color: "#000000",
                                fontSize: "16px",
                                padding: "24px",
                              },
                            },
                            {
                              id: 2,
                              type: "benefits",
                              name: "Benefits Section",
                              isEditable: true,
                              order: 1,
                              content: {
                                title: "Default Benefits Title",
                                description: "Default benefits description",
                              },
                              styles: {
                                backgroundColor: "#f9fafb",
                                color: "#111827",
                                fontSize: "16px",
                                padding: "24px",
                              },
                            },
                            {
                              id: 3,
                              type: "evidence",
                              name: "Evidence Section",
                              isEditable: true,
                              order: 2,
                              content: {
                                title: "Default Evidence Title",
                                description: "Default evidence description",
                              },
                              styles: {
                                backgroundColor: "#ffffff",
                                color: "#000000",
                                fontSize: "16px",
                                padding: "24px",
                              },
                            },
                          ],
                        },
                      });
                      form.reset();
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">Template Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter template name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        name="description"
                        placeholder="Enter template description"
                      />
                    </div>
                    <Button type="submit">Create Template</Button>
                  </form>
                </Card>

                {/* Template List */}
                {templates?.map((template) => (
                  <Card key={template.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-gray-500">
                          {template.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          Created {new Date(template.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        onClick={() => setSelectedTemplate(template.id)}
                        variant="outline"
                      >
                        {selectedTemplate === template.id ? "Hide Editor" : "Edit Sections"}
                      </Button>
                    </div>

                    {/* Section Editor */}
                    {selectedTemplate === template.id && (
                      <div className="mt-4">
                        <SectionEditor
                          sections={template.sections || template.structure.sections}
                          onUpdate={async (updatedSections) => {
                            try {
                              // Update section order
                              await fetch(`/api/templates/${template.id}/sections/reorder`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  sectionIds: updatedSections.map((s) => s.id),
                                }),
                              });

                              // Update individual sections
                              await Promise.all(
                                updatedSections.map((section) =>
                                  fetch(
                                    `/api/templates/${template.id}/sections/${section.id}`,
                                    {
                                      method: "PUT",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({
                                        content: section.content,
                                        styles: section.styles,
                                      }),
                                    }
                                  )
                                )
                              );

                              queryClient.invalidateQueries({
                                queryKey: ["/api/templates"],
                              });

                              toast({
                                title: "Success",
                                description: "Template sections updated",
                              });
                            } catch (error) {
                              console.error("Error updating sections:", error);
                              toast({
                                title: "Error",
                                description: "Failed to update template sections",
                                variant: "destructive",
                              });
                            }
                          }}
                        />
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Content Tab */}
        <TabsContent value="content">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Versions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contentVersions?.map((version) => (
                    <Card key={version.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {version.drugName} - {version.condition}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Version {version.version} • {version.language.toUpperCase()} •
                            Created {new Date(version.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="space-x-2">
                          <Button
                            onClick={() => setSelectedVersion(version.id)}
                            variant="outline"
                          >
                            Manage Translations
                          </Button>
                        </div>
                      </div>

                      {selectedVersion === version.id && (
                        <div className="mt-4 space-y-4">
                          <h4 className="font-semibold">Translations</h4>

                          {/* Add New Translation */}
                          <Card className="p-4">
                            <h5 className="font-medium mb-2">Add Translation</h5>
                            <div className="flex gap-2">
                              <Select
                                onValueChange={(value) =>
                                  createTranslation.mutate({
                                    id: version.id,
                                    language: value,
                                  })
                                }
                              >
                                <SelectTrigger className="w-[200px]">
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                  {languages?.map((lang) => (
                                    <SelectItem
                                      key={lang.code}
                                      value={lang.code}
                                      disabled={translations?.some(
                                        (t) => t.language === lang.code
                                      )}
                                    >
                                      {lang.name} ({lang.nativeName})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </Card>

                          {/* Existing Translations */}
                          {translations?.map((translation) => (
                            <Card key={translation.id} className="p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h5 className="font-medium">
                                    {languages?.find(
                                      (l) => l.code === translation.language
                                    )?.name}{" "}
                                    ({translation.language.toUpperCase()})
                                  </h5>
                                  <p className="text-sm text-gray-500">
                                    Last updated:{" "}
                                    {new Date(
                                      translation.lastTranslated
                                    ).toLocaleDateString()}
                                  </p>
                                  <p
                                    className={`text-sm ${
                                      translation.status === "completed"
                                        ? "text-green-500"
                                        : translation.status === "needs_review"
                                        ? "text-yellow-500"
                                        : "text-blue-500"
                                    }`}
                                  >
                                    Status: {translation.status}
                                  </p>
                                </div>
                                <Button
                                  onClick={() =>
                                    validateTranslation.mutate(translation.id)
                                  }
                                  variant="outline"
                                  size="sm"
                                >
                                  Validate
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                      {selectedVersion === version.id && suggestions && (
                        <div className="mt-4 space-y-2">
                          <h4 className="font-semibold">Update Suggestions</h4>
                          {suggestions.map((suggestion) => (
                            <Card key={suggestion.id} className="p-4">
                              <div>
                                <p className="font-medium">
                                  Priority: {suggestion.priority}
                                </p>
                                <p>{suggestion.suggestedChanges.summary}</p>
                                <div className="mt-2">
                                  {suggestion.suggestedChanges.changes.map(
                                    (change, i) => (
                                      <div
                                        key={i}
                                        className="mt-2 p-2 bg-gray-50 rounded"
                                      >
                                        <p className="font-medium">
                                          {change.field}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          Current: {change.currentValue}
                                        </p>
                                        <p className="text-sm text-green-600">
                                          Suggested: {change.suggestedValue}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                          {change.reason}
                                        </p>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </Card>
                          ))}

                          <div className="mt-4">
                            <Label htmlFor="frequency">Refresh Schedule</Label>
                            <Select
                              onValueChange={(value) =>
                                scheduleRefresh.mutate({
                                  id: version.id,
                                  frequency: value,
                                })
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Deployments Tab */}
        <TabsContent value="deployments">
          <Card>
            <CardHeader>
              <CardTitle>Landing Page Deployments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Create Deployment Form */}
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Deploy Landing Page</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const formData = new FormData(form);
                      createDeployment.mutate({
                        contentVersionId: parseInt(formData.get("contentVersion") as string),
                        domain: formData.get("domain") as string,
                        subdomain: formData.get("subdomain") as string || undefined,
                        configuration: {
                          theme: formData.get("theme") || "default",
                          customization: {},
                        },
                      });
                      form.reset();
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="contentVersion">Content Version</Label>
                      <Select name="contentVersion" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content version" />
                        </SelectTrigger>
                        <SelectContent>
                          {contentVersions?.map((version) => (
                            <SelectItem key={version.id} value={version.id.toString()}>
                              {version.drugName} - {version.condition} (v{version.version})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="domain">Domain</Label>
                      <Input
                        id="domain"
                        name="domain"
                        placeholder="Enter domain (e.g., example.com)"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subdomain">Subdomain (Optional)</Label>
                      <Input
                        id="subdomain"
                        name="subdomain"
                        placeholder="Enter subdomain (e.g., landing)"
                      />
                    </div>
                    <Button type="submit">Create Deployment</Button>
                  </form>
                </Card>

                {/* Deployment List */}
                {deployments?.map((deployment) => (
                  <Card key={deployment.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">
                          {deployment.subdomain
                            ? `${deployment.subdomain}.${deployment.domain}`
                            : deployment.domain}
                        </h3>
                        <p
                          className={cn("text-sm", {
                            "text-green-500": deployment.status === "active",
                            "text-yellow-500": deployment.status === "pending",
                            "text-red-500": deployment.status === "failed",
                          })}
                        >
                          Status: {deployment.status}
                        </p>
                        <p className="text-sm text-gray-500">
                          Deployed {new Date(deployment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}