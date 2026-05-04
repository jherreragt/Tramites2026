import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const initGA = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('google_analytics_id')
          .eq('id', 1)
          .single();

        if (error || !data?.google_analytics_id) return;

        const gaId = data.google_analytics_id;

        // Load gtag.js
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(...args: any[]) {
          (window as any).dataLayer.push(args);
        }
        (window as any).gtag = gtag;
        gtag('js', new Date());
        gtag('config', gaId);

        console.log('Google Analytics initialized with ID:', gaId);
      } catch (err) {
        console.error('Error initializing GA:', err);
      }
    };

    initGA();
  }, []);

  useEffect(() => {
    // Send pageview on route change
    if ((window as any).gtag) {
      const initGA = async () => {
        const { data } = await supabase
          .from('site_settings')
          .select('google_analytics_id')
          .eq('id', 1)
          .single();
        
        if (data?.google_analytics_id) {
          (window as any).gtag('config', data.google_analytics_id, {
            page_path: location.pathname + location.search,
          });
        }
      };
      initGA();
    }
  }, [location]);

  return null;
}
