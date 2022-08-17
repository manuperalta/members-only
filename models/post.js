const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: { type: String, required: true, maxLength: 100 },
    content: { type: String, required: true, maxLength: 400 },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    datePosted: { type: Date, default: Date.now }
})

PostSchema
    .virtual('url')
    .get(function () {
        return '/posts/' + this._id
    })

PostSchema
    .virtual('dateTime')
    .get(function () {
        return DateTime.fromJSDate(this.datePosted).toFormat('MMMM dd, yyyy')
    })
PostSchema
    .virtual('relativeDate')
    .get(function(){
        return DateTime.fromJSDate(this.datePosted).toRelativeCalendar()
    })
module.exports = mongoose.model('Post', PostSchema);