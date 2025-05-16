const Chat = require('../models/Chat');
const axios = require('axios');

const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.userId });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats' });
  }
};

const createChat = async (req, res) => {
  const { firstName, lastName } = req.body;
  if (!firstName || !lastName) {
    return res.status(400).json({ message: 'Ім’я та прізвище обов’язкові' });
  }
  try {
    const newChat = new Chat({
      userId: req.user.userId,
      firstName,
      lastName,
      messages: []
    });
    await newChat.save();
    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ message: 'Error creating chat' });
  }
};

const updateChat = async (req, res) => {
  const { firstName, lastName } = req.body;
  if (!firstName || !lastName) {
    return res.status(400).json({ message: 'Ім’я та прізвище обов’язкові' });
  }
  try {
    const updatedChat = await Chat.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { firstName, lastName },
      { new: true }
    );
    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: 'Error updating chat' });
  }
};

const deleteChat = async (req, res) => {
  try {
    await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting chat' });
  }
};

const sendMessage = async (req, res) => {
  const { chatId, text, sender } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Чат не знайдено" });
    }

    const message = { text, sender, timestamp: new Date() };
    chat.messages.push(message);
    await chat.save();

    res.status(200).json({ message: "Повідомлення надіслано", chat });

    setTimeout(async () => {
      try {
        const quoteRes = await axios.get("https://zenquotes.io/api/random");
        const quote = quoteRes.data[0].q;

        const autoReply = {
          text: quote,
          sender: `${chat.firstName} ${chat.lastName}`,
          timestamp: new Date(),
        };

        chat.messages.push(autoReply);
        await chat.save();
        console.log("Надіслано авто-цитату:", quote);
      } catch (err) {
        console.error("Помилка при отриманні цитати:", err.message);
      }
    }, 3000);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

module.exports = {
  getChats,
  createChat,
  updateChat,
  deleteChat,
  sendMessage
};
