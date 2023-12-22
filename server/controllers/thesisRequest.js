const dao = require("../dao");

async function secretaryThesisRequest (req, res) {
    try{
        await dao.secretaryThesisRequest(req.body.thesis_id, req.body.change)
        
        return res.status(200).json("updated")

    } catch (err){
        res.status(500).json(err)
    }
}

module.exports = {
    secretaryThesisRequest,
  };