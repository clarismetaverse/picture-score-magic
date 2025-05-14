
import ModelRater from "@/components/ModelRater";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Picture Score Magic</h1>
          <p className="text-xl text-gray-600">Take a photo and get your model rating instantly!</p>
        </div>
        
        <ModelRater />
        
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Take a photo or upload an image to receive your model rating out of 10.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
