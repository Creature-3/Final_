const { request } = require('express');
const uuid = require('uuid');
const {readFile, writeFile} = require('../utils/fileutils.js');

const gitAll = (req, res) => {
    try{
        res.status(200).json({uni:readFile()})
    }catch(e){
        res.status(500).json({ error: e })
    }
};

//read by id

const gitUniById =(req, res) => {
    try{
        const id = req.params.id
        const university = readFile()[id]
        if(!university) return res.status(404).json({'message':`University id ${id} not found`});
        res.status(200).json({uni:university})
    }catch(e){
        res.status(500).json({ error: e })
    }
}

const createUni =(req, res) => {
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
}

//update

const updateuni =
(req, res) => {
    const data = req.body
    const universityId = req.params.id
    let university = readFile()
    if (!university[universityId]) return res.status(404).json({'message':'not found'});
    data['university_id'] = universityId
    university[universityId] = data
    writeFile(university)
    res.status(200).json({'university':university[universityId]})
}

const deletUni = (req, res) => {
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
}


module.exports = {
    gitAll,
    gitUniById,
    createUni,
    updateuni,
    deletUni,

}
