import { Request, Response, NextFunction } from 'express';

// Security middleware to add HTTPS-related headers
export const securityMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN'); // Changed from DENY to allow Replit's iframe
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Let Replit handle HTTPS
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
};

// CSP middleware with development-friendly settings
export const cspMiddleware = (_req: Request, res: Response, next: NextFunction) => {
  // More permissive CSP for development environment
  const isDev = process.env.NODE_ENV === 'development';

  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      // Allow inline scripts and eval for development
      `script-src 'self' ${isDev ? "'unsafe-inline' 'unsafe-eval'" : ''}`,
      // Allow inline styles for shadcn/ui
      "style-src 'self' 'unsafe-inline'",
      // Allow images from any HTTPS source and data URIs
      "img-src 'self' data: https: blob:",
      // Allow fonts from self
      "font-src 'self'",
      // Allow connection to our API and websockets for development
      `connect-src 'self' ${isDev ? 'ws: wss:' : ''}`,
      "media-src 'self'",
      "object-src 'none'",
      // Allow framing from same origin for Replit
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  );

  next();
};