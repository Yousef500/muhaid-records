import {connectToDatabase} from "../../lib/mongodb";

const handler = async (req, res) => {
    const {db} = await connectToDatabase();
    try {
        const result = await db.collection('Projects').indexInformation()
        return res.status(201).json({result})
    } catch (e) {
        console.log({e})
        return res.status(400).json(e.message)
    }
}

export default handler;