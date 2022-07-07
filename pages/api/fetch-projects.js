import {connectToDatabase} from "../../lib/mongodb";
import fs from "fs";

const handler = async (req, res) => {
    const {currentPage, pageSize} = req.query;

    if (currentPage && pageSize) {
        try {
            const skipParams = (Number(currentPage) - 1) * Number(pageSize);
            const {db} = await connectToDatabase();
            const count = await db.collection('Projects').estimatedDocumentCount();
            const cursor = await db.collection('Projects').find({}, {
                // sort: {createdAt: -1},
                skip: skipParams,
                limit: Number(pageSize),
                "hint": "home_page"
            }).project({projectName: 1, projectAddress: 1, mainImage: 1});

            const initialProjects = await cursor.toArray()
            const projects = [];
            for (let proj of initialProjects) {
                const image = await fs.promises.readFile(proj.mainImage.src, "base64");
                projects.push({
                    ...proj,
                    mainImage: {
                        ...proj.mainImage,
                        src: `data:${proj.mainImage.type};base64,${image}`
                    }
                })
            }
            return res.status(200).json({projects, count});
        } catch (e) {
            console.log({e})
            return res.status(400).json({message: 'لقد حدث خطأ ما'})
        }
    } else {
        return res.status(400).json("no page number or size")
    }
}

export default handler;

export const config = {
    api: {
        responseLimit: false,
    },
}