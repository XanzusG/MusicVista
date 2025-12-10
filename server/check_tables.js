const { Pool } = require('pg');

const pool = new Pool({
  host: 'db.fwxgwomgrppfdwvnjcpe.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '6okVb5Vrk7Lmu2cg',
  ssl: { rejectUnauthorized: false }
});

async function checkTables() {
  try {
    console.log('Checking database tables...');
    
    // Get all tables
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\n=== Tables in database ===');
    for (const row of tables.rows) {
      console.log(`- ${row.table_name}`);
    }
    
    // Get columns for each table
    console.log('\n=== Table structures ===');
    for (const row of tables.rows) {
      const columns = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [row.table_name]);
      
      console.log(`\n${row.table_name}:`);
      for (const col of columns.rows) {
        console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
      }
    }
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

checkTables();
