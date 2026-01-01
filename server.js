const express = require("express");
const app = express();
const port = 3000;

// Add a new route
app.get("/health", (req, res) => {
    res.json({ 
        message: "NOVA-APP is healthy! ⭐", 
        timestamp: new Date().toLocaleString(),
        uptime: `${Math.floor(process.uptime())} seconds`
    });
});

app.get("/", (req, res) => {
    res.send("Hello from NOVA-APP deployed successfully on AWS EKS!✴️");
});

app.listen(port, () => {
    console.log("NOVA-APP is running on port 3000");
});