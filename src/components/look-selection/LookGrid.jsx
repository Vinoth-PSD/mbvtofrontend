import { useState, useEffect } from 'react';
import { loadImagesForCategory, getTotalImageCount } from '../../utils/imageLoader';

const LookCard = ({ look, onClick }) => (
  <button
    onClick={() => onClick(look)}
    className="relative group overflow-hidden rounded-lg shadow hover:shadow-lg transition-all duration-300"
  >
    <div className="aspect-square">
      <img
        src={look.image}
        alt="Look preview"
        className="w-full h-full object-cover transition-transform group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
    </div>
  </button>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main"></div>
    <span className="ml-3 text-gray-600">Loading images...</span>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' ? onPageChange(page) : null}
          disabled={page === '...'}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            page === currentPage
              ? 'bg-main text-white'
              : page === '...'
              ? 'text-gray-400 cursor-default'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

const LookGrid = ({ subcategory, onBack, onLookSelect }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalImages, setTotalImages] = useState(0);
  const imagesPerPage = 20;

  // Format the subcategory name to be more readable
  const formatSubcategoryName = (name) => {
    return name.replace(/([A-Z])/g, ' $1').trim();
  };

  // Load images when component mounts or page changes
  useEffect(() => {
    const loadImages = async () => {
      if (!subcategory.categoryPath) {
        setError('No category path available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Loading images for category path:', subcategory.categoryPath, 'page:', currentPage);
        
        // Load images for current page
        const loadedImages = await loadImagesForCategory(subcategory.categoryPath, currentPage, imagesPerPage);
        setImages(loadedImages);
        
        // Get total image count if not already set
        if (totalImages === 0) {
          const total = getTotalImageCount(subcategory.categoryPath);
          setTotalImages(total);
        }
        
        console.log('Loaded', loadedImages.length, 'images for page', currentPage);
      } catch (err) {
        console.error('Error loading images:', err);
        setError('Failed to load images. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [subcategory.categoryPath, currentPage]);

  // Calculate pagination
  const totalPages = Math.ceil(totalImages / imagesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of the grid
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="border rounded-lg overflow-hidden shadow-lg">
        <h4 className="font-medium p-4 bg-main text-white flex justify-between items-center">
          <span>{formatSubcategoryName(subcategory.name)}</span>
          <button 
            onClick={onBack}
            className="text-sm bg-white text-main px-3 py-1 rounded hover:bg-gray-100"
          >
            Back
          </button>
        </h4>
        <div className="p-6">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border rounded-lg overflow-hidden shadow-lg">
        <h4 className="font-medium p-4 bg-main text-white flex justify-between items-center">
          <span>{formatSubcategoryName(subcategory.name)}</span>
          <button 
            onClick={onBack}
            className="text-sm bg-white text-main px-3 py-1 rounded hover:bg-gray-100"
          >
            Back
          </button>
        </h4>
        <div className="p-6">
          <div className="text-center text-red-500 py-8">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <h4 className="font-medium p-4 bg-main text-white flex justify-between items-center">
        <span>{formatSubcategoryName(subcategory.name)}</span>
        <button 
          onClick={onBack}
          className="text-sm bg-white text-main px-3 py-1 rounded hover:bg-gray-100"
        >
          Back
        </button>
      </h4>
      <div className="p-6">
        <div className="mb-4 text-sm text-gray-600">
          Showing {images.length} of {totalImages} images
          {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
        </div>
        {images.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No images found for this category.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((look) => (
                <LookCard 
                  key={look.id} 
                  look={look} 
                  onClick={onLookSelect}
                />
              ))}
            </div>
            
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LookGrid; 