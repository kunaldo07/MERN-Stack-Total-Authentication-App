import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// pre saving
//MiddleWare
userSchema.pre("save", async function (next) {
  // this === user.create or user.save
  // if password isn't changed
  if (!this.isModified("password")) {
    next();
  }

  // else here we bcrypt the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// creating an method in userSchema to compare the inputted password and the actual password for the authentication
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// creating variable
const User = mongoose.model("User", userSchema);

export default User;
