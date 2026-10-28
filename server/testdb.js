const { MongoClient } = require('mongodb');

const passwords = ['Sayam123'];

async function test(pwd) {
  const uri = `mongodb+srv://samengpatil12_db_user:${pwd}@kisan.5mhxmmb.mongodb.net/kisanmitra`;
  console.log('Testing URI:', uri.replace(pwd, '***'));
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('✅ SUCCESS! Connected to MongoDB Atlas');
    await client.close();
    return true;
  } catch (e) {
    console.log('❌ FAILED:', e.message);
    return false;
  }
}

(async () => {
  for (const p of passwords) {
    const ok = await test(p);
    if (ok) break;
  }
  process.exit(0);
})();
