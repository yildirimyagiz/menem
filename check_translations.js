const en = require('./apps/client/src/messages/en.json');
const tr = require('./apps/client/src/messages/tr.json');

const enKeys = Object.keys(en);
const trKeys = Object.keys(tr);

const missingInTr = enKeys.filter(key => !trKeys.includes(key));
const missingInEn = trKeys.filter(key => !enKeys.includes(key));

console.log('📊 English keys:', enKeys.length);
console.log('📊 Turkish keys:', trKeys.length);
console.log('❌ Missing in Turkish:', missingInTr.length);
if(missingInTr.length > 0) {
    console.log('Missing keys:', missingInTr.slice(0, 10));
}
console.log('➕ Extra in Turkish:', missingInEn.length);
if(missingInEn.length > 0) {
    console.log('Extra keys:', missingInEn.slice(0, 10));
}

// Check for empty values
const emptyTrKeys = trKeys.filter(key => !tr[key] || tr[key] === '');
console.log('⚠️ Empty Turkish values:', emptyTrKeys.length);
if(emptyTrKeys.length > 0) {
    console.log('Empty keys:', emptyTrKeys.slice(0, 10));
} 