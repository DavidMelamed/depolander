import { Request, Response, NextFunction } from 'express';

// Security middleware to add HTTPS-related headers
export const securityMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Let Replit handle HTTPS
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
};

// CSP middleware with Replit-friendly settings
export const cspMiddleware = (_req: Request, res: Response, next: NextFunction) => {
  const isDev = process.env.NODE_ENV === 'development';

  // Allow Replit domains
  const replitDomains = [
    '*.repl.co',
    '*.replit.com',
    '*.repl.it',
    '*.repl.dev',
  ].join(' ');

  res.setHeader(
    'Content-Security-Policy',
    [
      `default-src 'self' ${replitDomains}`,
      // Allow scripts needed for development and Replit
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${replitDomains}`,
      // Allow styles needed for shadcn/ui
      "style-src 'self' 'unsafe-inline'",
      // Allow images from trusted sources
      `img-src 'self' data: https: blob: ${replitDomains}`,
      // Allow fonts
      `font-src 'self' ${replitDomains}`,
      // Allow API and WebSocket connections
      `connect-src 'self' ${replitDomains} ws: wss:`,
      "media-src 'self'",
      "object-src 'none'",
      // Allow Replit's viewer to frame the application
      `frame-ancestors 'self' ${replitDomains}`,
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  );

  next();
};