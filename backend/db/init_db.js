// Simple DB initializer using pg and dotenv
// Usage: set DATABASE_URL in backend/.env or environment, then run `npm run db:init`

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const schemaPath = path.join(__dirname, 'schema.sql');
const seedPath = path.join(__dirname, 'seed.sql');

async function run() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('Missing DATABASE_URL in environment. Create a backend/.env with DATABASE_URL.');
    process.exit(1);
  }

  // Decide whether to use SSL. If the connection string points to localhost, disable SSL.
  const useSSL = connectionString && !/localhost|127\.0\.0\.1/.test(connectionString);

  const client = new Client({
    connectionString,
    ssl: useSSL ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('Connected to Postgres');

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('Running schema...');
    await client.query(schemaSql);
    console.log('Schema applied');

    if (fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      console.log('Running seed...');
      await client.query(seedSql);
      console.log('Seed applied');
    }

    console.log('Database initialization complete');
  } catch (err) {
    console.error('Error initializing database:', err.message || err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

run();
