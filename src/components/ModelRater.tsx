
import { useState, useRef } from "react";
import { Camera, Image, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ModelRater = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [modelDetails, setModelDetails] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive",
      });
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageDataUrl = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageDataUrl);
        stopCamera();
      }
    }
  };

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

  const sendImageForRating = async () => {
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
      // Convert base64 string to blob
      const base64Response = await fetch(capturedImage);
      const blob = await base64Response.blob();
      
      // Create FormData
      const formData = new FormData();
      formData.append("Picture", blob, "image.jpg");
      
      // Send to your API endpoint - corrected endpoint name with capital S
      const response = await fetch("https://xbut-eryu-hhsg.f2.xano.io/api:TAf2tJRT/SendPicModelRater", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response:", data);
      
      if (data && data.resp && data.resp.length > 0) {
        // Try to extract JSON from the response
        try {
          // Parse the JSON string from the first item in resp array
          const jsonMatch = data.resp[0].match(/```json\n([\s\S]*?)\n```/);
          if (jsonMatch && jsonMatch[1]) {
            const modelData = JSON.parse(jsonMatch[1]);
            setModelDetails(modelData);
            
            // If there's an angelicness score, use that for rating
            if (modelData.angelicness) {
              const angelicRating = Math.round(modelData.angelicness / 10);
              setRating(angelicRating);
              toast({
                title: "Rating Received",
                description: `Your model rating is: ${angelicRating}/10`,
              });
            }
          }
        } catch (error) {
          console.error("Error parsing JSON from response:", error);
          toast({
            title: "Response Format Error",
            description: "Received response but could not parse details",
            variant: "destructive",
          });
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error sending image:", error);
      toast({
        title: "Rating Error",
        description: "Failed to get your rating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetImage = () => {
    setCapturedImage(null);
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
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-md overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex justify-center gap-4">
                <Button onClick={startCamera}>
                  <Camera className="mr-2" />
                  Start Camera
                </Button>
                <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                  <Upload className="mr-2" />
                  Upload Image
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
              </div>
              {videoRef.current?.srcObject && (
                <div className="flex justify-center">
                  <Button onClick={capturePhoto} variant="secondary">
                    <Camera className="mr-2" />
                    Take Photo
                  </Button>
                </div>
              )}
            </div>
          ) : (
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
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          {capturedImage ? (
            <>
              <Button onClick={sendImageForRating} disabled={isLoading}>
                {isLoading ? "Processing..." : "Get My Rating"}
              </Button>
              <Button onClick={resetImage} variant="outline">
                Try Another Photo
              </Button>
            </>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ModelRater;
