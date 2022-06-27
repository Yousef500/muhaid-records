const handler = (req, res) => {
    const data = req.body;

    return res.json()
}

export default handler;
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb'
        }
    }
}