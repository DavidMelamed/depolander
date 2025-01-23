import { Request, Response, NextFunction } from 'express';

// Security middleware to add HTTPS-related headers and enforce HTTPS
export const securityMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Set security headers
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Only force HTTPS redirect in production
  // Replit handles SSL/TLS termination at their edge
  if (process.env.NODE_ENV === 'production' && !req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect(301, `https://${req.get('host')}${req.url}`);
  }

  next();
};

// CSP middleware for enhanced security
export const cspMiddleware = (_req: Request, res: Response, next: NextFunction) => {
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Required for React development
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:", // Allow images from HTTPS sources
      "font-src 'self'",
      "connect-src 'self'",
      "media-src 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  );
  
  next();
};
