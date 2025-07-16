// Function to get all images from a category folder
function getImagesForCategory(categoryPath) {
  const images = [];
  try {
    // Using dynamic import for Vite
    const imageFiles = Object.entries(
      import.meta.glob('/public/images/VTOGallery/**/*.{jpg,jpeg,png}', { eager: true })
    );

    imageFiles.forEach(([path]) => {
      // Handle folder names with spaces by encoding the categoryPath
      const encodedCategoryPath = categoryPath.split('/').map(part => encodeURIComponent(part)).join('/');
      if (path.includes(`/VTOGallery/${encodedCategoryPath}/`)) {
        const id = path.split('/').pop().split('.')[0];
        images.push({
          id,
          image: path.replace('/public', ''),
          title: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        });
      }
    });
  } catch (error) {
    console.error('Error loading images for category:', categoryPath, error);
  }
  return images;
}

function getSubcategories(mainCategory) {
  try {
    const allFiles = import.meta.glob('/public/images/VTOGallery/**', { eager: true });
    const subcategories = new Set();
    
    Object.keys(allFiles).forEach(path => {
      // Extract subcategory from path: /VTOGallery/mainCategory/subcategory/...
      const match = path.match(new RegExp(`/VTOGallery/${mainCategory}/([^/]+)`));
      if (match && match[1]) {
        // Handle folder names with spaces by URL decoding
        const subcategoryName = decodeURIComponent(match[1]);
        subcategories.add(subcategoryName);
      }
    });

    return Array.from(subcategories);
  } catch (error) {
    console.error('Error getting subcategories:', error);
    return [];
  }
}

function getSubSubcategories(mainCategory, subcategory) {
  try {
    // Use a simpler approach - look for any files in sub-subcategory folders
    const allFiles = import.meta.glob('/public/images/VTOGallery/**/*.{jpg,jpeg,png}', { eager: true });
    const subSubcategories = new Set();
    
    Object.keys(allFiles).forEach(path => {
      // Check if this file is in a sub-subcategory folder
      if (path.includes(`/VTOGallery/${mainCategory}/${subcategory}/`)) {
        const pathParts = path.split('/');
        const subcategoryIndex = pathParts.findIndex(part => part === subcategory);
        if (subcategoryIndex !== -1 && subcategoryIndex + 1 < pathParts.length) {
          const subSubcategoryName = pathParts[subcategoryIndex + 1];
          // Only add if it's not the file extension part
          if (subSubcategoryName && !subSubcategoryName.includes('.')) {
            subSubcategories.add(subSubcategoryName);
          }
        }
      }
    });

    return Array.from(subSubcategories);
  } catch (error) {
    console.error('Error getting sub-subcategories:', error);
    return [];
  }
}

async function loadCategoryImages() {
  const mainCategories = ['ByProgramme', 'ByRegion', 'ByTraditions', 'ByFeaturedKeralaBrides'];
  const categories = [];

  try {
    for (const mainCategory of mainCategories) {
      const subcats = getSubcategories(mainCategory);
      
      if (subcats.length > 0) {
        const subCategoryImages = subcats.map(subcat => {
          // Check if this subcategory has its own subcategories (like FeaturingKeralaBrides)
          const subSubcats = getSubSubcategories(mainCategory, subcat);
          
          if (subSubcats.length > 0) {
            // This subcategory has sub-subcategories (like Hindu, Muslim, Christian)
            const subSubcategoryImages = subSubcats.map(subSubcat => ({
              id: `${mainCategory}-${subcat}-${subSubcat}`,
              name: subSubcat.split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '),
              looks: getImagesForCategory(`${mainCategory}/${subcat}/${subSubcat}`)
            }));
            
            return {
              id: `${mainCategory}-${subcat}`,
              name: subcat.split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '),
              subcategories: subSubcategoryImages
            };
          } else {
            // This subcategory has images directly
            return {
              id: `${mainCategory}-${subcat}`,
              name: subcat.split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '),
              looks: getImagesForCategory(`${mainCategory}/${subcat}`)
            };
          }
        });
        
        categories.push({
          id: mainCategory,
          name: mainCategory.replace('By', '').split(/(?=[A-Z])/).join(' '),
          subcategories: subCategoryImages
        });
      } else {
        categories.push({
          id: mainCategory,
          name: mainCategory.replace('By', '').split(/(?=[A-Z])/).join(' '),
          looks: getImagesForCategory(mainCategory)
        });
      }
    }
    return categories;
  } catch (error) {
    console.error('Error in loadCategoryImages:', error);
    return [];
  }
}

export { loadCategoryImages }; 