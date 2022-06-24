import bcrypt from "bcrypt";
import {connectToDatabase} from "../../lib/mongodb";

const handler = async (req, res) => {
    const {email, password} = req.body;

    if (email === process.env.EMAIL && password === process.env.PASS) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const {db} = await connectToDatabase();
            const user = await db.collection('Users').findOne({email});
            if (user) return res.status(400).json({message: "User already exists"});
            const result = await db.collection('Users').insertOne({
                email,
                hashedPassword
            })

            if (result.acknowledged) {
                return res.status(201).json({result})
            }
        } catch (e) {
            console.log({e});
            return res.status(400).json({message: e.message})
        }
    } else {
        return res.status(400).json({message: "Make sure it is a post request with email and password"});
    }
}

export default handler;