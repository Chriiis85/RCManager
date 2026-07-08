const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.qgxpnuesyxwbexavydnp:lmSs7ZORN8Z8P2Cu@aws-1-eu-west-1.pooler.supabase.com:6543/postgres' });
client.connect().then(() => {
  return client.query("ALTER TABLE public.friends ADD COLUMN user_username text, ADD COLUMN friend_username text;");
}).then(() => {
  console.log('Columns added successfully');
  return client.end();
}).catch(console.error);
