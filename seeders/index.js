const mongoose = require('mongoose');
const adminSeeder = require('./adminSeeder');
require('dotenv').config();

/**
 * Main Database Seeder
 * Run with: node seeders/index.js
 * Or: npm run seed
 */

const runSeeders = async () => {
  try {
    console.log('🚀 Starting database seeding process...\n');

    // Run individual seeders
    await adminSeeder();

    console.log('\n🎉 All seeders completed successfully!');
    console.log('📊 Database has been populated with initial data');
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

// Command line arguments handling
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
📖 Database Seeder Help

Usage:
  node seeders/index.js              - Run all seeders
  node seeders/adminSeeder.js        - Run only admin seeder
  npm run seed                       - Run all seeders
  npm run seed:admin                 - Run only admin seeder

Environment Variables:
  ADMIN_NAME      - Admin user's name
  ADMIN_EMAIL     - Admin user's email (must be gmail.com or yopmail.com)
  ADMIN_PASSWORD  - Admin user's password (min 8 chars, mixed case, numbers, symbols)
  ADMIN_PHONE     - Admin user's phone (exactly 11 digits)

Example .env setup:
  ADMIN_NAME=Super Admin
  ADMIN_EMAIL=admin@gmail.com  
  ADMIN_PASSWORD=SecureAdmin@2024
  ADMIN_PHONE=08012345678
  `);
  process.exit(0);
}

// Run seeders if this file is executed directly
if (require.main === module) {
  runSeeders();
}

module.exports = runSeeders;