import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { drawClock, drawClockGif, frameResponse } from "./utils";
import fs from "fs/promises";
import path from "node:path";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export async function loader() {
  const baseUrl = process.env.HOST_URL!;

  const now = new Date();
  let filename = `perpetual-${now.getSeconds()}-${now.getMinutes()}-${now.getHours()}.png`;
  try {
    // create /data/images if doesn't exist

    await fs.access(
      path.join(
        process.env.NODE_ENV !== "development" ? process.cwd() : "",
        "images",
        filename
      )
    );
  } catch (error) {
    const now = new Date();

    // filename = await drawClock(
    //   now,
    //   baseUrl + "/fc-perpetual.png",
    //   baseUrl + "/hour-silver.png",
    //   baseUrl + "/minute-silver.png",
    //   baseUrl + "/second-silver.png"
    // );

    filename = await drawClockGif(
      now,
      baseUrl + "/fc-perpetual.png",
      baseUrl + "/hour-silver.png",
      baseUrl + "/minute-silver.png",
      baseUrl + "/second-silver.png"
    );
  }

  return frameResponse({
    title: "title",
    description: "description",
    aspectRatio: "1:1",
    cacheTtlSeconds: 60,
    image: `${baseUrl}/images/${filename}`,
    buttons: [
      {
        text: "Mint",
        link: "https://highlight.xyz/mint/65dbd7f2beb31448a261d2a0",
      },
    ],
  });
}
