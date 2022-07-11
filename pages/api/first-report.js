import fs from "fs";
import { TemplateHandler } from "easy-template-x";
import { connectToDatabase } from "../../lib/mongodb";

const handler = async (req, res) => {
	// const { images, projectName, projectAddress, ...proj } = req.query.data;
	const {id} = req.query;
	console.log(req.query);

	try {
		const { db } = await connectToDatabase();
		const project = await db
			.collection("Projects")
			.findOne({ _id: Number(id) });

		const { images, projectName, projectAddress, ...proj } = project;

		const reportTemplate = await fs.promises.readFile(
			"./public/static/report-templates/report1.docx"
		);

		let image1Src;
		let image2Src;

		if (images?.length > 1) {
			image1Src = await fs.promises.readFile(images[0].src);
			image2Src = await fs.promises.readFile(images[1].src);
		} else {
			image1Src = await fs.promises.readFile(images[0].src);
			image2Src = await fs.promises.readFile(images[0].src);
		}

		const data = {
			...proj,
			projectNameAddress: `${projectName} ب${projectAddress}`,
			image1: {
				_type: "image",
				source: image1Src,
				format: "image/png",
				width: 280,
				height: 200,
			},
			image2: {
				_type: "image",
				source: image2Src,
				format: "image/png",
				width: 280,
				height: 200,
			},
		};

		const tHandler = new TemplateHandler();
		const doc = await tHandler.process(reportTemplate, data);
		// await fs.promises.writeFile("./report1-done.docx", doc, {recursive: true, force: true});
		res.setHeader(
			"Content-Type",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		);
		res.status(200);
		return res.send(doc);
	} catch (e) {
		console.log({ e });
		return res.status(400).json();
	}
};

export default handler;
