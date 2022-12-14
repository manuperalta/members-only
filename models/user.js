const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    isMember: { type: Boolean, required: true },
    isAdmin: Boolean
})

UserSchema
    .virtual('fullname')
    .get(function () { return this.firstname + " " + this.lastname })

UserSchema
    .virtual('url')
    .get(function () { return '/users/' + this._id })

const User = mongoose.model("User", UserSchema);

module.exports = User;