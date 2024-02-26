import { LoaderFunctionArgs } from "@remix-run/node";
import fs from "node:fs/promises";
import path from "path";

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.path) {
    return new Response("Not found", { status: 404 });
  }

  const filePath = path.join(
    process.env.NODE_ENV !== "development" ? process.cwd() : "",
    process.env.BASE_IMG_PATH!,
    "images",
    `${params.path}`
  );

  try {
    const pngBuffer = await fs.readFile(filePath);
    return new Response(pngBuffer, {
      headers: { "Content-Type": "image/gif" },
    });
  } catch (error) {
    console.error("couldnt find image", error);
  }
}
