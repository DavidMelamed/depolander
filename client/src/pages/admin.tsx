import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColorSchemeSelector } from "@/components/ui/color-scheme-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface ColorScheme {
  id?: number;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

interface LandingPage {
  id: number;
  slug: string;
  title: string;
  colorSchemeId?: number;
  content: any;
}

export default function AdminPage() {
  const queryClient = useQueryClient();
  const [newSlug, setNewSlug] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [selectedPage, setSelectedPage] = useState<LandingPage | null>(null);

  const { data: colorSchemes = [] } = useQuery<ColorScheme[]>({
    queryKey: ["/api/color-schemes"],
  });

  const { data: landingPages = [] } = useQuery<LandingPage[]>({
    queryKey: ["/api/landing-pages"],
  });

  const createColorScheme = useMutation({
    mutationFn: async (colorScheme: Omit<ColorScheme, "id">) => {
      const res = await fetch("/api/color-schemes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(colorScheme),
      });
      if (!res.ok) throw new Error("Failed to create color scheme");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/color-schemes"] });
      toast({
        title: "Success",
        description: "Color scheme created successfully",
      });
    },
  });

  const duplicatePage = useMutation({
    mutationFn: async ({
      id,
      newSlug,
      newTitle,
    }: {
      id: number;
      newSlug: string;
      newTitle: string;
    }) => {
      const res = await fetch(`/api/landing-pages/${id}/duplicate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newSlug, newTitle }),
      });
      if (!res.ok) throw new Error("Failed to duplicate page");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/landing-pages"] });
      setNewSlug("");
      setNewTitle("");
      setSelectedPage(null);
      toast({
        title: "Success",
        description: "Landing page duplicated successfully",
      });
    },
  });

  const handleColorSchemeChange = async (colors: any) => {
    await createColorScheme.mutateAsync({
      name: `Color Scheme ${colorSchemes.length + 1}`,
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      backgroundColor: colors.background,
      textColor: colors.text,
      accentColor: colors.accent,
    });
  };

  const handleDuplicatePage = async () => {
    if (!selectedPage || !newSlug || !newTitle) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    await duplicatePage.mutateAsync({
      id: selectedPage.id,
      newSlug,
      newTitle,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Color Scheme Management */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Color Schemes</CardTitle>
              <CardDescription>
                Create and manage color schemes for your landing pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ColorSchemeSelector onChange={handleColorSchemeChange} />

              <div className="mt-4">
                <h3 className="font-medium mb-2">Existing Color Schemes</h3>
                <div className="space-y-2">
                  {colorSchemes.map((scheme) => (
                    <div
                      key={scheme.id}
                      className="p-2 border rounded flex items-center gap-2"
                    >
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: scheme.primaryColor }}
                      />
                      <span>{scheme.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Page Duplication */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Duplicate Landing Page</CardTitle>
              <CardDescription>
                Create a copy of an existing landing page with a new URL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Select Page to Duplicate</Label>
                  <select
                    className="w-full p-2 border rounded mt-1"
                    value={selectedPage?.id || ""}
                    onChange={(e) =>
                      setSelectedPage(
                        landingPages.find(
                          (p) => p.id === parseInt(e.target.value)
                        ) || null
                      )
                    }
                  >
                    <option value="">Select a page</option>
                    {landingPages.map((page) => (
                      <option key={page.id} value={page.id}>
                        {page.title} ({page.slug})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>New URL Slug</Label>
                  <Input
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    placeholder="new-page-url"
                  />
                </div>

                <div>
                  <Label>New Page Title</Label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="New Page Title"
                  />
                </div>

                <Button
                  onClick={handleDuplicatePage}
                  disabled={!selectedPage || !newSlug || !newTitle}
                >
                  Duplicate Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
