// Define dependencies required
const fs = require("fs");
const express = require("express");
const path = require("path");
const { json } = require("express");

//Set up express structure, set up PORT to use Heroku port or 3000 by default
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Super interesting piece of code, sets up a static directory
app.use(express.static(path.join(__dirname, "public")));

//Home Route
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

//Notes Route
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "/db/db.json"), (err, data) => {
    if (err) throw err;
    notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post("/api/notes", (req, res) => {
  newNote = req.body;
  fs.readFile(path.join(__dirname, "db/db.json"), (err, data) => {
    if (err) throw err;
    notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile(
      path.join(__dirname, "/db/db.json"),
      JSON.stringify(notes),
      (err) => {
        if (err) throw err;
        console.log("Succsefully updated notes database");
        res.json(notes);
      }
    );
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const noteTitle = req.params.id;
  res.json(false);

  fs.readFile(path.join(__dirname, "db/db.json"), (err, data) => {
    if (err) throw err;
    notes = JSON.parse(data);
    let i = 0;
    for (const note of notes) {
      if (note.title === noteTitle) {
        notes.splice(i, 1);
        fs.writeFile(
          path.join(__dirname, "db/db.json"),
          JSON.stringify(notes),
          (err) => {
            if (err) throw err;
            console.log("Note deleted succesfully");
          }
        );
        break;
      }
      i++;
    }
  });
});

app.listen(PORT, () => console.log(`App listening on PORT: ${PORT}`));
