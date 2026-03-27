const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/chat-list', authMiddleware, chatController.getChatList);
router.get('/:userId', authMiddleware, chatController.getChatHistory);

module.exports = router;
