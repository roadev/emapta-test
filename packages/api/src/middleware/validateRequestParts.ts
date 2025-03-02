import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

interface RequestSchemas {
  body?: ZodSchema<any>;
  query?: ZodSchema<any>;
  params?: ZodSchema<any>;
}

export const validateRequestParts = (schemas: RequestSchemas) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      next();
    } catch (error: any) {
      res.status(400).json({ errors: error.errors });
      return;
    }
  };
};
