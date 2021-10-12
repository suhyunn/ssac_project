const user = require("../models/user");
const jwtModule = require("./jwtModule");

const authModule = {
  loggedIn: async (req, res, next) => {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
      console.log(token);
      return res.status(409).json({
        message: "토큰 없음",
      });
    }

    const decoded = jwtModule.verify(token);

    // 수정 필요
    //   // if (!decoded.verified) {
    //     if(req.path!= “/profile”)
    //   //   return res.status(401).json({
    //   //     message: "추가 정보를 입력하시기 바랍니다.",
    //   //   });
    // }
    //   // }

    if (decoded === -1) {
      return res.status(409).json({
        message: "만료된 토큰입니다.",
      });
    } else if (decoded === -2) {
      return res.status(409).json({
        message: "유효하지 않은 토큰입니다.",
      });
    } else if (decoded === -3) {
      return res.status(409).json({
        message: "토큰 에러 입니다.",
      });
    }

    let userInfo;
    try {
      userInfo = await user.findOne({ email: decoded.email });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "유효하지 않은 유저입니다.",
      });
    }

    req.userInfo = userInfo;
    next();
  },
};

module.exports = authModule;
