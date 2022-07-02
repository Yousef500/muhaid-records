import {connectToDatabase} from "../../lib/mongodb";

const handler = async (req, res) => {
    const {currentPage, pageSize} = req.query;

    if (currentPage && pageSize) {
        try {
            const skipParams = (Number(currentPage) - 1) * Number(pageSize);
            const {db} = await connectToDatabase();
            const count = await db.collection('Projects').estimatedDocumentCount();
            const cursor = await db.collection('Projects').find({}, {
                sort: {createdAt: -1},
                skip: skipParams,
                limit: Number(pageSize)
            });
            const projects = await cursor.toArray()
            return res.status(200).json({projects, count});
        } catch (e) {
            console.log({e})
            return res.status(400).json({message: 'لقد حدث خطأ ما'})
        }
    } else {
        return res.status(400).json("no page number or size")
    }
}

export default handler;