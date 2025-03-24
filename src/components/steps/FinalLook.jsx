import { CheckCircleIcon } from '@heroicons/react/24/outline';

const FinalLook = ({ generatedLook, selectedLook, userPhoto, onTryAnother, onSave }) => (
  <div className="max-w-5xl mx-auto">
    <h2 className="text-2xl font-bold text-mindfulBlack text-center mb-8">Your Generated Look</h2>
    
    <div className="space-y-6">
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

      <div className="grid grid-cols-2 gap-8 max-w-3xl mx-auto max-sm:grid-cols-1">
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

      <div className="flex justify-center space-x-4 mt-8 max-sm:flex-col max-sm:space-x-0 max-sm:space-y-5">
        <button
          onClick={onTryAnother}
          className="px-8 py-3 text-main border-2 border-main hover:bg-main hover:text-white rounded-lg transition-all duration-300 font-medium"
        >
          Try Another Look
        </button>
        <button
          onClick={onSave}
          className="px-12 py-3 bg-main text-white rounded-lg hover:bg-opacity-90 transition-all duration-300 font-medium text-lg flex items-center max-sm:justify-center"
        >
          <CheckCircleIcon className="w-6 h-6 mr-2" />
          Save Look
        </button>
      </div>
    </div>
  </div>
);

export default FinalLook; 