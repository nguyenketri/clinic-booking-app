const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
console.log('Attempting to connect to:', uri);

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Connection successful!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Connection failed:');
    console.error(err);
    process.exit(1);
  });
