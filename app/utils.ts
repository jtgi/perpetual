/* eslint-disable @typescript-eslint/no-explicit-any */
import { createCanvas, loadImage, CanvasRenderingContext2D } from "canvas";
import GifEncoder from "gifencoder";
import fs from "node:fs";
import path from "node:path";

type FrameResponseArgs = {
  title?: string;
  input?: string;
  aspectRatio?: string;
  description?: string;
  version?: string;
  image: string;
  buttons?: Array<{
    text: string;
    link?: string;
    isRedirect?: boolean;
  }>;
  postUrl?: string;
  cacheTtlSeconds?: number;
};

export function frameResponse(params: FrameResponseArgs) {
  const version = params.version || "vNext";
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        ${params.title ? `<title>${params.title}</title>` : ""}
        ${
          params.title
            ? `<meta property="og:title" content="${params.title}">`
            : ""
        }
        ${
          params.description
            ? `<meta property="description" content="${params.description}">
        <meta property="og:description" content="${params.description}">`
            : ""
        }
        ${`<meta property="fc:frame:image:aspect_ratio" content="${
          params.aspectRatio ?? "1.91:1"
        }">`}
        ${
          params.input
            ? `<meta property="fc:frame:input:text" content="${params.input}">`
            : ""
        }
        <meta property="fc:frame" content="${version}">
        <meta property="fc:frame:image" content="${params.image}">
        ${
          params.postUrl
            ? `<meta property="fc:frame:post_url" content="${params.postUrl}">`
            : ""
        }
        ${
          params.buttons
            ? params.buttons
                .map((b, index) => {
                  let out = `<meta property="fc:frame:button:${
                    index + 1
                  }" content="${b.text}">`;
                  if (b.link) {
                    out += `\n<meta property="fc:frame:button:${
                      index + 1
                    }:action" content="link">`;
                    out += `\n<meta property="fc:frame:button:${
                      index + 1
                    }:target" content="${b.link}">`;
                  } else if (b.isRedirect) {
                    out += `\n<meta property="fc:frame:button:${
                      index + 1
                    }:action" content="post_redirect">`;
                  }
                  return out;
                })
                .join("\n")
            : ""
        }
      </head>
      <body>
        <h1>${params.title}</h1>
        <p>${params.description}</p>
        <div>
        <img src="${params.image}" />
        </div>
        ${params.buttons
          ?.map(
            (b, index) => `<button name="button-${index}">${b.text}</button>`
          )
          .join("\n")}
      </body>
    </html>
    `;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": `no-store, max-age=${params.cacheTtlSeconds ?? 60 * 15}`,
    },
  });
}

export const drawClockGif = async (
  now: Date,
  watchFacePath: string,
  hourHandPath: string,
  minuteHandPath: string,
  secondHandPath: string
) => {
  // 3 frames, more will be too much $$
  const frames = [
    now,
    new Date(now.getTime() + 1000),
    new Date(now.getTime() + 2000),
  ];

  const watchFace = await loadImage(watchFacePath);

  const encoder = new GifEncoder(watchFace.width, watchFace.height);
  encoder.start();
  encoder.setRepeat(-1); //no loop pls
  encoder.setDelay(1000); // 1 frame per second
  encoder.setQuality(10); // [1, 20]

  const filename = `perpetual-${now.getSeconds()}-${now.getMinutes()}-${now.getHours()}.gif`;
  const dst = path.join(process.env.BASE_IMG_PATH!, "images", filename);

  encoder.createReadStream().pipe(fs.createWriteStream(dst));

  const canvas = createCanvas(watchFace.width, watchFace.height);
  const context = canvas.getContext("2d");

  for (const frame of frames) {
    context.drawImage(watchFace, 0, 0);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const secondsAngle = (frame.getSeconds() / 60) * (2 * Math.PI);
    const minutesAngle =
      (frame.getMinutes() / 60) * (2 * Math.PI) + secondsAngle / 60;
    const hoursAngle =
      ((frame.getHours() % 12) / 12) * (2 * Math.PI) + minutesAngle / 12;

    await drawHand(context, hourHandPath, hoursAngle, centerX, centerY, 0.25);
    await drawHand(
      context,
      minuteHandPath,
      minutesAngle,
      centerX,
      centerY,
      0.25
    );
    await drawHand(
      context,
      secondHandPath,
      secondsAngle,
      centerX,
      centerY,
      0.28
    );

    encoder.addFrame(context as any);
  }

  encoder.finish();
  return filename;
};

async function drawHand(
  context: CanvasRenderingContext2D,
  imagePath: string,
  angle: number,
  offsetX: number,
  offsetY: number,
  scaleX: number,
  scaleY?: number
) {
  const handImage = await loadImage(imagePath);
  context.save();
  context.translate(offsetX + 10, offsetY + 40);
  context.scale(scaleX, scaleY ?? scaleX);
  context.rotate(angle);
  context.drawImage(handImage, -handImage.width / 2, -handImage.height / 2);
  context.restore();
}
