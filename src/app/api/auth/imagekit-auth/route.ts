import { NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

export async function GET() {
  try {
    const authParameters = imagekit.getAuthenticationParameters();

    return NextResponse.json({
      ...authParameters,
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!, // ✅ Add this line
    });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Failed to generate auth parameters" }, { status: 500 });
  }
}
