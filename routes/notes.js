const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');

// GET Route for notes
notes.get('/', (req, res) => {
  readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)));
});

// GET Route for note
notes.get('/:note_id', (req, res) => {
  const noteId = req.params.note_id;
  readFromFile('./db/notes.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.note_id === noteId);
      return result.length > 0
        ? res.json(result)
        : res.json('No note found');
    });
});

// DELETE Route for note
notes.delete('/:note_id', (req, res) => {
  const noteId = req.params.note_id;
  readFromFile('./db/notes.json')
    .then((data) => JSON.parse(data))
    .then((json) => {

      const result = json.filter((note) => note.note_id !== noteId);

      writeToFile('./db/notes.json', result);

      res.json(`Item ${noteId} deleted 🗑️`);
    });
});

// POST Route for notes
notes.post('/', (req, res) => {
  console.log(req.body);

  const { username, topic, note } = req.body;

  if (req.body) {
    const newnote = {
      username,
      note,
      topic,
      note_id: uuidv4(),
    };

    readAndAppend(newnote, './db/notes.json');
    res.json(`Note added successfully 🚀`);
  } else {
    res.error('Error adding note');
  }
});

module.exports = notes