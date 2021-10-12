const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: Number, required: true, default: 0 },
  //   tags: [String],
  tags: [{ type: String, default: null }],
  publishedDate: {
    type: Date,
    default: new Date(),
  },
  updatedDate: { type: Date, default: null },
  writer: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  comments: [
    {
      commnetWriter: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      commentContent: { type: String, default: null },
      commentDate: { type: Date, default: new Date() },
    },
  ],
});

// this => model or schema
postSchema.statics.checkAuth = async function (params) {
  const { postId, writerId } = params;
  try {
    const ownResult = await this.findOne({ _id: postId });
    const ownId = ownResult.writer;

    console.log(ownResult);
    console.log(ownId);
    if (ownId.toString() !== writerId.toString()) {
      return -1;
    }
    return 1;
  } catch (error) {
    console.log(error);
    return -2;
  }
};

// this => document or data instance
// postSchema.methods.checkMe = function () {
//   this.title;
// };

module.exports = mongoose.model("post", postSchema);
