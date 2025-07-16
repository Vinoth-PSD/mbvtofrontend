// Azure Blob Storage configuration
const AZURE_BLOB_BASE_URL = '/azure-images/mbimages/VTOGallery';

// Import the generated manifest
import manifestData from '../data/gallery-manifest.json';

// Function to find a category by path in the manifest
function findCategoryByPath(path) {
  function searchInChildren(children, targetPath) {
    for (const child of children) {
      if (child.path === targetPath) {
        return child;
      }
      if (child.children) {
        const found = searchInChildren(child.children, targetPath);
        if (found) return found;
      }
    }
    return null;
  }
  
  return searchInChildren(manifestData.children, path);
}

// Function to get images for a category with lazy loading
async function getImagesForCategory(categoryPath, page = 1, pageSize = 20) {
  const images = [];
  try {
    // Find the category in the manifest
    const category = findCategoryByPath(categoryPath);
    
    if (!category || !category.files) {
      console.log('Category not found or has no files:', categoryPath);
      return [];
    }
    
    // Construct the Azure Blob URL for the category
    const azurePath = `${AZURE_BLOB_BASE_URL}/${categoryPath}`;
    
    console.log('Loading images for category:', categoryPath);
    console.log('Azure path:', azurePath);
    console.log('Total files in category:', category.files.length);
    
    // Calculate pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageFiles = category.files.slice(startIndex, endIndex);
    
    console.log(`Loading page ${page}: files ${startIndex + 1}-${Math.min(endIndex, category.files.length)}`);
    
    // Generate image objects for the current page
    pageFiles.forEach((imageName, index) => {
      const id = imageName.split('.')[0];
      const imageUrl = `${azurePath}/${imageName}`;
      
      images.push({
        id: `${id}-${startIndex + index}`,
        image: imageUrl,
        title: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      });
    });
    
    console.log('Images loaded for page:', images.length);
    
  } catch (error) {
    console.error('Error loading images for category:', categoryPath, error);
  }
  return images;
}

// Function to get total image count for a category
function getTotalImageCount(categoryPath) {
  const category = findCategoryByPath(categoryPath);
  return category ? category.files.length : 0;
}

// Function to get subcategories based on the manifest structure
function getSubcategories(mainCategoryName) {
  const mainCategory = manifestData.children.find(child => child.name === mainCategoryName);
  if (!mainCategory || !mainCategory.children) {
    return [];
  }
  
  return mainCategory.children.map(child => ({
    id: `${mainCategoryName}-${child.name}`,
    name: child.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    type: child.type,
    path: child.path,
    children: child.children || [],
    totalFiles: child.totalFiles || 0
  }));
}

// Function to get sub-subcategories based on the manifest structure
function getSubSubcategories(mainCategoryName, subcategoryName) {
  const mainCategory = manifestData.children.find(child => child.name === mainCategoryName);
  if (!mainCategory || !mainCategory.children) {
    return [];
  }
  
  const subcategory = mainCategory.children.find(child => child.name === subcategoryName);
  if (!subcategory || !subcategory.children) {
    return [];
  }
  
  return subcategory.children.map(child => ({
    id: `${mainCategoryName}-${subcategoryName}-${child.name}`,
    name: child.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    type: child.type,
    path: child.path,
    totalFiles: child.totalFiles || 0
  }));
}

// Function to load category structure from manifest
async function loadCategoryStructure() {
  const categories = [];

  console.log('Loading category structure from manifest...');

  try {
    for (const mainCategory of manifestData.children) {
      const subcategories = [];
      
      for (const subcategory of mainCategory.children) {
        if (subcategory.type === 'category') {
          // This is a direct category with files
          subcategories.push({
            id: `${mainCategory.name}-${subcategory.name}`,
            name: subcategory.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            categoryPath: subcategory.path,
            totalFiles: subcategory.totalFiles || 0
          });
        } else if (subcategory.type === 'directory' && subcategory.children) {
          // This is a subdirectory with sub-subcategories
          const subSubcategories = subcategory.children.map(subSubcategory => ({
            id: `${mainCategory.name}-${subcategory.name}-${subSubcategory.name}`,
            name: subSubcategory.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            categoryPath: subSubcategory.path,
            totalFiles: subSubcategory.totalFiles || 0
          }));
          
          subcategories.push({
            id: `${mainCategory.name}-${subcategory.name}`,
            name: subcategory.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            subcategories: subSubcategories
          });
        }
      }
      
      categories.push({
        id: mainCategory.name,
        name: mainCategory.name.replace('By', '').split(/(?=[A-Z])/).join(' '),
        subcategories: subcategories
      });
    }
    
    console.log('Category structure loaded:', categories);
    return categories;
  } catch (error) {
    console.error('Error in loadCategoryStructure:', error);
    return [];
  }
}

// Function to load images for a specific category on demand with pagination
async function loadImagesForCategory(categoryPath, page = 1, pageSize = 20) {
  console.log('Loading images on demand for:', categoryPath, 'page:', page);
  return await getImagesForCategory(categoryPath, page, pageSize);
}

// Backward compatibility function
async function loadCategoryImages() {
  return await loadCategoryStructure();
}

export { 
  loadCategoryImages, 
  loadImagesForCategory, 
  loadCategoryStructure,
  getTotalImageCount,
  getSubcategories,
  getSubSubcategories
}; 