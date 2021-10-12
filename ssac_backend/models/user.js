const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  nickName: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  type: { type: String, default: null },
  age: { type: Number, default: null },
  gender: { type: String, enum: ["male", "female"], default: "male" },
  degree: { type: Number, default: 0 },
  inoDate: { type: Date, default: null },
  verified: { type: Boolean, default: false },
  profileImage: { type: String, default: null },
});

// // this => model or schema 이 과정이 굳이 필요할까?
// userSchema.statics.checkAuth = async function (params) {
//   const { userId, tokenId } = params;
//   try {
//     console.log(ownResult);
//     console.log(ownId);
//     const ownResult = await this.findOne({ _id: userId });
//     const ownId = ownResult.tokenId;
//     if (ownId.toString() !== tokenId.toString()) {
//       return -1;
//     }
//     return 1;
//   } catch (error) {
//     return -2;
//   }
// };

module.exports = mongoose.model("user", userSchema);
