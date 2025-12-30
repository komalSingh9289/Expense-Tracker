import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Your name is required"],
    },
    email: {
      type: String,
      required: [true, "Your email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Your password is required"],
    },
    lastInsight: {
      type: String, // Stores the last generated AI insight
    },
    lastInsightDate: {
      type: Date, // Timestamp of the last insight generation
    },
    lastTransactionChange: {
      type: Date, // Timestamp of the last transaction add/update/delete
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook for hashing password
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Call next to continue the save process
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
});

const User = mongoose.model("User", userSchema);
export default User;
