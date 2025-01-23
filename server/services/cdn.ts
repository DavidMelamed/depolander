import { v2 as cloudinary } from 'cloudinary';

// CDN Configuration interface
interface CDNConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  folder?: string;
}

class CDNService {
  private static instance: CDNService;
  private isInitialized: boolean = false;

  private constructor() {}

  static getInstance(): CDNService {
    if (!CDNService.instance) {
      CDNService.instance = new CDNService();
    }
    return CDNService.instance;
  }

  initialize(config?: CDNConfig) {
    if (this.isInitialized) return;

    // Initialize with environment variables or provided config
    cloudinary.config({
      cloud_name: config?.cloudName || process.env.CLOUDINARY_CLOUD_NAME,
      api_key: config?.apiKey || process.env.CLOUDINARY_API_KEY,
      api_secret: config?.apiSecret || process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    this.isInitialized = true;
  }

  async uploadFile(file: Buffer, options: { 
    filename?: string, 
    folder?: string,
    transformation?: any
  } = {}): Promise<string> {
    if (!this.isInitialized) {
      // In development, return local path if CDN is not configured
      if (process.env.NODE_ENV === 'development') {
        return `/assets/${options.filename || 'uploaded-file'}`;
      }
      throw new Error('CDN service not initialized');
    }

    try {
      const uploadResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: options.folder || 'static',
            public_id: options.filename,
            transformation: options.transformation,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(file);
      });

      return (uploadResponse as any).secure_url;
    } catch (error) {
      console.error('Failed to upload file to CDN:', error);
      throw error;
    }
  }

  getAssetUrl(path: string, options: { 
    transformation?: any 
  } = {}): string {
    if (!this.isInitialized) {
      // In development, return local path
      return path.startsWith('/') ? path : `/${path}`;
    }

    // If the path is already a full URL, return it
    if (path.startsWith('http')) {
      return path;
    }

    // Remove leading slash if present
    const assetPath = path.startsWith('/') ? path.slice(1) : path;

    // Generate CDN URL with optional transformations
    return cloudinary.url(assetPath, {
      secure: true,
      transformation: options.transformation,
    });
  }
}

export const cdnService = CDNService.getInstance();
