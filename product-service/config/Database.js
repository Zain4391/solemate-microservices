import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
    console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY);
    throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;