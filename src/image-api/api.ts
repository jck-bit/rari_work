import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'anatomie-ai.czeoa28meb1m.us-east-1.rds.amazonaws.com',
  database: 'anatomie',
  password: 'anatomieai',
  port: 5432,
  ssl: {
    rejectUnauthorized: false, // for self-signed certificates
  },
});

export async function fetchImages(_req: VercelRequest, res: VercelResponse) {
  try {
    const result = await pool.query('SELECT * FROM image');
    res.status(200).json(result); // Ensure only rows are sent as response
    console.log(result.rows); // Log rows instead of the whole result
  } catch (err) {
    console.error('Error querying the database:', err);
    res.status(500).send('Server error');
  }
}
