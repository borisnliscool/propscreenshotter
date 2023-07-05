# propscreenshotter

Script for FiveM that takes screenshots of ingame models, and them processes the images.

> **Warning** <br>
> This script uses [rembg](https://github.com/danielgatis/rembg) to process images.
> It will **NOT** work without. <br>
> It also only works on a local development server.

### Requirements
- Typescript
- pnpm
- [rembg](https://github.com/danielgatis/rembg) at port 5000

### Usage
- Make sure to have rembg running at port 5000
- Navigate to `src/server` and run `pnpm install & pnpm start`
- Enter FiveM and run `screenmodel <model name>`
- Find the ouptut in `src/server/uploads`
