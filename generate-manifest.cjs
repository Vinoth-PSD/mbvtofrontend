const fs = require('fs');
const path = require('path');

console.log('Starting manifest generation...');

const GALLERY_PATH = './public/images/VTOGallery';
const MANIFEST_PATH = './src/data/gallery-manifest.json';

// Simple function to get image files
function getImageFiles(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    return files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    }).slice(0, 50); // Limit to 50 files for performance
  } catch (error) {
    console.error(`Error reading ${dirPath}:`, error.message);
    return [];
  }
}

// Build structure
function buildStructure() {
  const structure = {
    type: 'directory',
    name: 'VTOGallery',
    children: []
  };

  try {
    const mainDirs = fs.readdirSync(GALLERY_PATH);
    
    for (const mainDir of mainDirs) {
      const mainPath = path.join(GALLERY_PATH, mainDir);
      if (!fs.statSync(mainPath).isDirectory()) continue;
      
      const mainCategory = {
        type: 'directory',
        name: mainDir,
        children: []
      };
      
      const subDirs = fs.readdirSync(mainPath);
      
      for (const subDir of subDirs) {
        const subPath = path.join(mainPath, subDir);
        if (!fs.statSync(subPath).isDirectory()) continue;
        
        const subItems = fs.readdirSync(subPath);
        const hasFiles = subItems.some(item => {
          const itemPath = path.join(subPath, item);
          return fs.statSync(itemPath).isFile();
        });
        
        if (hasFiles) {
          // This is a category with files
          console.log(`Processing: ${mainDir}/${subDir}`);
          const files = getImageFiles(subPath);
          mainCategory.children.push({
            type: 'category',
            name: subDir,
            path: `${mainDir}/${subDir}`,
            files: files,
            totalFiles: files.length
          });
        } else {
          // This is a subdirectory with more subdirectories
          const subCategory = {
            type: 'directory',
            name: subDir,
            children: []
          };
          
          const subSubDirs = fs.readdirSync(subPath);
          for (const subSubDir of subSubDirs) {
            const subSubPath = path.join(subPath, subSubDir);
            if (!fs.statSync(subSubPath).isDirectory()) continue;
            
            console.log(`Processing: ${mainDir}/${subDir}/${subSubDir}`);
            const files = getImageFiles(subSubPath);
            subCategory.children.push({
              type: 'category',
              name: subSubDir,
              path: `${mainDir}/${subDir}/${subSubDir}`,
              files: files,
              totalFiles: files.length
            });
          }
          
          mainCategory.children.push(subCategory);
        }
      }
      
      structure.children.push(mainCategory);
    }
    
  } catch (error) {
    console.error('Error building structure:', error);
  }
  
  return structure;
}

// Generate manifest
try {
  const structure = buildStructure();
  
  // Create data directory
  const dataDir = path.dirname(MANIFEST_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Write manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(structure, null, 2));
  
  console.log('✅ Manifest generated successfully!');
  console.log(`📁 Location: ${MANIFEST_PATH}`);
  
} catch (error) {
  console.error('❌ Error:', error);
} 