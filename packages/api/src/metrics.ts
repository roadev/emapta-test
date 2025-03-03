// src/metrics.ts
import client from "prom-client";

export const register = new client.Registry();

export const cacheHitCounter = new client.Counter({
  name: "cache_hits_total",
  help: "Total number of cache hits",
});
register.registerMetric(cacheHitCounter);

export const cacheMissCounter = new client.Counter({
  name: "cache_misses_total",
  help: "Total number of cache misses",
});
register.registerMetric(cacheMissCounter);

export const httpRequestDurationHistogram = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 1.5, 2, 5],
});
register.registerMetric(httpRequestDurationHistogram);

register.setDefaultLabels({
  app: "your-app-name",
});

client.collectDefaultMetrics({ register });

export default register;
