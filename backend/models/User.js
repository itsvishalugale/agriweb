const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // never return password in queries
    },
    role: {
      type: String,
      enum: ["farmer", "buyer"],
      required: true,
    },
    accountDetails: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      location: { type: String, required: true, trim: true },
      bio: { type: String, default: "" },
      profileImage: { type: String, default: "" },
    },
    notifications: [
      {
        message: String,
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

// ────────────────────────────────────────
// ✅ FIXED PASSWORD HASHING (NO next() USED)
userSchema.pre("save", async function () {
  console.log("pre-save middleware running...");

  // Only hash if password is modified
  if (!this.isModified("password")) {
    console.log("Password not modified - skipping hash");
    return;
  }

  try {
    console.log("Hashing password...");
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Password hashed successfully");
  } catch (err) {
    console.error("Hashing error:", err);
    throw err; // IMPORTANT → prevents saving invalid data
  }
});

// ────────────────────────────────────────
// ✅ COMPARE PASSWORD (FOR LOGIN)
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ────────────────────────────────────────
// ✅ REMOVE PASSWORD FROM RESPONSE
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// ────────────────────────────────────────
module.exports = mongoose.model("User", userSchema);
