import { Request, Response, NextFunction } from 'express';

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  let errorMessage = err.message || 'Internal Server Error';

  if (req && typeof req.t === 'function') {
    try {
      // Try translating the generic error message.
      const translated = req.t("error_generic");
      // Use the translation only if it doesn't equal the key
      if (translated && translated !== "error_generic") {
        errorMessage = translated;
      }
    } catch (translationError) {
      console.error("Translation error in error handler:", translationError);
      // Fallback: leave errorMessage as it is
    }
  }
  
  res.status(err.status || 500).json({ error: errorMessage });
}
