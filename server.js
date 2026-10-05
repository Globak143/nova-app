const express = require("express");
const client = require("prom-client");

const app = express();
const port = process.env.PORT || 3000;

// Prometheus metrics setup
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2],
  registers: [register],
});

// Track every request automatically
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on("finish", () => {
    const labels = { method: req.method, route: req.path, status_code: res.statusCode };
    httpRequestsTotal.inc(labels);
    end(labels);
  });
  next();
});

app.get("/health", (req, res) => {
    res.json({ 
        message: "NOVA-APP is healthy! ⭐", 
        timestamp: new Date().toLocaleString(),
        uptime: `${Math.floor(process.uptime())} seconds`
    });
});

app.get("/version", (req, res) => {
    res.json({
        app: "nova-app",
        version: process.env.APP_VERSION || "dev",
        commit: process.env.GIT_COMMIT || "unknown",
        builtAt: process.env.BUILD_TIME || "unknown",
        author: "Gloria Boakye"
    });
});

app.get("/metrics", async (req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
});

app.get("/", (req, res) => {
    res.send("Hello from NOVA-APP deployed successfully on AWS EKS!✴️");
});

if (require.main === module) {
    app.listen(port, () => {
        console.log("NOVA-APP is running on port 3000");
    });
}

module.exports = app;