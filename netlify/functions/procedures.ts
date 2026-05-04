import { Handler } from '@netlify/functions';
import { supabase } from './lib/supabase';

const handler: Handler = async (event) => {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  const id = event.queryStringParameters?.id;

  try {
    if (id) {
      // Get single procedure
      const { data, error } = await supabase
        .from('procedures')
        .select('*, institutions(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return { statusCode: 404, headers, body: JSON.stringify({ error: 'Procedure not found' }) };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };
    } else {
      // List all procedures
      const { data, error } = await supabase
        .from('procedures')
        .select('*, institutions(name, full_name)')
        .order('name');

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };
    }
  } catch (error: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

export { handler };
