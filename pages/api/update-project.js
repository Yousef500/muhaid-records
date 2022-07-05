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
                    const date = Date.now();
                    // let dbImages = [];
                    // await project.images.map(async (imageString) => {
                    //     if (imageString.src.includes('static')) {
                    //         dbImages.push(imageString);
                    //     } else {
                    //         dbImages.push({
                    //             src: `/${id}-${imageString.name}`,
                    //             name: imageString.name
                    //         });
                    //         const image = Buffer.from(imageString.src.split('base64,')[1], 'base64');
                    //         await fs.promises.writeFile(`./public/${id}-${imageString.name}`, image);
                    //     }
                    // })
                    const query = {_id: Number(id)};
                    const updatedDocument = {
                        $set: {
                            // projectName: project.projectName,
                            // projectAddress: project.projectAddress,
                            // municipality: project.municipality,
                            // municipal: project.municipal,
                            // district: project.district,
                            // ownerName: project.ownerName,
                            // permitNumber: project.permitNumber,
                            // plotNumber: project.plotNumber,
                            // schemeNumber: project.schemeNumber,
                            // conType: project.conType,
                            // conDesc: project.conDesc,
                            // floorCount: project.floorCount,
                            // desOffice: project.desOffice,
                            // superOffice: project.superOffice,
                            // contractor: project.contractor,
                            // superEng: project.superEng,
                            ...project,
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
            sizeLimit: '10mb'
        }
    }
}