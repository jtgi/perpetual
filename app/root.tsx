import { drawClockGif, frameResponse } from "./utils";

export async function loader() {
  const baseUrl = process.env.HOST_URL!;
  const now = new Date();

  const filename = await drawClockGif(
    now,
    baseUrl + "/fc-perpetual.png",
    baseUrl + "/hour-silver.png",
    baseUrl + "/minute-silver.png",
    baseUrl + "/second-silver.png"
  );

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
