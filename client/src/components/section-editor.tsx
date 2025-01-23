import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChromePicker } from "react-color";
import { GripVertical, Settings, X } from "lucide-react";

interface Section {
  id: number;
  name: string;
  type: string;
  content: any;
  order: number;
  isEditable: boolean;
  styles: any;
}

interface SectionEditorProps {
  sections: Section[];
  onUpdate: (sections: Section[]) => void;
}

export default function SectionEditor({ sections, onUpdate }: SectionEditorProps) {
  const [editingSection, setEditingSection] = useState<number | null>(null);
  const [localSections, setLocalSections] = useState<Section[]>(sections);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(localSections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedSections = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setLocalSections(updatedSections);
    onUpdate(updatedSections);
  };

  const updateSectionContent = (sectionId: number, field: string, value: any) => {
    const updatedSections = localSections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            content: {
              ...section.content,
              [field]: value,
            },
          }
        : section
    );
    setLocalSections(updatedSections);
    onUpdate(updatedSections);
  };

  const updateSectionStyle = (sectionId: number, style: string, value: any) => {
    const updatedSections = localSections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            styles: {
              ...section.styles,
              [style]: value,
            },
          }
        : section
    );
    setLocalSections(updatedSections);
    onUpdate(updatedSections);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sections">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {localSections.map((section, index) => (
              <Draggable
                key={section.id}
                draggableId={section.id.toString()}
                index={index}
                isDragDisabled={!section.isEditable}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={cn("my-2", {
                      "opacity-50": snapshot.isDragging,
                    })}
                  >
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div
                          className="flex items-center space-x-2"
                          {...provided.dragHandleProps}
                        >
                          {section.isEditable && (
                            <GripVertical className="h-4 w-4 text-gray-500" />
                          )}
                          <CardTitle className="text-sm font-medium">
                            {section.name}
                          </CardTitle>
                        </div>
                        <div className="flex items-center space-x-2">
                          {section.isEditable && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setEditingSection(
                                  editingSection === section.id ? null : section.id
                                )
                              }
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {editingSection === section.id ? (
                          <div className="space-y-4">
                            {/* Content Editor */}
                            {Object.entries(section.content).map(
                              ([field, value]) => (
                                <div key={field} className="space-y-2">
                                  <Label className="capitalize">
                                    {field.replace(/([A-Z])/g, " $1").trim()}
                                  </Label>
                                  {typeof value === "string" ? (
                                    field.includes("description") ? (
                                      <Textarea
                                        value={value}
                                        onChange={(e) =>
                                          updateSectionContent(
                                            section.id,
                                            field,
                                            e.target.value
                                          )
                                        }
                                        className="min-h-[100px]"
                                      />
                                    ) : (
                                      <Input
                                        value={value}
                                        onChange={(e) =>
                                          updateSectionContent(
                                            section.id,
                                            field,
                                            e.target.value
                                          )
                                        }
                                      />
                                    )
                                  ) : null}
                                </div>
                              )
                            )}

                            {/* Style Editor */}
                            <div className="space-y-4 mt-6 pt-6 border-t">
                              <h4 className="font-medium">Styles</h4>
                              <div className="grid grid-cols-2 gap-4">
                                {/* Background Color */}
                                <div className="space-y-2">
                                  <Label>Background Color</Label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className="w-[100px] h-[30px] p-0"
                                        style={{
                                          background:
                                            section.styles?.backgroundColor ||
                                            "white",
                                        }}
                                      />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                      <ChromePicker
                                        color={
                                          section.styles?.backgroundColor ||
                                          "white"
                                        }
                                        onChange={(color) =>
                                          updateSectionStyle(
                                            section.id,
                                            "backgroundColor",
                                            color.hex
                                          )
                                        }
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>

                                {/* Text Color */}
                                <div className="space-y-2">
                                  <Label>Text Color</Label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className="w-[100px] h-[30px] p-0"
                                        style={{
                                          background:
                                            section.styles?.color || "black",
                                        }}
                                      />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                      <ChromePicker
                                        color={section.styles?.color || "black"}
                                        onChange={(color) =>
                                          updateSectionStyle(
                                            section.id,
                                            "color",
                                            color.hex
                                          )
                                        }
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>

                                {/* Font Size */}
                                <div className="space-y-2">
                                  <Label>Font Size</Label>
                                  <Select
                                    value={section.styles?.fontSize || "16px"}
                                    onValueChange={(value) =>
                                      updateSectionStyle(
                                        section.id,
                                        "fontSize",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {[12, 14, 16, 18, 20, 24, 28, 32].map(
                                        (size) => (
                                          <SelectItem
                                            key={size}
                                            value={`${size}px`}
                                          >
                                            {size}px
                                          </SelectItem>
                                        )
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Padding */}
                                <div className="space-y-2">
                                  <Label>Padding</Label>
                                  <Select
                                    value={section.styles?.padding || "16px"}
                                    onValueChange={(value) =>
                                      updateSectionStyle(
                                        section.id,
                                        "padding",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {[8, 16, 24, 32, 48, 64].map((size) => (
                                        <SelectItem
                                          key={size}
                                          value={`${size}px`}
                                        >
                                          {size}px
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="min-h-[100px] p-4"
                            style={{
                              backgroundColor:
                                section.styles?.backgroundColor || "transparent",
                              color: section.styles?.color || "inherit",
                              fontSize: section.styles?.fontSize || "inherit",
                              padding: section.styles?.padding || "16px",
                            }}
                          >
                            <div className="prose max-w-none">
                              {Object.entries(section.content).map(
                                ([field, value]) => (
                                  <div key={field}>
                                    {typeof value === "string" && (
                                      <p>{value}</p>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
