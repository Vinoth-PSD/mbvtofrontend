import { UserIcon } from '@heroicons/react/24/outline';
import { useRef } from 'react';

const SelectedLookCard = ({ selectedLook, onBack }) => (
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
      onClick={onBack}
      className="w-full py-3 px-4 text-main hover:text-white border-2 border-main hover:bg-main rounded-lg transition-all duration-300 font-medium"
    >
      Choose Different Look
    </button>
  </div>
);

const UploadCard = ({ userPhoto, onPhotoUpload }) => {
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
            <p className="mt-2 text-sm text-gray-500">
              JPG, PNG files are allowed
            </p>
          </div>
        )}

        {userPhoto && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onPhotoUpload}
              className="hidden"
            />
            <button
              onClick={handleChangePhoto}
              className="mt-4 text-gray-600 hover:text-main transition-colors"
            >
              Change Photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const PhotoUpload = ({ selectedLook, userPhoto, onPhotoUpload, onBack, onNext }) => (
  <div className="max-w-5xl mx-auto">
    <div className="grid grid-cols-2 gap-12 max-sm:grid-cols-1">
      <SelectedLookCard selectedLook={selectedLook} onBack={onBack} />
      <UploadCard 
        userPhoto={userPhoto} 
        onPhotoUpload={onPhotoUpload}
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