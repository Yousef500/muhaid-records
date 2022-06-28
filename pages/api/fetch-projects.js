import {connectToDatabase} from "../../lib/mongodb";

const handler = async (req, res) => {
    const {pageSize, pageNumber} = req.query;

    if (pageSize && pageNumber) {
        const {db} = connectToDatabase();
        const projects = db.collection('Projects').get
    } else {
        return res.status(400).json("no page number or size")
    }
}

export default handler;