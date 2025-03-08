// Function to get all images from a category folder
function getImagesForCategory(category) {
  const images = [];
  try {
    // Using dynamic import for Vite
    const imageFiles = Object.entries(
      import.meta.glob('/public/images/**/*.{jpg,jpeg,png}', { eager: true })
    );

    imageFiles.forEach(([path]) => {
      if (path.includes(`/images/${category}/`)) {
        const id = path.split('/').pop().split('.')[0]; // Get filename without extension
        images.push({
          id,
          image: path.replace('/public', ''),
          title: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        });
      }
    });
  } catch (error) {
    console.error('Error loading images:', error);
  }
  return images;
}

function loadCategoryImages() {
  return [
    {
      id: 1,
      name: 'Hindu Brides',
      looks: getImagesForCategory('hindu-brides')
    },
    {
      id: 2,
      name: 'Muslim Brides',
      looks: getImagesForCategory('muslim-brides')
    },
    {
      id: 3,
      name: 'Christian Brides',
      looks: getImagesForCategory('christian-brides')
    },
    {
      id: 4,
      name: 'Kerala Brides',
      looks: getImagesForCategory('kerala-brides')
    }
  ];
}

export { loadCategoryImages }; 