const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
	title: { type: String, required: true, },
	comments: [String],
	commentcount: { type: Number, default: 0 },
});

// increment Mongoose document versions and comment count on each update
bookSchema.pre('findOneAndUpdate', function(next) {
	this.findOneAndUpdate({}, { $inc: { __v: 1, commentcount: 1 }, next });
})

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
