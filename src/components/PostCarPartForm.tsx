import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Package, Upload } from "lucide-react";
import PhotoUpload from "./PhotoUpload";

interface CarPartFormData {
  title: string;
  description: string;
  make: string;
  model: string;
  year: string;
  partType: string;
  condition: string;
  price: string;
  address: string;
  images: File[];
}

const PostCarPartForm = ({ onPartPosted }: { onPartPosted: () => void }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<File | null>(null);
  const [formData, setFormData] = useState<CarPartFormData>({
    title: "",
    description: "",
    make: "",
    model: "",
    year: "",
    partType: "",
    condition: "",
    price: "",
    address: "",
    images: [],
  });

  const handleInputChange = (field: keyof CarPartFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (file: File | null) => {
    setCurrentPhoto(file);
    if (file) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images.slice(0, 4), file], // Limit to 5 images
      }));
    }
  };

  const uploadImages = async (images: File[]): Promise<string[]> => {
    const uploadPromises = images.map(async (image, index) => {
      const timestamp = Date.now();
      const fileName = `${user?.id}/${timestamp}-${index}.${image.name
        .split(".")
        .pop()}`;

      console.log("Uploading image:", fileName);

      const { data, error } = await supabase.storage
        .from("car-part-images")
        .upload(fileName, image);

      if (error) {
        console.error("Image upload error:", error);
        throw error;
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("car-part-images").getPublicUrl(fileName);

      console.log("Image uploaded successfully, public URL:", publicUrl);
      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to post car parts.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    console.log("Starting car part submission for user:", user.id);

    try {
      // Validate required fields
      if (
        !formData.title ||
        !formData.make ||
        !formData.model ||
        !formData.year ||
        !formData.partType ||
        !formData.condition ||
        !formData.price ||
        !formData.address
      ) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        toast({
          title: "Invalid Price",
          description: "Please enter a valid price.",
          variant: "destructive",
        });
        return;
      }

      const year = parseInt(formData.year);
      if (isNaN(year) || year < 1990 || year > new Date().getFullYear()) {
        toast({
          title: "Invalid Year",
          description: "Please enter a valid year.",
          variant: "destructive",
        });
        return;
      }

      console.log("Form validation passed, proceeding with submission");

      // Upload images if any
      let imageUrls: string[] = [];
      if (formData.images.length > 0) {
        console.log("Uploading images:", formData.images.length);
        try {
          imageUrls = await uploadImages(formData.images);
          console.log("Images uploaded successfully:", imageUrls);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          toast({
            title: "Image Upload Failed",
            description: "Failed to upload images. Posting without images.",
            variant: "destructive",
          });
          // Continue without images
        }
      }

      // Prepare part data
      const partData = {
        supplier_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        make: formData.make.trim(),
        model: formData.model.trim(),
        year: year,
        part_type: formData.partType,
        condition: formData.condition,
        price: price,
        currency: "GHS",
        address: formData.address.trim(),
        images: imageUrls.length > 0 ? imageUrls : null,
        status: "available",
      };

      console.log("Submitting part data:", partData);

      // Save car part
      const { data, error } = await supabase
        .from("car_parts")
        .insert([partData])
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        toast({
          title: "Posting Failed",
          description: `Error: ${error.message}. Please try again.`,
          variant: "destructive",
        });
        return;
      }

      console.log("Car part posted successfully:", data);

      toast({
        title: "Part Posted Successfully!",
        description:
          "Your car part has been posted and is now available for buyers.",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        make: "",
        model: "",
        year: "",
        partType: "",
        condition: "",
        price: "",
        address: "",
        images: [],
      });
      setCurrentPhoto(null);
      onPartPosted();
    } catch (error: any) {
      console.error("Unexpected error during part posting:", error);
      toast({
        title: "Posting Failed",
        description:
          error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-orange-700 flex items-center gap-2">
          <Package className="h-6 w-6" />
          Post Car Part
        </CardTitle>
        <p className="text-gray-600">Add a new car part to your inventory</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <Label htmlFor="title">Part Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Front Brake Pads for Toyota Camry"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the condition, compatibility, and any additional details..."
              rows={3}
            />
          </div>

          {/* Car Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="make">Car Make *</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => handleInputChange("make", e.target.value)}
                placeholder="Toyota"
                required
              />
            </div>
            <div>
              <Label htmlFor="model">Car Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                placeholder="Camry"
                required
              />
            </div>
            <div>
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange("year", e.target.value)}
                placeholder="2020"
                min="1990"
                max={new Date().getFullYear()}
                required
              />
            </div>
          </div>

          {/* Part Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Part Type *</Label>
              <Select
                value={formData.partType}
                onValueChange={(value) => handleInputChange("partType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select part type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engine">Engine</SelectItem>
                  <SelectItem value="Transmission">Transmission</SelectItem>
                  <SelectItem value="Brakes">Brakes</SelectItem>
                  <SelectItem value="Suspension">Suspension</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Body">Body</SelectItem>
                  <SelectItem value="Interior">Interior</SelectItem>
                  <SelectItem value="Tires & Wheels">Tires & Wheels</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Condition *</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => handleInputChange("condition", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Used">Used</SelectItem>
                  <SelectItem value="Refurbished">Refurbished</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (GHS)kklkldkl *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="150.00"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Location/Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Accra, Greater Accra"
                required
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <Label>Part Photos</Label>
            <PhotoUpload
              onPhotoChange={handlePhotoChange}
              currentPhoto={currentPhoto}
            />
            {formData.images.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {formData.images.length} photo
                {formData.images.length > 1 ? "s" : ""} selected
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800"
          >
            {loading ? "Posting..." : "Post Car Part"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostCarPartForm;
