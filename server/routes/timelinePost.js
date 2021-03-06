const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Schema = mongoose.Schema;

var postSchema = new Schema({
	storyId: String,
	title: String,
	content: String,
	createdAt: Date,
	updatedAt: Date,
});

var PostModel = mongoose.model("timelinePost", postSchema, "TimelinePosts");

exports.getTimelinePosts = function (req, res) {
	PostModel.find({storyId: req.params.storyId}, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			const response = [];
			result.forEach(post => {
				const item = {};
				item.id = post._id;
				item.title = post.title;
				item.content = post.content;
				item.storyId = post.storyId;
				item.createdAt = post.createdAt;
				item.updatedAt = post.updatedAt;
				response.push(item);
			});
			res.json(response);
			console.log("Get timeline posts succussfully!");
        }
    });
}

exports.postTimelinePosts = function (req, res) {
	const newTimelinePost = new PostModel({
		storyId: req.body.storyId,
		title: req.body.title,
		content: req.body.content,
		createdAt: req.body.createdAt,
    });
    console.log(req.body);
	newTimelinePost.save(function (err, timelinePost) {
		if (err) return console.error(err);
		res.status(200).json(timelinePost);
		console.log("Timeline posts inserted succussfully!");
	});
}

exports.updateTimelinePostById = function (req, res) {
	let updateQuery = {};
	updated.updatedAt = req.body.updatedAt;

	if (req.body.title) {
		updateQuery.title = req.body.title;
	}
	if (req.body.content) {
		updateQuery.content = req.body.content;
	}
    
	PostModel.updateOne({ _id: req.params.id }, {
		$set: updateQuery
	}).then(result => {
		res.status(200).json({ message: req.params.id + " updated succussfully!" });
		console.log("Put timeline post succussfully!");
	});
}

exports.deleteTimelinePost = function(req, res) {
	PostModel.findOneAndDelete({storyId: req.params.storyId, _id: req.params.postId}, function(err, post) {
		if (err) {
			console.log(err)
		}
		else {
			console.log("Deleted timeline post: ", post);
		}
	}).then(result => {
		res.status(200).json({ message: req.params.storyId + " " + req.params.postId  + " deleted succussfully!" });
		console.log("Deleted timeline post succussfully!");
	});
}