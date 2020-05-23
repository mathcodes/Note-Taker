const db = require("../db/db");

//This document specifies an Internet standards track protocol for the Internet community, and requests discussion and suggestions for improvements.
// This specification defines a Uniform Resource Name namespace for UUIDs (Universally Unique IDentifier), also known as GUIDs (Globally Unique IDentifier).  A UUID is 128 bits long, and can guarantee uniqueness across space and time.
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

//this is what I'm requiring (like variables) 
//anytime we have a node file that has properties and methods aattached to it already, like exports which starts out as an empty object
//module is an object (constructor function), in it you have a property/objecy called exports that is also an object and populate it with 

module.exports = function(app) {

    app.get("/api/notes", function(req, res) {
        readDB()
            .then(notes => res.json(JSON.parse(notes)))
            .catch(err => res.status(500).json(err));
    });

    app.post("/api/notes", function(req, res) {
        req.body.id = uuidv4();
        db.push(req.body);
        writeDB(db)
            .then(res.status(200).json("Added a note."))
            .catch(err => res.status(500).json(err));

    });

    app.delete("/api/notes/:id", function(req, res) {
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