import prisma from "./src/config/database.js";

const deleteUser = async () => {
  const email = "harshitpubgkorean2@gmail.com";

  // Delete dependent records first (cascade should handle it, but let's be safe)
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log("❌ User not found:", email);
    await prisma.$disconnect();
    return;
  }

  await prisma.user.delete({ where: { email } });
  console.log(`✅ Deleted user: ${user.name} (${email}) [ID: ${user.id}]`);
  await prisma.$disconnect();
};

deleteUser().catch(e => {
  console.error("Error:", e.message);
  prisma.$disconnect();
});
