const express = require('express');
const router = express.Router();
const {
  getChats,
  createChat,
  updateChat,
  deleteChat,
  sendMessage
} = require('../controllers/chatController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', verifyToken, getChats);
router.post('/', verifyToken, createChat);
router.put('/:id', verifyToken, updateChat);
router.delete('/:id', verifyToken, deleteChat);

router.post('/messages', verifyToken, sendMessage);

module.exports = router;
