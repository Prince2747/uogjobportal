import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function countUsers() {
  try {
    const userCount = await prisma.user.count();
    console.log(`Total number of users in the database: ${userCount}`);
    
    // Count users by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    });
    
    console.log('\nUsers by role:');
    usersByRole.forEach(({ role, _count }) => {
      console.log(`${role}: ${_count.role}`);
    });
  } catch (error) {
    console.error('Error counting users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

countUsers(); 

const prisma = new PrismaClient();

async function countUsers() {
  try {
    const userCount = await prisma.user.count();
    console.log(`Total number of users in the database: ${userCount}`);
    
    // Count users by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    });
    
    console.log('\nUsers by role:');
    usersByRole.forEach(({ role, _count }) => {
      console.log(`${role}: ${_count.role}`);
    });
  } catch (error) {
    console.error('Error counting users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

countUsers(); 