const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

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

app.get("/", (req, res) => {
    res.send("Hello from NOVA-APP deployed successfully on AWS EKS!✴️");
});

if (require.main === module) {
    app.listen(port, () => {
        console.log("NOVA-APP is running on port 3000");
    });
}

module.exports = app;