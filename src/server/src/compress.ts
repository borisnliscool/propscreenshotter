import sharp from "sharp";

export async function compressAndConvertToWebP(
	inputPath: string,
	outputPath: string
): Promise<void> {
	await sharp(inputPath)
		.resize(256, 256, {
			fit: "contain",
			background: {
				r: 0,
				g: 0,
				b: 0,
				alpha: 0,
			},
		})
		.webp({ quality: 80 })
		.toFile(outputPath);
}
