import prisma from './prisma/client';

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testConnection();