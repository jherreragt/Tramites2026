import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Reconstruct the Supabase URL
  const supabaseUrl = new URL(`https://sthucsfyzcpgaqmcwczy.supabase.co${path}${url.search}`);
  
  // Define headers to proxy
  const headers = new Headers(request.headers);
  headers.set('apikey', 'sb_publishable_dP3E1mg0j-wlSwiUre7lyw_PhRiHzED');
  headers.set('Authorization', 'Bearer sb_publishable_dP3E1mg0j-wlSwiUre7lyw_PhRiHzED');

  // Forward the request
  const proxyRequest = new Request(supabaseUrl.toString(), {
    method: request.method,
    headers: headers,
    body: request.body,
    redirect: 'manual'
  });

  return fetch(proxyRequest);
};
