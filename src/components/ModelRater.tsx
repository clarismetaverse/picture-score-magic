
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCamera } from "@/hooks/useCamera";
import CameraView from "@/components/model-rater/CameraView";
import ImagePreview from "@/components/model-rater/ImagePreview";
import { sendImageForRating } from "@/services/modelRaterService";

const ModelRater = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [modelDetails, setModelDetails] = useState<any>(null);
  const { toast } = useToast();
  const {
    capturedImage,
    setCapturedImage,
    videoRef,
    startCamera,
    capturePhoto,
    resetImage
  } = useCamera();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetRating = async () => {
    if (!capturedImage) {
      toast({
        title: "No Image",
        description: "Please capture or upload an image first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setRating(null);
    setModelDetails(null);

    try {
      const result = await sendImageForRating(capturedImage);
      
      if (result && result.rating !== null) {
        setRating(result.rating);
        setModelDetails(result.modelDetails);
        toast({
          title: "Rating Received",
          description: `Your model rating is: ${result.rating}/10`,
        });
      }
    } catch (error) {
      console.error("Error getting rating:", error);
      toast({
        title: "Rating Error",
        description: "Failed to get your rating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    resetImage();
    setRating(null);
    setModelDetails(null);
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center">Model Rater</CardTitle>
        </CardHeader>
        <CardContent>
          {!capturedImage ? (
            <CameraView
              videoRef={videoRef}
              startCamera={startCamera}
              capturePhoto={capturePhoto}
              handleFileUpload={handleFileUpload}
            />
          ) : (
            <ImagePreview
              capturedImage={capturedImage}
              rating={rating}
              modelDetails={modelDetails}
              isLoading={isLoading}
              onGetRating={handleGetRating}
              onReset={handleReset}
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {/* Footer content is now handled in the respective components */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ModelRater;
