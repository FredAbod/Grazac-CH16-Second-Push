# Database Seeders

This directory contains database seeding scripts to populate your application with initial data.

## Available Seeders

### Admin Seeder (`adminSeeder.js`)
Creates a default admin user in the database with the following features:
- Pre-verified email status
- Admin role privileges
- Configurable via environment variables
- Checks for existing admin to prevent duplicates

## Setup

1. **Configure Environment Variables**
   
   Add these to your `.env` file:
   ```env
   ADMIN_NAME=Super Admin
   ADMIN_EMAIL=admin@gmail.com
   ADMIN_PASSWORD=SecureAdmin@2024
   ADMIN_PHONE=08012345678
   ```

2. **Password Requirements**
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character (@$!%*?&)

3. **Email Requirements**
   - Must be gmail.com or yopmail.com domain
   - Will be automatically set to lowercase

## Usage

### Run All Seeders
```bash
npm run seed
# OR
node seeders/index.js
```

### Run Individual Seeders
```bash
# Admin seeder only
npm run seed:admin
# OR
node seeders/adminSeeder.js
```

### Get Help
```bash
node seeders/index.js --help
```

## Output Example

```
🌱 Starting admin seeder...
✅ Database connected
🎉 Admin user created successfully!
📧 Email: admin@gmail.com
🔑 Password: SecureAdmin@2024
👤 Role: admin

⚠️  IMPORTANT: Change the default password after first login!
🔌 Database connection closed
```

## Security Notes

- **Change default credentials immediately** after first use
- Use strong, unique passwords in production
- Consider using environment-specific admin accounts
- Store sensitive credentials securely (not in version control)

## Troubleshooting

### Duplicate Key Error
If you see a duplicate key error, an admin user already exists. The seeder will skip creation and show existing admin details.

### Validation Errors
Ensure your environment variables meet the schema requirements:
- Email domain must be gmail.com or yopmail.com
- Phone number must be exactly 11 digits
- Password must meet complexity requirements

### Connection Errors
Verify your MongoDB connection string and ensure the database is running.