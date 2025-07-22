# Gallery Manifest System

This project now uses a static JSON manifest to map the folder structure and file lists for the VTO Gallery. This approach provides better performance and scalability compared to hardcoded image lists.

## How It Works

1. **Manifest Generation**: A Node.js script scans the `public/images/VTOGallery` directory and generates a JSON manifest containing the folder structure and file lists.

2. **Dynamic Loading**: The frontend uses this manifest to:
   - Display the folder structure (categories, subcategories, sub-subcategories)
   - Load images on-demand with pagination
   - Show total file counts for each category

3. **Lazy Loading**: Images are loaded in batches of 20 per page, improving performance for categories with many images.

## File Structure

```
src/
├── data/
│   └── gallery-manifest.json    # Generated manifest file
├── utils/
│   └── imageLoader.js          # Updated to use manifest
└── components/
    └── look-selection/
        └── LookGrid.jsx        # Updated with pagination
```

## Usage

### Regenerating the Manifest

When you add, remove, or rename images in the `public/images/VTOGallery` directory, regenerate the manifest:

```bash
npm run generate-manifest
```

Or manually:
```bash
node generate-manifest.cjs
```

### Manifest Structure

The manifest follows this structure:
```json
{
  "type": "directory",
  "name": "VTOGallery",
  "children": [
    {
      "type": "directory",
      "name": "ByProgramme",
      "children": [
        {
          "type": "category",
          "name": "Engagement",
          "path": "ByProgramme/Engagement",
          "files": ["image1.jpg", "image2.jpg", ...],
          "totalFiles": 50
        }
      ]
    }
  ]
}
```

## Benefits

1. **Performance**: Only loads images for the current page (20 images at a time)
2. **Scalability**: Can handle thousands of images without performance issues
3. **Maintainability**: No need to manually update hardcoded image lists
4. **Flexibility**: Easy to add new categories or reorganize the folder structure

## Configuration

- **Images per page**: 20 (configurable in `LookGrid.jsx`)
- **Max files per category**: 50 (configurable in `generate-manifest.cjs`)
- **Azure Blob Storage URL**: `/azure-images/mbimages/VTOGallery` (configurable in `imageLoader.js`)

## Troubleshooting

If images don't load:
1. Check that the manifest was generated correctly
2. Verify the Azure Blob Storage URL is correct
3. Ensure the Vite proxy is configured for Azure Blob Storage
4. Check browser console for any errors

## Migration from Hardcoded Lists

The new system is backward compatible. The `loadCategoryImages()` function still works the same way, but now uses the manifest instead of hardcoded lists. 