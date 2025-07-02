import supabase from './Database.js';

const testConnection = async () => {
    const { data, error } = await supabase.from('Users').select('*');
    console.log(data);
};

testConnection();
