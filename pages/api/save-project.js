import fs from "fs";
import {connectToDatabase} from "../../lib/mongodb";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
    const data = req.body;
    const token = req.cookies.access_token;

    if (token) {
        const publicKey = await fs.promises.readFile('./src/app/public.pem');
        const verifiedUser = await jwt.verify(token, publicKey, {algorithm: 'RS256'});
        if (verifiedUser?.email && data.projectName) {
            const {projectName} = data;
            try {
                const {db} = await connectToDatabase();
                const counter = await db.collection('Counters').findOneAndUpdate({_id: 'projectId'}, {$inc: {sequence_value: 1}});
                const sequenceValue = counter.value.sequence_value;
                const project = await db.collection('Projects').findOne({projectName});
                if (project?._id) return res.status(400).json({message: 'المشروع موجود بالفعل'});
                await fs.promises.mkdir(`./public/static/images/${projectName}`, {recursive: true})
                let dbImages = [];
                data.images.map(async (imageString) => {
                    const date = Date.now();
                    const type = imageString.split(';')[0].split('/')[1];
                    dbImages.push(`/static/images/${projectName}/${date}.${type}`)
                    const image = Buffer.from(imageString.split('base64,')[1], 'base64');
                    await fs.promises.writeFile(`./public/static/images/${projectName}/${date}.${type}`, image);
                })
                try {
                    const now = Date.now();
                    const result = await db.collection('Projects').insertOne({
                        _id: sequenceValue,
                        ...data,
                        images: dbImages,
                        createdAt: now,
                        updatedAt: now,
                        createdBy: verifiedUser.email,
                        updatedBy: verifiedUser.email
                    });
                    return res.status(201).json({project: {...data, images: dbImages}});
                } catch (e) {
                    console.log({e})
                    await fs.promises.rm(`./public/static/images/${projectName}`, {recursive: true, force: true});
                    return res.status(400).json({message: 'لقد حدث خطأ ما'});
                }
            } catch (e) {
                console.log({e})
                return res.status(400).json({message: 'لقد حدث خطأ ما'});
            }
        }
    } else {
        return res.status(403).json({message: 'الرجاء تسجيل الدخول أولا'});
    }
}

export default handler;

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb'
        }
    }
}