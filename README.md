# Farcaster Perpetual

![Farcaster Perpetual](https://highlight-creator-assets.highlight.xyz/main/image/020701a5-7afa-4607-a2c7-16c89c63f332.png)

Summary:

- Create 4 images, one for the bg, one for second, minute, hour hands
- Align them all, make sure they're same size.
- Do some pi math to find how much to rotate them to current time.
- Generate the image n times and encode it into a gif.
- Save it and serve it.

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`
