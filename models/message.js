const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }, // User receiving the message (for private messages)
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    }, // Group receiving the message (for group messages)
    content: {
      type: String,
      required: true,
    }, // Text content of the message
    timestamp: {
      type: Date,
      default: Date.now,
    }, // Time the message was sent
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
