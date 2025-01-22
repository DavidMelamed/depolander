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

export default function Dashboard() {
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const { toast } = useToast();

  // Fetch content versions
  const { data: contentVersions } = useQuery<ContentVersion[]>({
    queryKey: ["/api/content-versions"],
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

      <Tabs defaultValue="create" className="space-y-4">
        <TabsList>
          <TabsTrigger value="create">Create Content</TabsTrigger>
          <TabsTrigger value="manage">Manage Content</TabsTrigger>
        </TabsList>

        {/* Create Content Tab */}
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Landing Page</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const url = new FormData(form).get("url") as string;
                  createContent.mutate({ url });
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="url">Competitor URL</Label>
                  <Input
                    id="url"
                    name="url"
                    placeholder="Enter competitor page URL"
                    required
                  />
                </div>
                <Button type="submit">Generate Content</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Content Tab */}
        <TabsContent value="manage">
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
      </Tabs>
    </div>
  );
}