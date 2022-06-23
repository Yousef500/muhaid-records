import sqlMgr from "../../config/mySql";
import bcrypt from "bcrypt";
import {env} from "../../next.config";

const handler = async (req, res) => {
    const {email, password} = req.body;

    if (email === env.EMAIL && password === env.PASSWORD) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(password)
        try {
            await sqlMgr.query(`INSERT INTO Users (email, password) VALUES ('${email}', '${password}')`, (err) => {
                if (err) {
                    return res.status(400).json({message: err.message})
                }
                return res.status(200).json({message: 'created record'})
            });
        } catch (e) {
            console.log({e})
            return res.status(400).json({message: e.message})
        }
    }
}

export default handler;