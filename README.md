# iTunes Artwork Grabber

This is a simple artwork grabber which uses iTunes' servers to get the required info.

![[!Screenshot of the iTunes Artwork Grabber](https://i.imgur.com/bCtjAoz.png)](https://i.imgur.com/bCtjAoz.png)

## Special Thanks

I'd like to thank Ben Dodson for his great work at his own [iTunes Artwork Finder](https://bendodson.com/projects/itunes-artwork-finder). I used that project so many times and this project wouldn't be possible without him.

## About the project stack

This project uses [Astro](https://astro.build) with [React](https://react.dev) islands and [Tailwind CSS](https://tailwindcss.com), and is deployed on [Cloudflare Workers](https://workers.cloudflare.com).

## Scripts

- `bun run dev`: Start Astro development server
- `bun run build`: Build for Cloudflare Workers
- `bun run preview`: Build and run with Wrangler locally
- `bun run deploy`: Build and deploy with Wrangler
