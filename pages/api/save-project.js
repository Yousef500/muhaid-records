import fs from "fs";
import jwt from "jsonwebtoken";
import {connectToDatabase} from "../../lib/mongodb";

const handler = async (req, res) => {
    const {newProject} = req.body;
    const token = req.cookies.access_token;
    const date = Date.now();

    if (token) {
        const publicKey = await fs.promises.readFile("./src/app/public.pem");
        const verifiedUser = await jwt.verify(token, publicKey, {
            algorithm: "RS256",
        });
        if (verifiedUser?.email && newProject?.projectName) {
            const {projectName} = newProject;
            try {
                const {db} = await connectToDatabase();
                const project = await db.collection("Projects").findOne({projectName});
                if (project?._id) return res.status(400).json({message: "المشروع موجود بالفعل"});
                const counter = await db.collection("Counters").findOneAndUpdate({_id: "projectId"}, {$inc: {sequence_value: 1}});
                const sequenceValue = counter.value.sequence_value;
                const basePath = `/static/images/${sequenceValue}`;
                await fs.promises.mkdir(`./public${basePath}`, {recursive: true});

                const dbImages = [];
                for (let imageObject of newProject.images) {
                    const base64Image = imageObject.src;
                    const imageBuffer = Buffer.from(base64Image.split("base64,")[1], "base64");
                    await fs.promises.writeFile(`./public${basePath}/${imageObject.name}`, imageBuffer);
                    dbImages.push({
                        src: `.${basePath}/${imageObject.name}`,
                        name: imageObject.name,
                        type: imageObject.type,
                    });
                }
                // await newProject.images.map(async (imageObject) => {
                //     dbImages.push({
                //         src: `${basePath}/${imageObject.name}`,
                //         name: imageObject.name,
                //         type: imageObject.type,
                //     });
                //     const base64Image = imageObject.src;
                //     const imageBuffer = Buffer.from(base64Image.split("base64,")[1], "base64");
                //     await fs.promises.writeFile(`${basePath}/${imageObject.name}`, imageBuffer);
                // });

                const result = await db.collection("Projects").insertOne({
                    _id: sequenceValue,
                    ...newProject,
                    images: dbImages,
                    createdAt: date,
                    updatedAt: date,
                    mainImage: dbImages[0],
                    createdBy: verifiedUser.email,
                    updatedBy: verifiedUser.email,
                });
                if (result.acknowledged) {
                    return res.status(201).json();
                } else {
                    return res.status(400).json({message: "لقد حدث خطأ ما"});
                }
            } catch (e) {
                console.log({e});
                return res.status(400).json({message: "لقد حدث خطأ ما"});
            }
        }
    } else {
        return res.status(403).json({message: "الرجاء تسجيل الدخول أولا"});
    }
};

export default handler;

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "5mb",
        },
    },
};
