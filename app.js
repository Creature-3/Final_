const express = require('express');
const fs = require('fs');
const uuid = require('uuid');
const app = express();

app.use(express.json());
function readFile (){
    return JSON.parse(fs.readFileSync('./University.json', 'utf8'))
}

function writeFile(data) {
    fs.writeFileSync('./University.json', JSON.stringify(data, null, 2), 'utf8');
}

app.get('/university/', (req, res) => {
    try{
        res.status(200).json({uni:readFile()})
    }catch(e){
        res.status(500).json({ error: e })
    }
})
app.get('/university/:id', (req, res) => {
    try{
        const id = req.params.id
        const university = readFile()[id]
        if(!university) return res.status(404).json({'message':`University id ${id} not found`});
        res.status(200).json({uni:university})
    }catch(e){
        res.status(500).json({ error: e })
    }
})

app.post('/university', (req, res) => {
    const data = req.body
    let university = readFile()
    const id = uuid.v4()
    if (university[id]) {
        return res.json({'message':`University id ${id} is already exists`});
    }
    data['university_id'] = id
    university[id] = data
    writeFile(university)
    res.status(201).json({'university':university[id]})
})

app.put('/university/:id', (req, res) => {
    const data = req.body
    const universityId = req.params.id
    let university = readFile()
    if (!university[universityId]) return res.status(404).json({'message':'not found'});
    data['university_id'] = universityId
    university[universityId] = data
    writeFile(university)
    res.status(200).json({'university':university[universityId]})
})


app.post('/university/:id/program', (req, res) => {
    try {
        const universityId = req.params.id;
        const programData = req.body;
        let universities = readFile();
        if (!universities[universityId]) {
            return res.status(404).json({'message': `University id ${universityId} not found`});
        }
        const programId = uuid.v4();       
        if (universities[universityId].programs && universities[universityId].programs[programId]) {
            return res.status(400).json({'message': `Program id ${programId} already exists`});
        }
        programData['program_id'] = programId; 
        if (!universities[universityId].programs) {
            universities[universityId].programs = {}; 
        }
        universities[universityId].programs[programId] = programData;
        writeFile(universities);
        res.status(201).json({'program': universities[universityId].programs[programId]});
    } catch (e) {
        res.status(500).json({ error: e })
    }
});

app.delete('/university/:id', (req, res) => {
    try {
        const universityId = req.params.id;
        let universities = readFile();
        if (!universities[universityId]) {
            return res.status(404).json({'message': `University id ${universityId} not found`});
        }
        delete universities[universityId];
        writeFile(universities);
        res.status(200).json({'message': `University id ${universityId} has been deleted`});
    } catch (e) {
        res.status(500).json({ error: e })
    }
});

//here to access specific point inside the university>programs>programID

app.put('/university/:universityId/programs/:programId', (req, res) => {
    try {
        const universityId = req.params.universityId;
        const programId = req.params.programId;
        const newNameEn = req.body.name_en; 

        let universities = readFile();
        if (!universities[universityId]) {
            return res.status(404).json({'message': `University id ${universityId} not found`});
        }
        if (!universities[universityId].programs || !universities[universityId].programs[programId]) {
            return res.status(404).json({'message': `Program id ${programId} not found`});
        }
        
        universities[universityId].programs[programId].name_en = newNameEn;

        writeFile(universities); 

        res.status(200).json({'message': 'Program name updated successfully'});
    } catch (e) {
        res.status(500).json({ error: e.toString() });
    }
});

app.listen(3000, console.log('listening on port 3000'))