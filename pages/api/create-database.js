import sqlMgr from "../../lib/mySql";
import {env} from "../../next.config";

const handler = async (req, res) => {
    const {email, password} = req.body;

    if (email === env.EMAIL && password === env.PASSWORD) {
        try {
            await sqlMgr.query("CREATE DATABASE MuhaidRecords", (err, result) => {
                if (err) {
                    console.log({err})
                    return res.status(400).json({message: err.message})
                }
                return res.status(200).json({result});
            })
        } catch (e) {
            console.log({e})
            return res.status(400).json({message: e.message})
        }
    }
}

export default handler;