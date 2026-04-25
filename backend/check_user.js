import prisma from "./src/config/database.js";

const checkUsers = async () => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, avatar: true }
  });
  console.log(users);
};

checkUsers();
