import {connectToDatabase} from "../../lib/mongodb";

const handler = async (req, res) => {
    try {
        const {db} = await connectToDatabase();
        const response = await db.collection('Projects').createIndex({
                projectName: "text",
                projectAddress: "text",
                municipality: "text",
                municipal: "text",
                district: "text",
                ownerName: "text",
                permitNumber: "text",
                plotNumber: "text",
                schemeNumber: "text",
                conType: "text",
                conDesc: "text",
                floorCount: "text",
                desOffice: "text",
                superOffice: "text",
                contractor: "text",
                superEng: "text",
            },
            {name: 'search'});
        return res.status(200).json({response})
    } catch (e) {
        console.log({e});
        return res.status(400).json()
    }
}

export default handler;