const asyncHandler = require("express-async-handler");
const Message = require("../models/message"); // message model
const Chat = require("../models/chatModel"); // chat model
const User = require("../models/userModel"); // user model
const axios = require("axios");
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId, disappearMode, image, scheduledAt } = req.body;
  console.log(image);
  if ((!content && !image) || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    disappearMode: disappearMode,
    image: image,
    createdAt: scheduledAt,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});



const deleteMessage = asyncHandler(async (req, res) => {
  try {
    const messageId = req.params.id;
    console.log("messageId:", messageId);
    const deletedMessage = await Message.findByIdAndRemove(messageId);

    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    return res.status(204).send(); // Successful deletion, no content
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = {
  sendMessage,
  allMessages,
  deleteMessage,
 
};
