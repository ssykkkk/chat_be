const Chat = require('../models/Chat');

const getChats = async (req, res) => {
    try {
        const chats = await Chat.find();
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chats' });
    }
};

const createChat = async (req, res) => {
    const { firstName, lastName } = req.body;
    try {
        const newChat = new Chat({ firstName, lastName, messages: [] });
        await newChat.save();
        res.status(201).json(newChat);
    } catch (error) {
        res.status(500).json({ message: 'Error creating chat' });
    }
};

const updateChat = async (req, res) => {
    const { firstName, lastName } = req.body;
    try {
        const updatedChat = await Chat.findByIdAndUpdate(req.params.id, { firstName, lastName }, { new: true });
        res.status(200).json(updatedChat);
    } catch (error) {
        res.status(500).json({ message: 'Error updating chat' });
    }
};

const deleteChat = async (req, res) => {
    try {
        await Chat.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Chat deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting chat' });
    }
};

module.exports = {
    getChats,
    createChat,
    updateChat,
    deleteChat
};
