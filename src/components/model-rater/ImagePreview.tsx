
import React from "react";
import { Button } from "@/components/ui/button";

interface ModelDetails {
  angelicness?: number;
  "model agency rate"?: string;
  sexyness?: number;
  "look unique features"?: string;
  [key: string]: any;
}

interface ImagePreviewProps {
  capturedImage: string;
  rating: number | null;
  modelDetails: ModelDetails | null;
  isLoading: boolean;
  onGetRating: () => void;
  onReset: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  capturedImage,
  rating,
  modelDetails,
  isLoading,
  onGetRating,
  onReset
}) => {
  return (
    <div className="space-y-4">
      <div className="aspect-video bg-muted rounded-md overflow-hidden">
        <img
          src={capturedImage}
          alt="Captured"
          className="w-full h-full object-cover"
        />
      </div>
      {rating !== null && (
        <div className="bg-primary/10 p-4 rounded-md">
          <p className="text-center text-2xl font-bold">
            Your Rating: {rating}/10
          </p>
          {modelDetails && (
            <div className="mt-2 space-y-2">
              {modelDetails["model agency rate"] && (
                <p><span className="font-semibold">Agency Rate:</span> {modelDetails["model agency rate"]}</p>
              )}
              {modelDetails["look unique features"] && (
                <p><span className="font-semibold">Unique Features:</span> {modelDetails["look unique features"]}</p>
              )}
            </div>
          )}
        </div>
      )}
      <div className="flex justify-center gap-4">
        <Button onClick={onGetRating} disabled={isLoading}>
          {isLoading ? "Processing..." : "Get My Rating"}
        </Button>
        <Button onClick={onReset} variant="outline">
          Try Another Photo
        </Button>
      </div>
    </div>
  );
};

export default ImagePreview;
