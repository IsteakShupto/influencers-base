import { NextResponse } from "next/server";
import { Role, Platform } from "@prisma/client";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const influencersCount = await prisma.influencer.count();

    if (influencersCount >= 2000) {
      return NextResponse.json({ message: "Seed Completed successfully!" });
    }

    await prisma.influencer.deleteMany();
    await prisma.user.deleteMany();

    const adminUser = await prisma.user.findFirst({
      where: {
        role: "ADMIN",
      },
    });

    const users = [
      {
        email: "admin@example.com",
        password_hash: await bcrypt.hash("Admin123!", 10),
        role: Role.ADMIN,
      },
      {
        email: "viewer@example.com",
        password_hash: await bcrypt.hash("Viewer123!", 10),
        role: Role.VIEWER,
      },
    ];
    await prisma.user.createMany({ data: users });

    const platforms = [
      Platform.INSTAGRAM,
      Platform.TIKTOK,
      Platform.YOUTUBE,
      Platform.X,
    ];
    const countries = ["US", "GB", "IN", "CA", "AU", "BR", "DE", "FR"];
    const categories = [
      "fashion",
      "tech",
      "gaming",
      "food",
      "travel",
      "fitness",
      "beauty",
      "music",
    ];

    const influencersData = Array.from({ length: 2000 }).map(() => ({
      name: faker.person.fullName(),
      platform: faker.helpers.arrayElement(platforms),
      username: faker.internet.username().toLowerCase(),
      followers: faker.number.int({ min: 1000, max: 5_000_000 }),
      engagement_rate: parseFloat(
        faker.number.float({ min: 0.5, max: 20, fractionDigits: 2 }).toFixed(2)
      ),
      country: faker.helpers.arrayElement(countries),
      categories: faker.helpers.arrayElements(categories, { min: 1, max: 3 }),
      email: faker.internet.email(),
      createdById: adminUser?.id ?? null,
      created_at: faker.date.past({ years: 2 }),
      updated_at: new Date(),
    }));

    await prisma.influencer.createMany({
      data: influencersData,
      skipDuplicates: true,
    });

    return NextResponse.json({ message: "Seed Completed successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
