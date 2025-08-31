// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getCurrentUser } from "@/lib/auth";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const user = await getCurrentUser(req);
//   if (!user)
//     return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

//   const targetUser = await prisma.influencer.findUnique({
//     where: { id: params.id },
//   });

//   return NextResponse.json(targetUser);
// }

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const user = await getCurrentUser(req);
//   if (!user || user.role !== "ADMIN")
//     return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

//   const data = await req.json();
//   const updatedUser = await prisma.influencer.update({
//     where: { id: params.id },
//     data,
//   });

//   return NextResponse.json(updatedUser);
// }

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const user = await getCurrentUser(req);
//   if (!user || user.role !== "ADMIN")
//     return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

//   try {
//     await prisma.influencer.delete({
//       where: { id: params.id },
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       {
//         error: "Delete failed",
//       },
//       { status: 400 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RouteContext = {
  params: { id: string };
};

export async function GET(
  req: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { id } = context.params;
  const user = await getCurrentUser(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const targetUser = await prisma.influencer.findUnique({
    where: { id },
  });

  return NextResponse.json(targetUser);
}

export async function PUT(
  req: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { id } = context.params;
  const user = await getCurrentUser(req);
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const data = await req.json();
  const updatedUser = await prisma.influencer.update({
    where: { id },
    data,
  });

  return NextResponse.json(updatedUser);
}

export async function DELETE(
  req: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { id } = context.params;
  const user = await getCurrentUser(req);
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    await prisma.influencer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
