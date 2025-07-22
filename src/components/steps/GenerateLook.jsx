import { SparklesIcon } from '@heroicons/react/24/outline';
import { Circles } from 'react-loader-spinner'
import { useRef } from 'react';

const GenerateLook = ({ selectedLook, userPhoto, isGenerating, onBack, onGenerate, onPhotoUpload }) => {
  const fileInputRef = useRef(null);

  const handleChangePhoto = (e) => {
    e.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (onPhotoUpload) {
      onPhotoUpload(e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-mindfulBlack text-center mb-8">
        {isGenerating ? 'Generating Your Look...' : 'Generate Your Look'}
      </h2>
      
      {isGenerating ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* <img 
            src="https://gray-desert-0c1e9470f.4.azurestaticapps.net/assets/loading.gif" 
            alt="Generating..." 
            className="w-24 h-24"
          /> */}

          <Circles
            height="80"
            width="80"
            color="#FF197D"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />

          <p className="text-lg text-gray-600">Please wait while we create your look...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-12 max-sm:grid-cols-1">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-mindfulBlack">Selected Look</h3>
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={selectedLook.image} 
                  alt="Selected look" 
                  className="w-full aspect-square object-cover"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-mindfulBlack">Your Photo</h3>
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={userPhoto} 
                  alt="Your photo" 
                  className="w-full aspect-square object-cover"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={handleChangePhoto}
                  className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-main px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300 text-sm"
                >
                  Change Photo
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-4 max-sm:flex-col max-sm:space-y-5 max-sm:space-x-0">
            <button
              onClick={onBack}
              className="px-8 py-3 text-main border-2 border-main hover:bg-main hover:text-white rounded-lg transition-all duration-300 font-medium"
            >
              Back to Photos
            </button>
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className={`px-12 py-3 bg-main text-white rounded-lg transition-all duration-300 font-medium text-lg flex items-center max-sm:justify-center
                ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
            >
              <SparklesIcon className="w-6 h-6 mr-2" />
              Generate Look
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GenerateLook; 