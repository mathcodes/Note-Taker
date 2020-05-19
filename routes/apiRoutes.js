var db = require("../db/db");
const { v4: uuidv4 } = require("uuid");
const util = require("util");
const fs = require("fs");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
// const store = require("../db/store");
// Read
function readDB() {
  return readFileAsync("db/db.json", "utf8");
}
// Write
function writeDB(note) {
  return writeFileAsync("db/db.json", JSON.stringify(note, null, 2));
}


module.exports = function (app) {

  app.get("/api/notes", function (req, res) {
    readDB()
      .then(notes => res.json(JSON.parse(notes)))
      .catch(err => res.status(500).json(err));
  });

  app.post("/api/notes", function (req, res) {
    req.body.id = uuidv4();
    db.push(req.body);
    writeDB(db)
      .then(res.status(200).json("Added a note."))
      .catch(err => res.status(500).json(err));

  });

  app.delete("/api/notes/:id", function (req, res) {
    const deleteID = req.params.id;
    for (let i = 0; i < db.length; i++) {
      let note = db[i];
      if (note.id === deleteID) {
        db.splice(i, 1);
      }
    }
    writeDB(db)
      .then(res.status(200).json("Finished deleting."))
      .catch(err => res.status(500).json(err));
  })

};
