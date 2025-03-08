import { useState, useEffect } from 'react';
import { loadCategoryImages } from '../utils/imageLoader';
import { 
  PhotoIcon, 
  UserIcon, 
  SparklesIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const StepIcon = ({ icon: Icon, active, title, onClick, clickable }) => (
  <div 
    className={`flex flex-col items-center ${clickable ? 'cursor-pointer' : ''}`}
    onClick={clickable ? onClick : undefined}
  >
    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-colors ${
      active ? 'bg-main text-white' : 'bg-gray-100 text-gray-400'
    }`}>
      <Icon className="w-8 h-8" />
    </div>
    <span className={`text-sm font-medium ${
      active ? 'text-main' : 'text-gray-400'
    }`}>
      {title}
    </span>
  </div>
);

const LookGenerator = () => {
  const [step, setStep] = useState(1);
  const [selectedLook, setSelectedLook] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [userPhotoFile, setUserPhotoFile] = useState(null);
  const [generatedLook, setGeneratedLook] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Load categories and their images
    const loadedCategories = loadCategoryImages();
    setCategories(loadedCategories);
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserPhotoFile(file);
      setUserPhoto(URL.createObjectURL(file));
    }
  };

  const fetchImageAsFile = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new File([blob], 'look.jpg', { type: 'image/jpeg' });
  };

  const handleLookSelect = async (look) => {
    try {
      const imageFile = await fetchImageAsFile(look.image);
      setSelectedLook({ ...look, imageFile });
      setStep(2);
    } catch (error) {
      console.error('Error loading look image:', error);
    }
  };

  const generateLook = async () => {
    try {
      setIsGenerating(true);
      document.body.classList.add('generating');
      
      const formData = new FormData();
      formData.append('target_image', selectedLook.imageFile);
      formData.append('swap_image', userPhotoFile);

      const response = await fetch('https://mbvto-degfaze9b7gydca2.eastus2-01.azurewebsites.net/api/face-swap/generate/', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        setGeneratedLook(data.image_url);
        setStep(4);
      } else {
        throw new Error(data.error || 'Failed to generate look');
      }
    } catch (error) {
      console.error('Error generating look:', error);
      alert('Failed to generate look. Please try again.');
    } finally {
      setIsGenerating(false);
      document.body.classList.remove('generating');
    }
  };

  const saveLook = async () => {
    try {
      // Action 1: Download the file locally
      const response = await fetch(generatedLook);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'my-bridal-look.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Action 2: Save to server
      const saveResponse = await fetch('https://mbvto-degfaze9b7gydca2.eastus2-01.azurewebsites.net/api/face-swap/save/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: generatedLook,
          original_look: {
            id: selectedLook.id,
            title: selectedLook.title,
            image: selectedLook.image
          },
          user_photo: userPhoto
        })
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save look on server');
      }

      // Show success message for both actions
      alert('Your look has been saved and downloaded successfully!');

    } catch (error) {
      console.error('Error saving look:', error);
      alert('Failed to save look. Please try again.');
    }
  };

  const steps = [
    { title: 'Select Look', icon: PhotoIcon },
    { title: 'Your Photo', icon: UserIcon },
    { title: 'Generate', icon: SparklesIcon },
    { title: 'Final Look', icon: CheckCircleIcon }
  ];

  const canNavigateToStep = (targetStep) => {
    if (targetStep === 1) return true;
    if (targetStep === 2) return selectedLook !== null;
    if (targetStep === 3) return selectedLook !== null && userPhoto !== null;
    if (targetStep === 4) return false; // Can't skip to final step
    return false;
  };

  const handleStepClick = (targetStep) => {
    if (canNavigateToStep(targetStep)) {
      setStep(targetStep);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Progress Steps */}
      <div className="sticky top-0 bg-white z-10 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200">
              <div 
                className="h-full bg-main transition-all duration-500"
                style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
            
            {/* Step Icons */}
            {steps.map((s, index) => (
              <StepIcon 
                key={index}
                icon={s.icon}
                active={step >= index + 1}
                title={s.title}
                onClick={() => handleStepClick(index + 1)}
                clickable={canNavigateToStep(index + 1)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content Area with Fixed Height */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="min-h-[calc(100vh-200px)] flex flex-col">
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Select a Celebrity Look</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categories.map((category) => (
                    <div key={category.id} className="border rounded-lg overflow-hidden">
                      <h3 className="text-xl font-semibold p-4 bg-gray-50">{category.name}</h3>
                      <div className="grid grid-cols-2 gap-4 p-4">
                        {category.looks.map((look) => (
                          <button
                            key={look.id}
                            onClick={() => handleLookSelect(look)}
                            className="relative group overflow-hidden rounded-lg"
                          >
                            <img
                              src={look.image}
                              alt={look.title}
                              className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                              {look.title}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-2 gap-12">
                  {/* Selected Look Side */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-mindfulBlack">Selected Look</h2>
                    <div className="relative rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={selectedLook.image}
                        alt={selectedLook.title}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3">
                        <p className="text-lg font-medium">{selectedLook.title}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="w-full py-3 px-4 text-main hover:text-white border-2 border-main hover:bg-main rounded-lg transition-all duration-300 font-medium"
                    >
                      Choose Different Look
                    </button>
                  </div>

                  {/* Upload Photo Side */}
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
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </label>
                          <p className="mt-2 text-sm text-gray-500">
                            JPG, PNG files are allowed
                          </p>
                        </div>
                      )}
                      {userPhoto && (
                        <button
                          onClick={() => {
                            setUserPhoto(null);
                            setUserPhotoFile(null);
                          }}
                          className="mt-4 text-gray-600 hover:text-main transition-colors"
                        >
                          Change Photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                {userPhoto && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setStep(3)}
                      className="bg-main text-white px-12 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 font-medium text-lg"
                    >
                      Continue to Generate
                    </button>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold text-mindfulBlack text-center mb-8">
                  {isGenerating ? 'Generating Your Look...' : 'Generate Your Look'}
                </h2>
                
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <img 
                      src="https://gray-desert-0c1e9470f.4.azurestaticapps.net/assets/loading.gif" 
                      alt="Generating..." 
                      className="w-24 h-24"
                    />
                    <p className="text-lg text-gray-600">Please wait while we create your look...</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-12">
                      {/* Selected Look Side */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-mindfulBlack">Selected Look</h3>
                        <div className="relative rounded-lg overflow-hidden shadow-lg">
                          <img 
                            src={selectedLook.image} 
                            alt={selectedLook.title} 
                            className="w-full aspect-square object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3">
                            <p className="text-lg font-medium">{selectedLook.title}</p>
                          </div>
                        </div>
                      </div>

                      {/* User Photo Side */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-mindfulBlack">Your Photo</h3>
                        <div className="relative rounded-lg overflow-hidden shadow-lg">
                          <img 
                            src={userPhoto} 
                            alt="Your photo" 
                            className="w-full aspect-square object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex justify-center space-x-4">
                      <button
                        onClick={() => setStep(2)}
                        className="px-8 py-3 text-main border-2 border-main hover:bg-main hover:text-white rounded-lg transition-all duration-300 font-medium"
                      >
                        Back to Photos
                      </button>
                      <button
                        onClick={generateLook}
                        disabled={isGenerating}
                        className={`px-12 py-3 bg-main text-white rounded-lg transition-all duration-300 font-medium text-lg flex items-center
                          ${isGenerating 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:bg-opacity-90'
                          }`}
                      >
                        <SparklesIcon className="w-6 h-6 mr-2" />
                        Generate Look
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold text-mindfulBlack text-center mb-8">Your Generated Look</h2>
                
                <div className="space-y-6">
                  {/* Generated Image */}
                  <div className="relative rounded-xl overflow-hidden shadow-2xl mx-auto max-w-2xl">
                    {generatedLook && (
                      <img
                        src={generatedLook}
                        alt="Generated look"
                        className="w-full object-cover"
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <p className="text-white text-lg font-medium">Your New Bridal Look</p>
                    </div>
                  </div>

                  {/* Comparison Images */}
                  <div className="grid grid-cols-2 gap-8 max-w-3xl mx-auto">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 text-center">Original Look</p>
                      <div className="rounded-lg overflow-hidden shadow-lg">
                        <img 
                          src={selectedLook.image} 
                          alt="Original look" 
                          className="w-full aspect-square object-cover"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 text-center">Your Photo</p>
                      <div className="rounded-lg overflow-hidden shadow-lg">
                        <img 
                          src={userPhoto} 
                          alt="Your photo" 
                          className="w-full aspect-square object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-4 mt-8">
                    <button
                      onClick={() => setStep(1)}
                      className="px-8 py-3 text-main border-2 border-main hover:bg-main hover:text-white rounded-lg transition-all duration-300 font-medium"
                    >
                      Try Another Look
                    </button>
                    <button
                      onClick={saveLook}
                      className="px-12 py-3 bg-main text-white rounded-lg hover:bg-opacity-90 transition-all duration-300 font-medium text-lg flex items-center"
                    >
                      <CheckCircleIcon className="w-6 h-6 mr-2" />
                      Save Look
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookGenerator; 