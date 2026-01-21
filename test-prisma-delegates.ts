import { prisma } from "./lib/prisma";

async function test() {
  console.log("Prisma delegates:", Object.keys(prisma).filter(k => !k.startsWith('$')));
  console.log("All keys count:", Object.keys(prisma).length);
  console.log("All keys:", Object.keys(prisma));

  if ("emailFolder" in prisma) {
    console.log("emailFolder exists ✅");
    console.log("emailFolder type:", typeof prisma.emailFolder);
  } else {
    console.log("emailFolder exists ❌");
  }
  
  // Try to access it directly
  try {
    const folders = await prisma.emailFolder.findMany({ take: 1 });
    console.log("Direct access works ✅, found", folders.length, "folders");
  } catch (error: any) {
    console.log("Direct access failed ❌:", error.message);
  }
  
  // Check the actual instance
  const instance = (prisma as any).__internal?.instance || prisma;
  console.log("Instance delegates:", Object.keys(instance).filter(k => !k.startsWith('$')));
}

test().catch(console.error);
