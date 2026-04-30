import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = "pk919284@gmail.com";
  const newPassword = "10121996pA@";
  
  console.log(`Resetting password for ${email}...`);
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  const user = await prisma.user.update({
    where: { email: email },
    data: { password: hashedPassword }
  });
  
  console.log(`Successfully updated password for ${user.name} (${user.email})`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
