import { useState } from "react";
import { Label } from "./label";
import { Input } from "./input";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";

interface ColorScheme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

interface ColorSchemeSelectorProps {
  initialColors?: ColorScheme;
  onChange: (colors: ColorScheme) => void;
}

const presetSchemes = {
  professional: {
    primary: "#1a365d",
    secondary: "#2c5282",
    background: "#ffffff",
    text: "#1a202c",
    accent: "#3182ce",
  },
  medical: {
    primary: "#285e61",
    secondary: "#319795",
    background: "#f7fafc",
    text: "#2d3748",
    accent: "#38b2ac",
  },
  legal: {
    primary: "#744210",
    secondary: "#975a16",
    background: "#fffff0",
    text: "#2d3748",
    accent: "#d69e2e",
  },
};

export function ColorSchemeSelector({ initialColors, onChange }: ColorSchemeSelectorProps) {
  const [colors, setColors] = useState<ColorScheme>(
    initialColors || presetSchemes.professional
  );

  const handleColorChange = (key: keyof ColorScheme, value: string) => {
    const newColors = { ...colors, [key]: value };
    setColors(newColors);
    onChange(newColors);
  };

  const applyPreset = (preset: keyof typeof presetSchemes) => {
    setColors(presetSchemes[preset]);
    onChange(presetSchemes[preset]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Scheme</CardTitle>
        <CardDescription>
          Choose a preset or customize your color scheme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => applyPreset("professional")}
              className="flex-1"
            >
              Professional
            </Button>
            <Button
              variant="outline"
              onClick={() => applyPreset("medical")}
              className="flex-1"
            >
              Medical
            </Button>
            <Button
              variant="outline"
              onClick={() => applyPreset("legal")}
              className="flex-1"
            >
              Legal
            </Button>
          </div>

          <div className="space-y-4">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="capitalize">
                  {key}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={key}
                    type="color"
                    value={value}
                    onChange={(e) =>
                      handleColorChange(key as keyof ColorScheme, e.target.value)
                    }
                    className="w-12 h-8 p-1"
                  />
                  <Input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      handleColorChange(key as keyof ColorScheme, e.target.value)
                    }
                    className="flex-1"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    placeholder="#000000"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 rounded border">
            <h4 className="font-medium mb-2">Preview</h4>
            <div
              className="p-4 rounded"
              style={{ backgroundColor: colors.background }}
            >
              <div
                className="h-8 rounded mb-2"
                style={{ backgroundColor: colors.primary }}
              />
              <div
                className="h-8 rounded mb-2"
                style={{ backgroundColor: colors.secondary }}
              />
              <div
                className="h-8 rounded"
                style={{ backgroundColor: colors.accent }}
              />
              <p style={{ color: colors.text }} className="mt-2">
                Sample text preview
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}