import {connectToDatabase} from "../../lib/mongodb";
import fs from "fs";

const handler = async (req, res) => {
    const {id} = req.body;

    if (id) {
        try {
            const {db} = await connectToDatabase();
            // await fs.promises.rm(`./public/static/images/${id}`, {recursive: true, force: true})
            const files = await fs.promises.readdir('./public')

            await files.forEach(async (file) => {
                if (file.includes(`${id}-`)) {
                    await fs.promises.unlink(`./public/${file}`)
                }
            });
            await db.collection('Projects').deleteOne({_id: id});
            return res.status(200).json();
        } catch (e) {
            console.log({e});
            return res.status(400).json({message: 'لقد حدث خطأ ما'});
        }
    } else {
        return res.status(400).json({message: 'لا يوجد رقم مشروع بالطلب'});
    }
}

export default handler;