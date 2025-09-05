const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const user = mongoose.model("User", UserSchema);
//in mongodb atlas the Expense looks like expenses its transforms to lower case
module.exports = user;
