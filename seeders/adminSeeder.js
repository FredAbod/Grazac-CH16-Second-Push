const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.models');
const connectDB = require('../config/db');
require('dotenv').config();

/**
 * Admin Seeder - Creates default admin user in the database
 * Run with: node seeders/adminSeeder.js
 */

const seedAdmin = async () => {
  try {
    console.log('🌱 Starting admin seeder...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    // Default admin credentials
    const adminData = {
      name: process.env.ADMIN_NAME || 'Admin Userz',
      email: process.env.ADMIN_EMAIL || 'admin@gmail.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      phoneNumber: process.env.ADMIN_PHONE || '08012345678',
      role: 'admin',
      isVerified: true, // Admin is pre-verified
      otp: null
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: adminData.email },
        { role: 'admin' }
      ]
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.name}`);
      console.log('   Skipping seeding...');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Create admin user
    const admin = new User({
      ...adminData,
      password: hashedPassword
    });

    await admin.save();

    console.log('🎉 Admin user created successfully!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('👤 Role:', adminData.role);
    console.log('');
    console.log('⚠️  IMPORTANT: Change the default password after first login!');
    
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    
    if (error.code === 11000) {
      console.log('💡 Duplicate key error - Admin might already exist');
    }
    
    process.exit(1);
  } finally {
    // Close database connection
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedAdmin();
}

module.exports = seedAdmin;