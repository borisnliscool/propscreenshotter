# propscreenshotter

Script for FiveM that takes screenshots of ingame models, and them processes the images.

> **Warning** <br>
> This script uses [rembg](https://github.com/danielgatis/rembg) to process images.
> It will **NOT** work without. <br>
> It also only works on a local development server.

### Preview

https://github.com/borisnliscool/propscreenshotter/assets/60477582/ae856b9f-9aab-4f64-ab96-305f522fb6ae

### Requirements
- Typescript
- pnpm
- [screenshot-basic](https://github.com/citizenfx/screenshot-basic)
- [rembg](https://github.com/danielgatis/rembg) at port 5000

### Usage
- Make sure to have rembg running at port 5000 (I recommend using docker)
- Make sure screenshot-basic is running
- Navigate to `src/server` and run `pnpm install & pnpm start`
- Enter FiveM and run `screenmodel <model name>`
- Find the ouptut in `src/server/uploads`

### Support
Limited as I don't see many people actually using this, but you can try in my [discord](https://boris.foo/discord).
