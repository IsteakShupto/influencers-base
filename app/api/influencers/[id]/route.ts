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

interface Params {
  params: { id: string };
}

export async function GET(req: NextRequest, context: Params) {
  const { id } = context.params;
  const user = await getCurrentUser(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const targetUser = await prisma.influencer.findUnique({
    where: { id: id },
  });

  return NextResponse.json(targetUser);
}

export async function PUT(req: NextRequest, context: Params) {
  const { id } = context.params;
  const user = await getCurrentUser(req);
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const data = await req.json();
  const updatedUser = await prisma.influencer.update({
    where: { id: id },
    data,
  });

  return NextResponse.json(updatedUser);
}

export async function DELETE(req: NextRequest, context: Params) {
  const { id } = context.params;
  const user = await getCurrentUser(req);
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    await prisma.influencer.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Delete failed",
      },
      { status: 400 }
    );
  }
}
