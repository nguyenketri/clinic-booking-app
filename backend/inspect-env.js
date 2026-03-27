require('dotenv').config();
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.log('❌ MONGODB_URI is not defined in process.env');
  process.exit(1);
}
console.log('URI Length:', uri.length);
for (let i = 0; i < uri.length; i++) {
  console.log(`Char at ${i}: '${uri[i]}' (code: ${uri.charCodeAt(i)})`);
}
