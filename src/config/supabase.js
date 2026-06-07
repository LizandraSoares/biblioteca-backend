require('dotenv').config({
  path: require('path').resolve(__dirname, '../../.env')
});

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('As variáveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY precisam estar definidas.');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

module.exports = { supabase };
