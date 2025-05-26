import { useState, useEffect } from 'react';
import { loadCategoryImages } from '../utils/imageLoader';
import { 
  PhotoIcon, 
  UserIcon, 
  SparklesIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import Breadcrumb from './look-selection/Breadcrumb';
import CategoryGrid from './look-selection/CategoryGrid';
import SubcategoryGrid from './look-selection/SubcategoryGrid';
import LookGrid from './look-selection/LookGrid';
import PhotoUpload from './steps/PhotoUpload';
import GenerateLook from './steps/GenerateLook';
import FinalLook from './steps/FinalLook';

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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadImages() {
      try {
        setIsLoading(true);
        const loadedCategories = await loadCategoryImages();
        setCategories(loadedCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadImages();
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

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const handleBack = () => {
    if (selectedSubcategory) {
      setSelectedSubcategory(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Progress Steps */}
      <div className="sticky top-0 bg-white z-10 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-8 left-1 right-0 h-0.5 bg-gray-200 z-[-1]">
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
                <h2 className="text-2xl font-bold mb-6">Select a Look</h2>
                
                <Breadcrumb 
                  selectedCategory={selectedCategory}
                  selectedSubcategory={selectedSubcategory}
                  onCategoryClick={setSelectedCategory}
                  onSubcategoryClick={setSelectedSubcategory}
                />

                <div className="grid grid-cols-1 gap-8">
                  {!selectedCategory ? (
                    <CategoryGrid 
                      categories={categories} 
                      onCategorySelect={handleCategorySelect} 
                    />
                  ) : !selectedSubcategory ? (
                    <SubcategoryGrid 
                      subcategories={selectedCategory.subcategories} 
                      onSubcategorySelect={handleSubcategorySelect}
                    />
                  ) : (
                    <LookGrid 
                      subcategory={selectedSubcategory}
                      onBack={handleBack}
                      onLookSelect={handleLookSelect}
                    />
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <PhotoUpload 
                selectedLook={selectedLook}
                userPhoto={userPhoto}
                onPhotoUpload={handlePhotoUpload}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <GenerateLook 
                selectedLook={selectedLook}
                userPhoto={userPhoto}
                isGenerating={isGenerating}
                onBack={() => setStep(2)}
                onGenerate={generateLook}
                onPhotoUpload={handlePhotoUpload}
              />
            )}

            {step === 4 && (
              <FinalLook 
                generatedLook={generatedLook}
                selectedLook={selectedLook}
                userPhoto={userPhoto}
                onTryAnother={() => setStep(1)}
                onSave={saveLook}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookGenerator; 