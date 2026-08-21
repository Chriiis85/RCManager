const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.qgxpnuesyxwbexavydnp:lmSs7ZORN8Z8P2Cu@aws-1-eu-west-1.pooler.supabase.com:6543/postgres' });
client.connect().then(() => {
  return client.query("GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;");
}).then(() => {
  console.log('Granted USAGE on sequences to anon, authenticated');
  return client.end();
}).catch(console.error);
