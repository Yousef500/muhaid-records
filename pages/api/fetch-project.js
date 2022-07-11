import { connectToDatabase } from "../../lib/mongodb";
import fs from "fs";

const handler = async (req, res) => {
    const { id } = req.query;

    if (id) {
        try {
            const { db } = await connectToDatabase();
            const project = await db
                .collection("Projects")
                .findOne({ _id: Number(id) });
            return res.status(200).json({ project });
        } catch (e) {
            console.log({ e });
            return res.status(400).json({ message: "لقد حدث خطأ ما" });
            F;
        }
    } else {
        return res.status(400).json("no page number or size");
    }
};

export default handler;

export const config = {
    api: {
        responseLimit: false,
    },
};
