const express = require('express');
const userController = require('../controllers/userController');
const adminMiddlware = require('../middlwares/adminMiddlware');
const router = express.Router();

router.get('/users',adminMiddlware,userController.getallUsers);
router.get('/users/:id',adminMiddlware, userController.getUserbyId);
router.post('/users', adminMiddlware, userController.createUser);
router.put('/users/:id', adminMiddlware, userController.updateUser);
router.delete('/users/:id', adminMiddlware, userController.deletUser);

module.exports = router;