import {connectToDatabase} from "../../lib/mongodb";
import fs from "fs";

const handler = async (req, res) => {
    const {projectName} = req.body;

    if (projectName) {
        try {
            const {db} = await connectToDatabase();
            await fs.promises.rm(`./public/static/images/${projectName}`, {recursive: true, force: true})
            const result = await db.collection('Projects').deleteOne({projectName: projectName});
            console.log(result);
            return res.status(200).json();
        } catch (e) {
            console.log({e});
            return res.status(400).json({message: 'لقد حدث خطأ ما'});
        }
    } else {
        return res.status(400).json({message: 'لا يوجد اسم مشروع بالطلب'});
    }
}

export default handler;