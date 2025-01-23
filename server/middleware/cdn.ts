import { Request, Response, NextFunction } from 'express';
import { cdnService } from '../services/cdn';

export const cdnMiddleware = () => {
  // Initialize CDN service
  cdnService.initialize();

  return (req: Request, res: Response, next: NextFunction) => {
    // Add CDN helper to res.locals for use in routes
    res.locals.cdn = {
      getAssetUrl: (path: string, options = {}) => cdnService.getAssetUrl(path, options),
    };

    next();
  };
};

// Asset URL helper for use in frontend
export const getAssetUrl = (path: string, options = {}) => {
  if (process.env.NODE_ENV === 'development') {
    return path;
  }
  return cdnService.getAssetUrl(path, options);
};
