import {connectToDatabase} from "../../lib/mongodb";
import fs from "fs";

const handler = async (req, res) => {
    const {name} = req.body;

    if (name) {
        try {
            const {db} = await connectToDatabase();
            await fs.promises.rm(`./public/static/images/${name}`, {recursive: true, force: true})
            await db.collection('Projects').deleteOne({projectName: name});
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