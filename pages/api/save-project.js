import fs from "fs";
import {connectToDatabase} from "../../lib/mongodb";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
    const data = req.body;
    const token = req.cookies.access_token;
    const date = Date.now();

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
                // await fs.promises.mkdir(`./static/images/${sequenceValue}`, {recursive: true})
                let dbImages = [];
                await data.images.map(async (imageInfo) => {
                    // const image = Buffer.from(imageInfo.src.split('base64,')[1], 'base64');
                    dbImages.push({
                        // src: `/static/images/${sequenceValue}/${imageInfo.name}`,
                        ...imageInfo
                    })
                    // await fs.promises.writeFile(`./static/images/${sequenceValue}/${imageInfo.name}`, image);
                })
                try {
                    const result = await db.collection('Projects').insertOne({
                        _id: sequenceValue,
                        ...data,
                        images: dbImages,
                        createdAt: date,
                        updatedAt: date,
                        createdBy: verifiedUser.email,
                        updatedBy: verifiedUser.email
                    });
                    return res.status(201).json({project: {...data, images: dbImages}});
                } catch (e) {
                    console.log({e})
                    // const files = await fs.promises.readdir('./static')
                    //
                    // await files.forEach(async (file) => {
                    //     if (file.includes(`${id}-`)) {
                    //         await fs.promises.unlink(`./public/${file}`)
                    //     }
                    // });
                    // await fs.promises.rm(`./static/images/${sequenceValue}`, {recursive: true, force: true});
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