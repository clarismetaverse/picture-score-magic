
import React, { useRef } from "react";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  startCamera: () => Promise<void>;
  capturePhoto: () => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CameraView: React.FC<CameraViewProps> = ({
  videoRef,
  startCamera,
  capturePhoto,
  handleFileUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
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
  );
};

export default CameraView;
