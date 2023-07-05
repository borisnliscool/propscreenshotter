import express from "express";
import multer, { Multer } from "multer";
import path from "path";
import { HandleUpload } from "./upload";
import detectPort from "detect-port";

const app = express();

const upload: Multer = multer({ dest: "uploads/" });
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.post("/upload", upload.single("image"), HandleUpload);
app.post("/upload/*", upload.single("image"), HandleUpload);

// Start the server

(async () => {
	const port = await detectPort(3000);

	app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
	});
})();
