import { UserIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';

const SelectedLookCard = ({ selectedLook, onBack }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-mindfulBlack">Selected Look</h2>
    <div className="relative rounded-lg overflow-hidden shadow-lg">
      <img
        src={selectedLook.image}
        alt={selectedLook.title}
        className="w-full aspect-square object-cover"
      />
      {/* <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3">
        <p className="text-lg font-medium">{selectedLook.title}</p>
      </div> */}
    </div>
    <button
      onClick={onBack}
      className="w-full py-3 px-4 text-main hover:text-white border-2 border-main hover:bg-main rounded-lg transition-all duration-300 font-medium"
    >
      Choose Different Look
    </button>
  </div>
);

const PhotoGuidelines = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const faceShapes = [
    {
      name: "Round Face",
      description: "Choose a clear, front-facing photo where your cheeks are visible and your face appears soft and circular."
    },
    {
      name: "Oval Face", 
      description: "Select a photo where your forehead and chin are slightly narrower, and your face has an overall balanced look."
    },
    {
      name: "Square Face",
      description: "Pick a photo with a strong jawline and straight sides. Ensure your face appears wide and defined."
    },
    {
      name: "Heart-Shaped Face",
      description: "Use a photo with a wider forehead and a narrower chin. Tie back your hair to highlight the shape."
    },
    {
      name: "Diamond Face",
      description: "Select a photo where cheekbones are the widest part of your face, with a narrow forehead and jawline."
    },
    {
      name: "Long/Rectangular Face",
      description: "Upload a photo where your face appears longer than it is wide, with equal width at forehead and jawline."
    }
  ];

  const generalRequirements = [
    "Well-lit",
    "Without filters", 
    "Hair tied back (if possible)",
    "Face clearly visible, centered, and not tilted"
  ];

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div>
          <h3 className="text-lg font-semibold text-mindfulBlack">
            Virtual Try-On Photo Guidelines by Face Shape
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            To get the most accurate bridal look preview, please upload a photo that matches your face shape.
          </p>
        </div>
        {isExpanded ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="font-medium text-mindfulBlack mb-2">Choose Your Face Shape:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {faceShapes.map((shape, index) => (
                <div key={index} className="bg-white p-3 rounded-md border border-gray-200">
                  <h5 className="font-medium text-main mb-1">{shape.name}</h5>
                  <p className="text-sm text-gray-700">{shape.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-mindfulBlack mb-2">Make sure the photo is:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {generalRequirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

const UploadCard = ({ userPhoto, onPhotoUpload, onClearPhoto }) => {
  const fileInputRef = useRef(null);

  const handleChangePhoto = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-mindfulBlack">Upload Your Photo</h2>
      
   
      
      <div className={`border-2 border-dashed rounded-lg ${
        userPhoto ? 'border-main' : 'border-gray-300'
      } p-4 text-center`}>
        {userPhoto ? (
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <img
              src={userPhoto}
              alt="Preview"
              className="w-full aspect-square object-cover"
            />
          </div>
        ) : (
          <div className="py-12">
            <UserIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <label className="cursor-pointer">
              <span className="bg-main text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300">
                Select Your Photo
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onPhotoUpload}
                className="hidden"
              />
            </label>
            <p className="pt-4 text-sm text-gray-400">
            Use JPG and PNG file formats for best results.
           </p>
          </div>
        )}

        {userPhoto && (
          <div className="flex justify-center gap-4 mt-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onPhotoUpload}
              className="hidden"
            />
            <button
              onClick={handleChangePhoto}
              className="text-gray-600 hover:text-main transition-colors"
            >
              Change Photo
            </button>
            <button
              onClick={onClearPhoto}
              className="text-red-600 hover:text-red-700 transition-colors"
            >
              Clear Photo
            </button>
          </div>
        )}
      </div>
      <PhotoGuidelines />
    </div>
  );
};

const PhotoUpload = ({ selectedLook, userPhoto, onPhotoUpload, onClearPhoto, onBack, onNext }) => (
  <div className="max-w-5xl mx-auto">
    <div className="grid grid-cols-2 gap-12 max-sm:grid-cols-1">
      <SelectedLookCard selectedLook={selectedLook} onBack={onBack} />
      <UploadCard 
        userPhoto={userPhoto} 
        onPhotoUpload={onPhotoUpload}
        onClearPhoto={onClearPhoto}
      />
    </div>

    {userPhoto && (
      <div className="mt-8 text-center">
        <button
          onClick={onNext}
          className="bg-main text-white px-12 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 font-medium text-lg"
        >
          Continue to Generate
        </button>
      </div>
    )}
  </div>
);

export default PhotoUpload; 