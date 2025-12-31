const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    console.log('--- Starting Database Migration ---');
    try {
        // This command adds the missing columns to your existing orders table
        await pool.query(`
            ALTER TABLE orders 
            ADD COLUMN IF NOT EXISTS delivery_name VARCHAR(255),
            ADD COLUMN IF NOT EXISTS delivery_phone VARCHAR(10),
            ADD COLUMN IF NOT EXISTS address_line1 VARCHAR(500),
            ADD COLUMN IF NOT EXISTS address_line2 VARCHAR(500),
            ADD COLUMN IF NOT EXISTS city VARCHAR(100),
            ADD COLUMN IF NOT EXISTS state VARCHAR(100),
            ADD COLUMN IF NOT EXISTS pincode VARCHAR(6);
        `);
        console.log('✅ Migration successful: Address columns added to orders table.');
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        await pool.end();
    }
}

migrate();