const mongoose = require('mongoose');
const User = require('../models/User');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/apk_grocery_db');
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);

    // Auto-ensure Super Admin account (kumar@gmail.com / Kj1110;l)
    try {
      let adminUser = await User.findOne({ email: 'kumar@gmail.com' }).select('+password');

      if (!adminUser) {
        console.log('🌱 Creating default Super Admin account (kumar@gmail.com)...');
        await User.create({
          name: 'GrocMart Admin',
          email: 'kumar@gmail.com',
          password: 'Kj1110;l',
          phone: '+91 9876543210',
          role: 'ADMIN',
          isApproved: true,
          isActive: true
        });
        console.log('✓ Super Admin account created: kumar@gmail.com / Kj1110;l');
      } else {
        // Ensure password matches Kj1110;l and role is ADMIN
        const isPasswordCorrect = await adminUser.matchPassword('Kj1110;l');
        if (!isPasswordCorrect || adminUser.role !== 'ADMIN' || !adminUser.isActive) {
          console.log('🔄 Syncing Super Admin credentials for kumar@gmail.com...');
          adminUser.password = 'Kj1110;l';
          adminUser.role = 'ADMIN';
          adminUser.isActive = true;
          adminUser.isApproved = true;
          await adminUser.save();
          console.log('✓ Super Admin password synchronized: kumar@gmail.com / Kj1110;l');
        } else {
          console.log('✓ Super Admin account verified: kumar@gmail.com');
        }
      }

      // Also ensure backup admin account
      const backupAdmin = await User.findOne({ email: 'admin@apkgrocery.demo' });
      if (!backupAdmin) {
        await User.create({
          name: 'APK Admin',
          email: 'admin@apkgrocery.demo',
          password: 'Admin@123',
          phone: '+91 9876543200',
          role: 'ADMIN',
          isApproved: true,
          isActive: true
        });
      }
    } catch (seedErr) {
      console.error('⚠️ Auto-seed admin warning:', seedErr.message);
    }
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;


