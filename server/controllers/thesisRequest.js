const dao = require("../dao");

async function secretaryThesisRequest(req, res) {
  console.log(req.body.change)
  try {
    await dao.secretaryThesisRequest(req.params.id, req.body.change);

    return res.status(200).json("updated");
  } catch (err) {
    res.status(500).json(err);
  }
}

async function getRequestsForProfessor(req, res) {
  try {
    console.log(req.user);
    let requests = await dao.getRequestsForProfessor(req.user.username);
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json(err);
  }
}

async function getRequestsForSecretary(req, res) {
  try {
    let requests = await dao.getRequestsForSecretary();
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json(err);
  }
}

module.exports = {
  secretaryThesisRequest,
  getRequestsForProfessor,
  getRequestsForSecretary,
};
