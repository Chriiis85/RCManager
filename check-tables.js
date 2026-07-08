const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.qgxpnuesyxwbexavydnp:lmSs7ZORN8Z8P2Cu@aws-1-eu-west-1.pooler.supabase.com:6543/postgres' });
client.connect().then(() => {
  return client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
}).then(res => {
  console.log(res.rows);
  return client.end();
});
