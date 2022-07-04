import fs from "fs";
import path from "path";

export default async function handler(req, res) {
    const imagePath = req.query.slug.join("/");
    console.log(imagePath);
    const filePath = path.resolve(".", `images-directory/${imagePath}`);
    const imageBuffer = await fs.promises.readFile(filePath);
    res.setHeader("Content-Type", "image/jpg");
    return res.send(imageBuffer);
}