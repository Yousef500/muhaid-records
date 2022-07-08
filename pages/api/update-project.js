import jwt from "jsonwebtoken";
import fs from "fs";
import {connectToDatabase} from "../../lib/mongodb";

const handler = async (req, res) => {
    const token = req.cookies.access_token;
    if (token) {
        try {
            const publicKey = await fs.promises.readFile('./src/app/public.pem');
            const verifiedUser = await jwt.verify(token, publicKey, {algorithm: 'RS256'});

            if (verifiedUser.email) {
                const {id, project} = req.body;
                if (id && project) {
                    // const projectFolder = `/${id}`
                    const {db} = await connectToDatabase();
                    const existingProject = await db.collection('Projects').findOne({projectName: project.projectName.trim()});
                    if (existingProject?._id && existingProject._id !== Number(id)) return res.status(400).json({message: 'المشروع موجود بالفعل'});
                    const basePath = `./public/static/images/${id}`;
                    const date = Date.now();
                    const dbImages = [];
                    for (let imageObject of project.images) {
                        const base64Image = imageObject.src;
                        const imageBuffer = Buffer.from(base64Image.split("base64,")[1], "base64");
                        await fs.promises.writeFile(`${basePath}/${imageObject.name}`, imageBuffer);
                        dbImages.push({
                            src: `${basePath}/${imageObject.name}`,
                            name: imageObject.name,
                            type: imageObject.type,
                        });
                    }
                    const query = {_id: Number(id)};
                    const updatedDocument = {
                        $set: {
                            ...project,
                            images: dbImages,
                            updatedAt: date,
                            updatedBy: verifiedUser.email
                        }
                    }
                    const dbRes = await db.collection('Projects').updateOne(query, updatedDocument);
                    if (dbRes.modifiedCount > 0) {
                        await res.revalidate(`/projects/edit-project/${id}`);
                        return res.status(200).json()
                    } else {
                        console.log(dbRes)
                        return res.status(400).json({message: 'لقد حدث خطأ ما'})
                    }
                }
            }
        } catch (e) {
            console.log({e})
            return res.status(400).json({message: 'لقد حدث خطأ ما'})
        }
    } else {
        return res.status(403).json({message: 'رجاء تسجيل الدخول أولا'})
    }
}

export default handler;

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '5mb'
        }
    }
}