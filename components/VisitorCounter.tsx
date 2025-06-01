'use client';

import { useEffect, useState } from 'react';

export default function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    // Get the current count from localStorage
    const storedCount = localStorage.getItem('visitorCount');
    const count = storedCount ? parseInt(storedCount) : 0;
    
    // Increment the count
    const newCount = count + 1;
    
    // Update localStorage
    localStorage.setItem('visitorCount', newCount.toString());
    
    // Update state
    setVisitorCount(newCount);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg shadow-lg">
      <p className="text-sm font-medium">
        ผู้เข้าชม: <span className="font-bold">{visitorCount}</span>
      </p>
    </div>
  );
}       