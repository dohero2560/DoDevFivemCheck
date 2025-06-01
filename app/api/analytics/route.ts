import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

interface AnalyticsData {
  timestamp: string;
  ip: string;
  userAgent: string;
  screenResolution: string;
  visitDuration: number;
  pagePath: string;
  pageSequence: number;
  referrer: string;
  language: string;
}

export async function POST(request: Request) {
  try {
    const data: AnalyticsData = await request.json();
    
    // Create analytics directory if it doesn't exist
    const analyticsDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(analyticsDir)) {
      fs.mkdirSync(analyticsDir, { recursive: true });
    }

    // Get current date for filename
    const date = new Date();
    const filename = `analytics_${date.toISOString().split('T')[0]}.json`;
    const filePath = path.join(analyticsDir, filename);

    // Read existing data or create new array
    let analytics: AnalyticsData[] = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      analytics = JSON.parse(fileContent);
    }

    // Add new data
    analytics.push(data);

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(analytics, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving analytics:', error);
    return NextResponse.json({ error: 'Failed to save analytics data' }, { status: 500 });
  }
} 