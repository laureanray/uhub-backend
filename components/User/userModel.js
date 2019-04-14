const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    }
  },
  birthday: {
    type: String,
    required: true
  },
  university: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  major: {
    type: String,
    required: true
  },
  studentNumber: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  private: {
    password: String,
    token: String
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
