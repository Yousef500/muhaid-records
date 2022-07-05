import fs from "fs";
import {connectToDatabase} from "../../lib/mongodb";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
    const {newProject} = req.body;
    const token = req.cookies.access_token;
    const date = Date.now();

    if (token) {
        const publicKey = await fs.promises.readFile('./src/app/public.pem');
        const verifiedUser = await jwt.verify(token, publicKey, {algorithm: 'RS256'});
        if (verifiedUser?.email && newProject?.projectName) {
            const {projectName} = newProject;
            try {
                const {db} = await connectToDatabase();
                const project = await db.collection('Projects').findOne({projectName});
                if (project?._id) return res.status(400).json({message: 'المشروع موجود بالفعل'});
                const counter = await db.collection('Counters').findOneAndUpdate({_id: 'projectId'}, {$inc: {sequence_value: 1}});
                const sequenceValue = counter.value.sequence_value;
                const result = await db.collection('Projects').insertOne({
                    _id: sequenceValue,
                    ...newProject,
                    createdAt: date,
                    updatedAt: date,
                    mainImage: newProject.images[0],
                    createdBy: verifiedUser.email,
                    updatedBy: verifiedUser.email
                });
                if (result.acknowledged) {
                    return res.status(201).json();
                } else {
                    return res.status(400).json({message: 'لقد حدث خطأ ما'})
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
            sizeLimit: '5mb'
        }
    }
}