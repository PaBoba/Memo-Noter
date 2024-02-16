// server.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "notes.html"))
);

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

app.get("/api/notes", (req, res) => res.json(readNotes()));

app.post("/api/notes", (req, res) => {
  const notesData = readNotes();
  const newNote = { id: uuidv4(), title: req.body.title, text: req.body.text };
  notesData.push(newNote);
  writeNotes(notesData);
  res.json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
  const notesData = readNotes();
  const noteId = req.params.id;

  const indexToDelete = notesData.findIndex((note) => note.id === noteId);

  if (indexToDelete !== -1) {
    notesData.splice(indexToDelete, 1);
    writeNotes(notesData);
    res.json({ message: "Note deleted successfully" });
  } else {
    res.status(404).json({ error: "Note not found" });
  }
});

function readNotes() {
  try {
    const data = fs.readFileSync(path.join(__dirname, "db", "db.json"), "utf8");
    return JSON.parse(data) || [];
  } catch (error) {
    return [];
  }
}

function writeNotes(data) {
  fs.writeFileSync(
    path.join(__dirname, "db", "db.json"),
    JSON.stringify(data),
    "utf8"
  );
}

app.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));
