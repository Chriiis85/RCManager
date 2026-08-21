const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.qgxpnuesyxwbexavydnp:lmSs7ZORN8Z8P2Cu@aws-1-eu-west-1.pooler.supabase.com:6543/postgres' });
client.connect().then(() => {
  return client.query("GRANT ALL ON public.friends TO anon, authenticated;");
}).then(() => {
  console.log('Granted ALL on public.friends to anon, authenticated');
  return client.end();
}).catch(console.error);
