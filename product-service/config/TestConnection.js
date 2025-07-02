import supabase from './Database.js';

const testConnection = async () => {
    const { data, error } = await supabase.from('category').select('*');
    console.log(data);
};

testConnection();
    