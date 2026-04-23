import { prisma } from "../db/prisma";

type ClerkUserData = {
  id: string;
  email_addresses: Array<{ email_address: string }>;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
};

export async function syncUserFromClerk(clerkUser: ClerkUserData) {
  const email = clerkUser.email_addresses[0]?.email_address ?? "";

  return prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email,
      firstName: clerkUser.first_name,
      lastName: clerkUser.last_name,
      imageUrl: clerkUser.image_url,
    },
    create: {
      clerkId: clerkUser.id,
      email,
      firstName: clerkUser.first_name,
      lastName: clerkUser.last_name,
      imageUrl: clerkUser.image_url,
    },
  });
}

export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({ where: { clerkId } });
}

export async function deleteUserByClerkId(clerkId: string) {
  return prisma.user.delete({ where: { clerkId } });
}
