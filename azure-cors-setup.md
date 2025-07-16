# Azure Blob Storage CORS Configuration Guide

## Problem
You're getting CORS errors when trying to access Azure Blob Storage from your local development server (http://localhost:5173).

## Solution: Configure CORS on Azure Storage Account

### Method 1: Using Azure Portal (Easiest)

1. **Go to Azure Portal**
   - Navigate to your Azure Storage Account: `mbimagestorage`

2. **Access CORS Settings**
   - In the left menu, click on "Settings" → "Resource sharing (CORS)"
   - Or search for "CORS" in the search bar

3. **Add CORS Rule**
   - Click "Add" to create a new CORS rule
   - Fill in the following details:
     - **Allowed origins**: `http://localhost:5173`
     - **Allowed methods**: `GET, HEAD`
     - **Allowed headers**: `*`
     - **Exposed headers**: `*`
     - **Max age (seconds)**: `86400` (24 hours)

4. **Save the Rule**
   - Click "Save" to apply the CORS configuration

### Method 2: Using Azure CLI

```bash
# Install Azure CLI if you haven't already
# Then run these commands:

# Login to Azure
az login

# Set the CORS rule for your storage account
az storage cors add \
  --account-name mbimagestorage \
  --services b \
  --methods GET HEAD \
  --origins "http://localhost:5173" \
  --allowed-headers "*" \
  --exposed-headers "*" \
  --max-age 86400
```

### Method 3: Using PowerShell

```powershell
# Install Azure PowerShell module if you haven't already
# Then run these commands:

# Login to Azure
Connect-AzAccount

# Set the CORS rule
$CorsRules = (@{
    AllowedOrigins = @("http://localhost:5173")
    AllowedMethods = @("GET", "HEAD")
    AllowedHeaders = @("*")
    ExposedHeaders = @("*")
    MaxAgeInSeconds = 86400
})

Set-AzStorageCORSRule -ServiceType Blob -AccountName mbimagestorage -CorsRules $CorsRules
```

## For Production

When you deploy to production, you'll need to add your production domain to the CORS rules as well:

- **Allowed origins**: `https://yourdomain.com` (replace with your actual domain)
- Or use `*` to allow all origins (less secure but easier for testing)

## Alternative: Use a Proxy (Temporary Solution)

If you can't configure CORS immediately, you can create a simple proxy in your Vite development server:

### Update vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/azure-images': {
        target: 'https://mbimagestorage.blob.core.windows.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/azure-images/, '')
      }
    }
  }
})
```

Then update your imageLoader.js to use the proxy:

```javascript
const AZURE_BLOB_BASE_URL = '/azure-images/mbimages/VTOGallery';
```

## Testing

After configuring CORS:
1. Restart your development server
2. Clear your browser cache
3. Try accessing the application again

The CORS errors should be resolved and images should load properly. 