import sqlMgr from "../../config/mySql";

const handler = async (req, res) => {
    await sqlMgr.query("SELECT * FROM testusers", (err, result) => {
        if (err) {
            console.log({err})
            return res.status(400).json({message: err.message});
        }
        return res.status(200).json({result})
    })
}

export default handler;