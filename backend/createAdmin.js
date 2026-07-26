require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/user");

// ─────────────────────────────────────────
// Reads credentials from .env — nothing is hardcoded here.
// Set ADMIN_USERNAME, ADMIN_PASSWORD, RECOVERY_PIN in your .env
// (locally) or in Railway → Variables (production) before running this.
// ─────────────────────────────────────────
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const RECOVERY_PIN = process.env.RECOVERY_PIN;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !RECOVERY_PIN) {
  console.error(
    "❌ Missing ADMIN_USERNAME, ADMIN_PASSWORD, or RECOVERY_PIN in .env — aborting."
  );
  process.exit(1);
}

if (ADMIN_PASSWORD.length < 8) {
  console.error("❌ ADMIN_PASSWORD must be at least 8 characters — aborting.");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)

  .then(async () => {
    console.log("DB Connected");

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const hashedRecoveryPin = await bcrypt.hash(RECOVERY_PIN, 10);

    // Delete old admins/users
    await User.deleteMany({});

    // Create admin user with recovery PIN
    await User.create({
      username: ADMIN_USERNAME,
      password: hashedPassword,
      recoveryPin: hashedRecoveryPin,
      role: "admin",
    });

    console.log("✅ Admin created successfully");
    console.log(`   Username: ${ADMIN_USERNAME}`);
    console.log("   Password and recovery PIN were read from .env — not printed here.");
    console.log("   Share them with the cafe owner through a private, secure channel only.");

    process.exit();
  })

  .catch((err) => console.log(err));
