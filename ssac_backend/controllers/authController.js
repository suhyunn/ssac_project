const user = require("../models/user");
const statusCode = require("../modules/statusCode");
const jwtModule = require("../modules/jwtModule");

const authController = {
  signUp: async (req, res) => {
    const { email, password, nickName } = req.body;

    try {
      const result = await user.findOne({
        $or: [{ email }, { nickName }],
      });
      console.log(result);
      if (!result) {
        const userModel = new user({ email, password, nickName });
        await userModel.save();
        res.status(statusCode.OK).json({
          message: "회원가입 완료",
        });
      } else {
        res.status(statusCode.CONFLICT).json({
          message: "중복된 이메일 또는 닉네임이 존재합니다.",
        });
      }
    } catch (error) {
      console.log(error);
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "DB서버 에러" });
    }
  },
  signIn: async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await user.findOne({ email, password });
      console.log(result);
      if (result) {
        // payload에는 민감정보와 식별할 수 있는 정보 제외하고 입력
        const payload = {
          email: result.email,
          verified: result.verified,
        };
        console.log(payload);
        const accessToken = jwtModule.create(payload);
        console.log(accessToken);
        res.status(statusCode.OK).json({
          message: "로그인 성공",
          accessToken: accessToken,
        });
      } else {
        res.status(statusCode.CONFLICT).json({
          message: "로그인 실패",
        });
      }
    } catch (error) {
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "DB서버 에러" });
      console.log(error);
    }
  },
  updateProfile: async (req, res) => {
    const userInfo = req.userInfo;
    const { type, age, gender, degree, inoDate, profileImage } = req.body;
    const { id } = req.params;

    const ownResult = await user.checkAuth({
      userId: id,
      tokenId: userInfo._id,
    });
    // console.log(ownResult);
    if (ownResult === -1) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .json({ message: "접근 권한이 없습니다." });
    } else if (ownResult === -2) {
      return res.status(statusCode.DB_ERROR).json({
        message: "DB서버 에러",
      });
    }
    //console.log(degree);
    //type degree
    try {
      if (age && type) {
        const result = await user.findByIdAndUpdate(
          id,
          {
            type,
            gender,
            age,
            degree,
            inoDate,
            profileImage,
            verified: true,
          },
          { new: true }
        );

        if (!result) {
          res.status(statusCode.NO_CONTENT).json({
            message: "게시물이 존재하지 않습니다.",
          });
        } else {
          res.status(statusCode.OK).json({
            message: "수정 완료",
            data: result,
          });
        }
      } else {
        res
          .status(200)
          .json({ message: "백신종류 및 나이를 입력해주시기 바랍니다." });
      }
    } catch (error) {
      console.log(error);
      res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        message: "서버 에러",
      });
    }
  },
  deleteProfile: async (req, res) => {
    const userInfo = req.userInfo;
    const { password } = req.body;

    try {
      const result = await user.findOneAndDelete({
        _id: userInfo._id,
        password,
      });
      if (result) {
        res.status(statusCode.OK).json({
          message: "회원 탈퇴 성공",
        });
      } else {
        res.status(statusCode.CONFLICT).json({
          message: "회원 정보가 일치하지 않습니다.",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        message: "DB 서버 에러",
      });
    }
  },
  uploadImage: (req, res) => {
    const file = req.file;
    console.log(file);
    if (file) {
      res.status(200).json({
        message: "이미지 업로드 완료",
        imgUrl: file.location,
      });
    } else {
      res.status(400).json({
        message: "이미지 업로드 실패",
      });
    }
    console.error(error);
  },
  getProfile: (req, res) => {
    const userInfo = req.userInfo;

    if (userInfo) {
      //있을떄
      res.status(200).json({
        message: "프로필 조회 성공",
        data: userInfo,
      });
    } else {
      res.status(400).json({
        message: "프로필 조회 실패",
      });
    }
  },
};

module.exports = authController;
