import React, { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Package, Upload, Star, Camera, AlertCircle } from "lucide-react";
import PaymentModal from "./PaymentModal";
import { convertFromGHS } from "@/utils/exchangeRates";

interface EnhancedPostCarPartFormProps {
  onPartPosted: () => void;
  hasBusinessSubscription?: boolean;
}

const EnhancedPostCarPartForm = ({
  onPartPosted,
  hasBusinessSubscription = false,
}: EnhancedPostCarPartFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentPhotos, setCurrentPhotos] = useState<File[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null);
  const [currency, setCurrency] = useState("GHS");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    make: "",
    model: "",
    year: "",
    partType: "",
    condition: "",
    price: "",
    address: "",
  });

  useEffect(() => {
    const detectLocation = async () => {
      try {
        if (!navigator.geolocation) {
          console.warn("Geolocation is not supported");
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            console.log("Detected location:", latitude, longitude);

            try {
              const response = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=9bc8410018154a2b98484fb633107c83`
              );

              const data = await response.json();
              const result = data?.results?.[0];

              if (result) {
                const components = result.components;
                const city =
                  components.city ||
                  components.town ||
                  components.village ||
                  "";
                const state = components.state || "";
                const country = components.country || "";
                const countryCode = components["ISO_3166-1_alpha-2"] || "";

                const currencyMap: Record<string, string> = {
                  GH: "GHS",
                  NG: "NGN",
                  KE: "KES",
                  ZA: "ZAR",
                  US: "USD",
                  GB: "GBP",
                  CA: "CAD",
                  IN: "INR",
                  PK: "PKR",
                };

                const detectedCurrency = currencyMap[countryCode] || "USD";

                setFormData((prev) => ({
                  ...prev,
                  address: `${city}, ${state}, ${country}`,
                }));
                setCurrency(detectedCurrency);
              } else {
                console.warn("No result from OpenCage:", data);
              }
            } catch (err) {
              console.error("Failed to reverse geocode:", err);
            }
          },
          (error) => {
            console.warn("Geolocation error:", error.message);
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } catch (error) {
        console.error("Location detection failed:", error);
      }
    };

    detectLocation();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoAdd = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    if (currentPhotos.length >= 10) {
      toast({
        title: "Photo Limit Reached",
        description: "Maximum 10 photos allowed per listing.",
        variant: "destructive",
      });
      return;
    }

    if (currentPhotos.length >= 3 && !hasBusinessSubscription) {
      setPendingPhoto(file);
      setShowPaymentModal(true);
      return;
    }

    setCurrentPhotos((prev) => [...prev, file]);
  };

  const handleExtraPhotoPayment = () => {
    toast({
      title: "Payment Successful!",
      description: "You can now add more photos to your listing.",
    });
    setShowPaymentModal(false);
    if (pendingPhoto) {
      setCurrentPhotos((prev) => [...prev, pendingPhoto]);
      setPendingPhoto(null);
    }
  };

  const removePhoto = (index: number) => {
    setCurrentPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const freePhotosRemaining = Math.max(0, 3 - currentPhotos.length);
  const extraPhotosCost = Math.max(0, currentPhotos.length - 3) * 10;

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

    setLoading(true);

    try {
      const price = parseFloat(formData.price);
      const year = parseInt(formData.year);

      if (isNaN(price) || price <= 0) {
        toast({
          title: "Invalid Price",
          description: "Please enter a valid price.",
          variant: "destructive",
        });
        return;
      }

      if (isNaN(year) || year < 1990 || year > new Date().getFullYear()) {
        toast({
          title: "Invalid Year",
          description: "Please enter a valid year.",
          variant: "destructive",
        });
        return;
      }

      let imageUrls: string[] = [];
      if (currentPhotos.length > 0) {
        try {
          const uploadPromises = currentPhotos.map(async (photo, index) => {
            const timestamp = Date.now();
            const fileName = `${user.id}/${timestamp}-${index}.${photo.name
              .split(".")
              .pop()}`;

            const { error } = await supabase.storage
              .from("car-part-images")
              .upload(fileName, photo);

            if (error) throw error;

            const {
              data: { publicUrl },
            } = supabase.storage.from("car-part-images").getPublicUrl(fileName);

            return publicUrl;
          });

          imageUrls = await Promise.all(uploadPromises);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          toast({
            title: "Image Upload Failed",
            description: "Failed to upload images. Posting without images.",
            variant: "destructive",
          });
        }
      }

      const isFeatured = hasBusinessSubscription;
      const listingDuration = hasBusinessSubscription ? 60 : 30;

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
        currency: currency,
        address: formData.address.trim(),
        images: imageUrls.length > 0 ? imageUrls : null,
        status: "available",
        is_featured: isFeatured,
        featured_until: isFeatured
          ? new Date(
              Date.now() + listingDuration * 24 * 60 * 60 * 1000
            ).toISOString()
          : null,
      };

      const { error } = await supabase
        .from("car_parts")
        .insert([partData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Part Posted Successfully!",
        description: hasBusinessSubscription
          ? "Your car part has been posted and featured automatically!"
          : "Your car part has been posted and is now available for buyers.",
      });

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
      });
      setCurrentPhotos([]);
      onPartPosted();
    } catch (error: any) {
      console.error("Error posting part:", error);
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
          {hasBusinessSubscription && (
            <Badge className="bg-orange-100 text-orange-800">
              <Star className="h-3 w-3 mr-1" />
              Business
            </Badge>
          )}
        </CardTitle>
        <p className="text-gray-600">
          {hasBusinessSubscription
            ? "Post unlimited parts with automatic featuring"
            : "Add a new car part to your inventory"}
        </p>
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
              <Label htmlFor="price">Price ({currency}) *</Label>

              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder={`e.g., 150.00 ${currency}`}
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

          {/* Enhanced Photo Upload Section */}
          <div>
            <Label className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Part Photos
              {!hasBusinessSubscription && (
                <Badge variant="outline" className="text-xs">
                  3 free, then {currency}{" "}
                  {Number(convertFromGHS(10, currency)).toLocaleString(
                    undefined,
                    { maximumFractionDigits: 2 }
                  )}{" "}
                  each
                </Badge>
              )}
            </Label>

            <div className="mt-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoAdd(e.target.files)}
                className="mb-3"
              />

              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Photos: {currentPhotos.length}/10</span>
                  {!hasBusinessSubscription && (
                    <span className="text-gray-600">
                      Free: {freePhotosRemaining} remaining
                    </span>
                  )}
                </div>

                {extraPhotosCost > 0 && !hasBusinessSubscription && (
                  <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-orange-700">
                      Extra photos cost: GHS {extraPhotosCost}
                    </span>
                  </div>
                )}

                {currentPhotos.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {currentPhotos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-16 object-cover rounded border"
                        />
                        {index >= 3 && !hasBusinessSubscription && (
                          <Badge className="absolute -top-1 -right-1 text-xs bg-orange-600">
                            Paid
                          </Badge>
                        )}
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0"
                          onClick={() => removePhoto(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Listing Duration Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">
                Listing Information
              </span>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • Duration: {hasBusinessSubscription ? "60 days" : "30 days"}
              </li>
              <li>
                • Visibility:{" "}
                {hasBusinessSubscription
                  ? "Featured automatically"
                  : "Standard listing"}
              </li>
              <li>
                • Photos:{" "}
                {hasBusinessSubscription
                  ? "Up to 10 included"
                  : `3 free, ${currency} ${Number(
                      convertFromGHS(10, currency)
                    ).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })} per extra`}
              </li>
            </ul>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800"
          >
            {loading
              ? "Posting..."
              : hasBusinessSubscription
              ? "Post Featured Listing"
              : "Post Car Part"}
          </Button>
        </form>
      </CardContent>

      {/* Payment Modal for Extra Photos */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          offerId="extra-photos"
          amount={10}
          onPaymentSuccess={handleExtraPhotoPayment}
        />
      )}
    </Card>
  );
};

export default EnhancedPostCarPartForm;
