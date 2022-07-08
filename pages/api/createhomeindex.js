import {connectToDatabase} from "../../lib/mongodb";

const handler = async (req, res) => {
    const {db} = await connectToDatabase();
    try {
        const result = await db.collection('Projects').createIndex({
            createdAt: -1,
            "mainImage.**": "text",
            projectName: "text",
            projectAddress: "text",
        }, {
            name: 'home_page'
        });
        return res.status(201).json({result})
    } catch (e) {
        console.log({e})
        return res.status(400).json(e.message)
    }
}

export default handler;