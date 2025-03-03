import { Request, Response, NextFunction } from "express";
import { httpRequestDurationHistogram } from "../metrics";

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const end = httpRequestDurationHistogram.startTimer();
  
  res.on("finish", () => {
    const route = req.route?.path || req.path;
    end({ method: req.method, route, status_code: res.statusCode.toString() });
  });
  
  next();
};
