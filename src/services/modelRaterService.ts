
import { useToast } from "@/hooks/use-toast";

interface ModelDetails {
  angelicness?: number;
  "model agency rate"?: string;
  sexyness?: number;
  "look unique features"?: string;
  [key: string]: any;
}

export const sendImageForRating = async (imageData: string) => {
  const toast = useToast();
  
  try {
    // Convert base64 string to blob
    const base64Response = await fetch(imageData);
    const blob = await base64Response.blob();
    
    // Create FormData
    const formData = new FormData();
    formData.append("Picture", blob, "image.jpg");
    
    // Send to API endpoint
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
      // Parse the JSON string from the response
      const jsonMatch = data.resp[0].match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        const modelData = JSON.parse(jsonMatch[1]) as ModelDetails;
        
        return {
          modelDetails: modelData,
          rating: modelData.angelicness ? Math.round(modelData.angelicness / 10) : null
        };
      }
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Error sending image:", error);
    throw error;
  }
};
