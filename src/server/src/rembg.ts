const rembgUrl = "http://localhost:5000/api/remove";

export async function RemoveBackground(buffer: Buffer): Promise<Buffer> {
	const blob = new Blob([buffer]);

	const formData = new FormData();
	formData.append("file", blob);

	const response = await fetch(rembgUrl, {
		method: "POST",
		body: formData,
	});

	const data = await response.blob();
	const arrayBuffer = await data.arrayBuffer();
	const resultBuffer = Buffer.from(arrayBuffer);

	return resultBuffer;
}
