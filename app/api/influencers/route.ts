import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Prisma, Platform } from "@prisma/client";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const search = searchParams.get("search") || "";
  const platform = searchParams.get("platform");
  const country = searchParams.get("country");
  const minFollowers = parseInt(searchParams.get("minFollowers") || "0");
  const maxFollowers = parseInt(searchParams.get("maxFollowers") || "5000000");

  const sortBy = searchParams.get("sortBy") || "followers";
  const order = (searchParams.get("order") || "desc") as "asc" | "desc";

  try {
    const where: Prisma.InfluencerWhereInput = {
      followers: { gte: minFollowers, lte: maxFollowers },
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (platform) {
      where.platform = platform as Platform;
    }

    if (country) {
      where.country = country;
    }

    const [influencers, total] = await Promise.all([
      prisma.influencer.findMany({
        skip,
        take: limit,
        where,
        orderBy: { [sortBy]: order },
      }),
      prisma.influencer.count({ where }),
    ]);

    return NextResponse.json({
      data: influencers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch influencers" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const currentUser = await getCurrentUser(req);
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data = await req.json();

  try {
    const newInfluencer = await prisma.influencer.create({
      data,
    });

    return NextResponse.json(newInfluencer, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "User creation failed" },
      { status: 400 }
    );
  }
}
