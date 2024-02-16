const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const dbFilePath = path.join(__dirname, "db/db.json");

function readDbFile() {
  try {
    const notesRaw = fs.readFileSync(dbFilePath);
    return JSON.parse(notesRaw);
  } catch (error) {
    console.error("Error reading the DB file:", error);
    return [];
  }
}

function writeDbFile(notes) {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(notes, null, 2));
  } catch (error) {
    console.error("Error writing to the DB file:", error);
  }
}

app.get("/api/notes", (req, res) => {
  console.log("GET /api/notes");
  const notes = readDbFile();
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  console.log("POST /api/notes");
  const newNote = req.body;
  const notes = readDbFile();

  newNote.id = Date.now().toString();
  notes.push(newNote);

  writeDbFile(notes);
  res.json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
  console.log("DELETE /api/notes/:id");
  const noteId = req.params.id;
  const notes = readDbFile();
  const filteredNotes = notes.filter((note) => note.id !== noteId);

  writeDbFile(filteredNotes);
  res.json({ msg: "Note deleted" });
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
