const dao = require("../dao");
const { validationResult } = require("express-validator");

async function getProposals(req, res) {
  try {
    const proposals = await dao.getProposals(
      req.user.user_type,
      req.user.username,
      req.query.date
    );
    console.log(proposals);
    res.status(200).json(proposals);
  } catch (err) {
    res.status(500).json({ error: ` error: ${err} ` });
  }
}

async function getProposal(req, res) {
  const thesis_id = req.params.id; // Extract thesis_id from the URL
  try {
    if (!Number.isInteger(Number(thesis_id))) {
      throw new Error("Thesis ID must be an integer");
    }

    const proposal = await dao.getProposalById(
      thesis_id,
      req.user.user_type,
      req.user.username
    );
    res.status(200).json(proposal);
  } catch (error) {
    res.status(500).send(error.message + " ");
  }
}

module.exports = { getProposals, getProposal };
