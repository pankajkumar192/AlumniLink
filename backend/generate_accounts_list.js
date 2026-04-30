import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log("Fetching all accounts...");
  
  const users = await prisma.user.findMany({
    select: {
      name: true,
      email: true,
      role: true
    },
    orderBy: {
      role: 'asc'
    }
  });

  let fileContent = "# AlumniLink User Accounts\n\n";
  fileContent += "| Name | Email | Role | Password |\n";
  fileContent += "| :--- | :--- | :--- | :--- |\n";

  users.forEach(user => {
    let password = "password123"; // Default for all seeded users
    if (user.email === "pk919284@gmail.com") {
      password = "10121996pA@";
    }
    
    fileContent += `| ${user.name} | ${user.email} | ${user.role} | ${password} |\n`;
  });

  fs.writeFileSync('all_accounts.md', fileContent);
  console.log("File 'all_accounts.md' has been generated successfully.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
