import express, { Request, Response } from "express";
import multer, { Multer } from "multer";
import path from "path";
import fs from "fs";
import { RemoveBackground } from "./rembg";
import { optimizeImage } from "./crop";
import { compressAndConvertToWebP } from "./compress";

const app = express();
const upload: Multer = multer({ dest: "uploads/" });

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

async function HandleUpload(req: Request, res: Response) {
	if (!req.file) {
		return res.status(400).json({ message: "No file provided" });
	}

	// Get the file extension
	const fileExtension: string = path.extname(req.file.originalname);
	if (fileExtension != ".jpg")
		return res.status(500).json({ message: "Failed to save the file" });

	const fileName = req.params[0] ? req.params[0] : Date.now().toString();

	// Move the file to the desired location
	const destinationPath: string = path.join(
		__dirname,
		"../uploads",
		fileName + ".png"
	);
	const sourcePath: string = req.file.path;
	const uploadUrl = "uploads/" + fileName;
	fs.renameSync(sourcePath, destinationPath);

	try {
		fs.copyFileSync(
			destinationPath,
			path.join(__dirname, "../backup", fileName + ".png")
		);

		const buffer = await RemoveBackground(fs.readFileSync(destinationPath));
		fs.writeFileSync(destinationPath, buffer);
		await optimizeImage(destinationPath);
		await compressAndConvertToWebP(
			destinationPath,
			destinationPath.replace(".png", ".webp")
		);
		fs.rmSync(destinationPath);

		console.log(`Converted file ${destinationPath}`);
	} catch (err) {
		console.log(err);
		return;
	}

	console.log(`Uploaded file: ${fileName}`);

	return res.json({
		message: "File uploaded successfully",
		url: uploadUrl,
	});
}

app.post("/upload", upload.single("image"), HandleUpload);
app.post("/upload/*", upload.single("image"), HandleUpload);

// Start the server
app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
