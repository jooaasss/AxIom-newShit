import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let databaseStatus = 'disconnected';
    let appStatus = 'healthy';
    
    if (prisma) {
      try {
        // Check database connection
        await prisma.$queryRaw`SELECT 1`;
        databaseStatus = 'connected';
      } catch (dbError) {
        console.error('Database connection failed:', dbError);
        appStatus = 'degraded';
      }
    } else {
      console.warn('Prisma client not available');
      appStatus = 'degraded';
    }
    
    return NextResponse.json({
      status: appStatus,
      timestamp: new Date().toISOString(),
      database: databaseStatus,
      service: 'axiom-app'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        service: 'axiom-app',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}