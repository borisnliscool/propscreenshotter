import sharp from "sharp";
import fs from "fs";

interface Coordinates {
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
}

async function calculateContentCoordinates(
	image: sharp.Sharp
): Promise<Coordinates | null> {
	const metadata = await image.metadata();
	const { width, height } = metadata;
	if (!width || !height) return null;

	const coordinates: Coordinates = {
		minX: width,
		minY: height,
		maxX: 0,
		maxY: 0,
	};

	const pixels = await image.raw().toBuffer();
	const channelLength = width * height * 4; // Assuming RGBA format

	for (let i = 0; i < channelLength; i += 4) {
		const alpha = pixels[i + 3];
		if (alpha !== 0) {
			const x = (i / 4) % width;
			const y = Math.floor(i / 4 / width);

			if (x < coordinates.minX) {
				coordinates.minX = x;
			}
			if (x > coordinates.maxX) {
				coordinates.maxX = x;
			}
			if (y < coordinates.minY) {
				coordinates.minY = y;
			}
			if (y > coordinates.maxY) {
				coordinates.maxY = y;
			}
		}
	}

	return coordinates;
}

export async function optimizeImage(inputPath: string): Promise<boolean> {
	const image = sharp(inputPath);

	const coordinates = await calculateContentCoordinates(image);
	if (!coordinates) return false;

	const { minX, minY, maxX, maxY } = coordinates;

	if (minX > maxX || minY > maxY) {
		console.log("Image is fully transparent. No optimization needed.");
		return true;
	}

	await image
		.extract({
			left: minX,
			top: minY,
			width: maxX - minX + 1,
			height: maxY - minY + 1,
		})
		.toFormat("png")
		.toFile(inputPath + ".temp.png");

	fs.renameSync(inputPath + ".temp.png", inputPath);
	return true;
}
