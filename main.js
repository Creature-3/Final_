const express = require('express');
const fs = require('fs');
const uuid = require('uuid');
const app = express();

app.use(express.json());

const filePath = './University.json';

function readFile() {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeFile(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Check university
function checkUE(req, res, next) {
    const universityId = req.params.universityId || req.params.id;
    const universities = readFile();

    if (!universities[universityId]) {
        return res.status(404).json({'message': `University id ${universityId} not found`});
    }

    // Attach university to request
    req.university = universities[universityId];
    req.universities = universities;
    req.universityId = universityId;
    next();
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
});

// Routes
app.get('/university/', (req, res) => {
    res.status(200).json({uni: readFile()});
});

app.get('/university/:id', checkUE, (req, res) => {
    res.status(200).json({uni: req.university});
});

app.post('/university', (req, res) => {
    let universities = readFile();
    const id = uuid.v4();
    if (universities[id]) {
        return res.status(400).json({'message': `University id ${id} already exists`});
    }
    req.body['university_id'] = id;
    universities[id] = req.body;
    writeFile(universities);

    res.status(201).json({'university': universities[id]});
});

app.put('/university/:id', checkUE, (req, res) => {
    const data = req.body;
    req.universities[req.universityId] = {...req.university, ...data};
    writeFile(req.universities);

    res.status(200).json({'university': req.universities[req.universityId]});
});

app.post('/university/:id/program', checkUE, (req, res) => {
    const programData = req.body;
    const programId = uuid.v4();
    if (req.university.programs && req.university.programs[programId]) {
        return res.status(400).json({'message': `Program id ${programId} already exists`});
    }
    programData['program_id'] = programId;
    if (!req.university.programs) {
        req.university.programs = {};
    }
    req.university.programs[programId] = programData;
    writeFile(req.universities);

    res.status(201).json({'program': programData});
});

app.delete('/university/:id', checkUE, (req, res) => {
    delete req.universities[req.universityId];
    writeFile(req.universities);

    res.status(200).json({'message': `University id ${req.universityId} has been deleted`});
});

app.put('/university/:universityId/program/:programId', checkUE, (req, res) => {
    const { programId } = req.params;
    const newNameEn = req.body.name_en;

    if (!req.university.programs || !req.university.programs[programId]) {
        return res.status(404).json({'message': `Program id ${programId} not found`});
    }
    req.university.programs[programId].name_en = newNameEn;
    writeFile(req.universities);

    res.status(200).json({'message': 'Program name updated successfully'});
});

app.listen(3000, () => console.log('listening on port 3000'));
