import {connectToDatabase} from "../../lib/mongodb";

const handler = async (req, res) => {
    const {db} = await connectToDatabase();
    try {
        const result = await db.collection('Projects').createIndex({
            projectName: 1,
            projectAddress: 1,
            municipality: 1,
            municipal: 1,
            district: 1,
            ownerName: 1,
            permitNumber: 1,
            plotNumber: 1,
            schemeNumber: 1,
            conType: 1,
            conDesc: 1,
            floorCount: 1,
            desOffice: 1,
            superOffice: 1,
            contractor: 1,
            superEng: 1,
            createdAt: 1,
            updatedAt: 1,
            createdBy: 1,
            updatedBy: 1
        }, {
            name: 'all_fields'
        });
        return res.status(201).json({result})
    } catch (e) {
        console.log({e})
        return res.status(400).json(e.message)
    }
}

export default handler;