require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskearn');
  const db = mongoose.connection.db;
  const users = db.collection('users');

  const existing = await users.findOne({ email: 'azamukwokusilas2@gmail.com' });
  if (existing) {
    console.log('Admin user already exists');
  } else {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash('Alexzzy@11', salt);
    await users.insertOne({
      name: 'Alexzzy',
      username: 'admin',
      email: 'azamukwokusilas2@gmail.com',
      password: hash,
      role: 'admin',
      accountStatus: 'active',
      walletBalance: 0,
      referralCode: 'admin',
      tasksCompleted: 0,
      todayTasksCompleted: 0,
      totalEarnings: 0,
      referralEarnings: 0,
      referralCount: 0,
      isVerified: true,
      createdAt: new Date()
    });
    console.log('Admin user created!');
  }

  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
