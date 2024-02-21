const express = require("express");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3001;
const HOST = "0.0.0.0";

const app = express();

function generateUniqueId() {
  // Generate a timestamp (number of milliseconds since Unix epoch)
  const timestamp = new Date().getTime();

  // Generate a random number (between 0 and 9999)
  const random = Math.floor(Math.random() * 10000);

  // Concatenate timestamp and random number to create a unique ID
  const uniqueId = `${timestamp}-${random}`;
  console.log(uniqueId);
  return uniqueId;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware to serve static files
app.use(express.static("public"));

// GET request for notes
app.get("/api/notes", (req, res) => {
  // Log that a GET request was received
  console.log("GET /api/notes request received");

  // Read the file and send to the response
  fs.readFile("./db/db.json", "utf8", (err, data) =>
    err ? console.error(err) : res.json(JSON.parse(data))
  );
});
// Post request for notes
app.post("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const notes = JSON.parse(data);
    const newNote = req.body;
    newNote.id = generateUniqueId(); // Assign a unique ID to the new note
    notes.push(newNote);

    fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.json(newNote);
    });
  });
});

app.delete("/api/notes/:id", (req, res) => {
  console.log("DELETE /api/notes/:id request received");
  const noteId = req.params.id;

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    let notes = JSON.parse(data);
    const updatedNotes = notes.filter((note) => note.id !== noteId);

    fs.writeFile("./db/db.json", JSON.stringify(updatedNotes), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.status(200).json({ message: "Note deleted successfully" });
    });
  });
});

// GET request for homepage
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
  console.log("index.html is running");
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
  console.log("notes.html is running");
});

app.listen(PORT, HOST, () => console.log(`App listening at ${HOST}:${PORT}`));
