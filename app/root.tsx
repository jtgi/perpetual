import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { drawClock, frameResponse } from "./utils";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export async function loader() {
  const baseUrl = process.env.HOST_URL!;

  const dst = await drawClock(
    baseUrl + "/fc-perpetual.png",
    baseUrl + "/hour-silver.png",
    baseUrl + "/minute-silver.png",
    baseUrl + "/second-silver.png"
  );

  return frameResponse({
    title: "title",
    description: "description",
    aspectRatio: "1:1",
    cacheTtlSeconds: 30,
    image: `${baseUrl}/${dst.replace("public/", "")}`,
    buttons: [
      {
        text: "Mint",
        link: "https://highlight.xyz/mint/65daea3e14d1e1cf26028d54",
      },
    ],
  });
}
