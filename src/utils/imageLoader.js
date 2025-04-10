// Function to get all images from a category folder
function getImagesForCategory(categoryPath) {
  const images = [];
  try {
    // Using dynamic import for Vite
    const imageFiles = Object.entries(
      import.meta.glob('/public/images/VTOGallery/**/*.{jpg,jpeg,png}', { eager: true })
    );

    imageFiles.forEach(([path]) => {
      if (path.includes(`/VTOGallery/${categoryPath}/`)) {
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
        subcategories.add(match[1]);
      }
    });

    return Array.from(subcategories);
  } catch (error) {
    console.error('Error getting subcategories:', error);
    return [];
  }
}

async function loadCategoryImages() {
  const mainCategories = ['ByProgramme', 'ByRegion', 'ByTraditions'];
  const categories = [];

  try {
    for (const mainCategory of mainCategories) {
      const subcats = getSubcategories(mainCategory);
      console.log("subcats",subcats)
      
      if (subcats.length > 0) {
        const subCategoryImages = subcats.map(subcat => ({
          id: `${mainCategory}-${subcat}`,
          name: subcat.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          looks: getImagesForCategory(`${mainCategory}/${subcat}`)
        }));
        
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