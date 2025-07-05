import supabase from './Database.js';

const testConnection = async () => {
    const { data, error } = await supabase.from('Order').select('*');
    console.log(data);
};

testConnection();
    