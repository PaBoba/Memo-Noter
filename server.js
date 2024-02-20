const express = require("express");
const path = require("path");
const fs = require("fs");

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware to serve static files
app.use(express.static("public"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// GET request for reviews
app.get("api/notes", (req, res) => {
  // Log that a GET request was received
  console.log("GET /api/notes request received");

  // Read the file and send to the response
  fs.readFile("./db/db.json", "utf8", (err, data) =>
    err ? console.error(err) : res.json(JSON.parse(data))
  );
});
// POST request to add a review
app.post("/api/reviews", (req, res) => {
  // Log that a POST request was received
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
