const University = require('../models/model.js');

const gitAll = async (req, res) => {
    try{
        const universities = await University.findOne();
        res.status(200).json({universities})
    }catch(e){
        res.status(500).json({ error: e.message });
    }
};

//read by id

const gitUniById = async (req, res) => {
    try{
        const id = req.params.id
        const university = await University.findById(id);
        if(!university) return res.status(404).json({'message':`University id ${id} not found`});
        res.status(200).json({universities})
    }catch(e){
        res.status(500).json({ error: e.message });
    }
};

const createUni = async (req, res) => {
    try{
        const data = req.body
        const university = new University(data)
        await University.create(university);
        res.status(201).json({university})
    }catch (e) {
        res.status(500).json({ error: e.message});
    }

};

//update

const updateuni = async (req, res) => {
    try{
        const id = req.params.id;
        const data = req.body;
        const university = await University.findByIdAndUpdate(id, data, {new: true});
        if (!University) return res.status(404).json({ 'massage' : ' not found'});
        res.status(200).json({university});
    }catch (e){
        res.status(500).json({error: e.massage});
    }

};
    

const deletUni = async (req, res) => {
    try {
        const id = req.params.id;
        const university = await University.findByIdAndDelete(id);
        if (!university) return res.status(404).json({'message': 'not found'});
        res.status(204).json({'message': `University id  has been deleted`});
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};


module.exports = {
    gitAll,
    gitUniById,
    createUni,
    updateuni,
    deletUni,

}
