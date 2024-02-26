import { drawClockGif, frameResponse } from "./utils";
import fs from "fs/promises";
import path from "node:path";

export async function loader() {
  const baseUrl = process.env.HOST_URL!;

  const now = new Date();
  let filename = `perpetual-${now.getSeconds()}-${now.getMinutes()}-${now.getHours()}.png`;
  try {
    // 1/46300 chance, we cached?
    await fs.access(
      path.join(
        process.env.NODE_ENV !== "development" ? process.cwd() : "",
        "images",
        filename
      )
    );
  } catch (e) {
    const now = new Date();

    filename = await drawClockGif(
      now,
      baseUrl + "/fc-perpetual.png",
      baseUrl + "/hour-silver.png",
      baseUrl + "/minute-silver.png",
      baseUrl + "/second-silver.png"
    );
  }

  return frameResponse({
    title: "Farcaster Perpetual",
    description: "A momentous achievement in onframe timekeeping.",
    aspectRatio: "1:1",
    cacheTtlSeconds: 60, // lol (gifs = $$)
    image: `${baseUrl}/images/${filename}`,
    buttons: [
      {
        text: "Mint",
        link: "https://highlight.xyz/mint/65dbd7f2beb31448a261d2a0",
      },
    ],
  });
}
