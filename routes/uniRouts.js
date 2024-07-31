const express = require('express');
const { gitAll, gitUniById, createUni, updateuni, deletUni } = require('../controllers/fileco');

const uniController= require('../controllers/fileco.js');

const router = express.Router();

router.get('/University',uniController.gitAll);
router.get ('/University',uniController.gitUniById);
router.post('/University',uniController.createUni);
router.put('/University', uniController.updateuni);
router.delete('/University',uniController.deletUni);


module.exports = router;