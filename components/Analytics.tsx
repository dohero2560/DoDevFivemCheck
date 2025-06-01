'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Analytics() {
  const pathname = usePathname();
  const [pageSequence, setPageSequence] = useState(1);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    // Get user's IP address
    const getIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
      } catch (error) {
        console.error('Error fetching IP:', error);
        return 'unknown';
      }
    };

    // Collect analytics data
    const collectAnalytics = async () => {
      const ip = await getIP();
      const analyticsData = {
        timestamp: new Date().toISOString(),
        ip,
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        visitDuration: Math.floor((Date.now() - startTime) / 1000), // in seconds
        pagePath: pathname,
        pageSequence,
        referrer: document.referrer || 'direct',
        language: navigator.language || 'unknown'
      };

      // Send data to API
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(analyticsData),
        });
      } catch (error) {
        console.error('Error sending analytics:', error);
      }
    };

    // Collect data when component unmounts
    return () => {
      collectAnalytics();
    };
  }, [pathname, pageSequence, startTime]);

  // Update page sequence when pathname changes
  useEffect(() => {
    setPageSequence(prev => prev + 1);
  }, [pathname]);

  return null; // This component doesn't render anything
} 