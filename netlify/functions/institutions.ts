import { Handler } from '@netlify/functions';
import { supabase } from './lib/supabase';

const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  try {
    const { data, error } = await supabase
      .from('institutions')
      .select('*')
      .order('name');

    if (error) throw error;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

export { handler };
