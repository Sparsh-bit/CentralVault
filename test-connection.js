// Supabase Connection Test
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n=== SUPABASE CONNECTION TEST ===\n');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'MISSING');

if (!supabaseUrl || !supabaseKey) {
    console.error('\n❌ ERROR: Missing environment variables in .env.local');
    console.log('\nYour .env.local should contain:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=https://yowdbcrajdlcapundjqt.supabase.co');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_1ITmTIruL-2XQWKa2RVQuw_hfSqzB4-');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        console.log('\n📡 Testing connection...');
        const { data, error } = await supabase.from('resources').select('id').limit(1);

        if (error) {
            console.error('\n❌ CONNECTION FAILED');
            console.error('Error Code:', error.code);
            console.error('Error Message:', error.message);
            console.error('\n🔧 FIX: You need to create the "resources" table in Supabase.');
            console.error('Go to: https://supabase.com/dashboard/project/yowdbcrajdlcapundjqt/sql/new');
            console.error('And run the SQL from: d:\\Central Notes\\supabase\\migrations\\20260112000001_professional_fix.sql');
        } else {
            console.log('\n✅ CONNECTION SUCCESSFUL!');
            console.log('Table exists and is accessible.');
        }
    } catch (err) {
        console.error('\n❌ CRITICAL ERROR:', err.message);
    }
}

testConnection();
