const { selectTopics } = require("../models/topics.models");

exports.getTopics = async (req, res) => {
	try {
		const topics = await selectTopics();
		res.status(200).send({ topics });
	} catch (error) {
		console.log(error);
	}
};

exports.getArticleById = (req, res) => {
	try {
	} catch (error) {}
};
