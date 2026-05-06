const fs = require('fs');

const useStoreContent = fs.readFileSync('src/store/useStore.js', 'utf8');

// Find all supabase.from('...').select calls
const tableMatches = [...useStoreContent.matchAll(/supabase\.from\(['"]([^'"]+)['"]\)\.select/g)];
const fetchedTables = new Set(tableMatches.map(m => m[1]));

console.log("=== TABLES CURRENTLY FETCHED ===");
console.log(Array.from(fetchedTables).sort().join('\n'));
