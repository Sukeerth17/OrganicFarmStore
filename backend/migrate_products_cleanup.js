const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function cleanup() {
  console.log('--- Products Cleanup / Unique Index Migration ---');
  const client = await pool.connect();

  try {
    // Check for duplicate groups
    const dupRes = await client.query(`
      SELECT name, COALESCE(unit, '') AS unit, COUNT(*) AS cnt
      FROM products
      GROUP BY name, COALESCE(unit, '')
      HAVING COUNT(*) > 1
      ORDER BY COUNT(*) DESC
      LIMIT 200
    `);

    if (dupRes.rows.length === 0) {
      console.log('No duplicate product groups found. Proceeding to ensure unique index exists.');
    } else {
      console.log(`Found ${dupRes.rows.length} duplicate product groups. Showing sample:`);
      dupRes.rows.forEach(r => console.log(`  • ${r.name} (${r.unit}) — ${r.cnt} rows`));
    }

    console.log('Starting cleanup transaction...');
    await client.query('BEGIN');

    // Delete duplicate rows keeping the lowest id for each (name, unit)
    await client.query(`
      DELETE FROM products a
      USING products b
      WHERE a.id > b.id
        AND a.name = b.name
        AND COALESCE(a.unit, '') = COALESCE(b.unit, '')
    `);

    console.log('Duplicate rows removed (if any). Creating unique index on (name, unit)...');

    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_products_name_unit_unique
      ON products (name, unit);
    `);

    await client.query('COMMIT');
    console.log('✅ Cleanup and unique index creation successful.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Cleanup failed, rolled back. Error:', err.message || err);
  } finally {
    client.release();
    await pool.end();
  }
}

cleanup();
