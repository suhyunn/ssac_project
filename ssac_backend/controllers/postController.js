const post = require("../models/post");
const user = require("../models/user");
const statusCode = require("../modules/statusCode");

const postController = {
  createPost: async (req, res) => {
    const { title, content, category, tags } = req.body;
    const userInfo = req.userInfo;
    const postModel = new post({
      title,
      content,
      category,
      tags,
      publishedDate: new Date(),
      writer: userInfo._id,
    });

    try {
      const result = await postModel.save();
      if (result) {
        res.status(statusCode.OK).json({
          message: "게시판 저장 완료",
          data: result,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        message: "DB 서버 에러",
      });
    }
  },
  readAllPost: async (req, res) => {
    try {
      const result = await post.find().populate("writer");
      if (!result)
        return res
          .status(statusCode.CONLICT)
          .json({ message: "데이터가 없습니다." });

      res.status(statusCode.OK).json({
        message: "조회 성공",
        data: result,
      });
    } catch (error) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        message: "DB 서버 에러",
      });
    }
  },
  readDetailPost: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await post.findById(id);
      if (!result)
        return res
          .status(statusCode.CONFLICT)
          .json({ message: "데이터가 없습니다." });

      res.status(statusCode.OK).json({
        message: "조회 성공",
        data: result,
      });
    } catch (error) {
      console.log(error);
      res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        message: "DB 서버 에러",
      });
    }
  },
  updatePost: async (req, res) => {
    const userInfo = req.userInfo;
    const { id } = req.params;
    const { title, content, category, tags } = req.body;

    // 일치하는 회원인지 아닌지 확인
    const ownResult = await post.checkAuth({
      postId: id,
      writerId: userInfo._id,
    });
    console.log(ownResult);
    if (ownResult === -1) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .json({ message: "접근 권한이 없습니다." });
    } else if (ownResult === -2) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        message: "DB 서버 에러",
      });
    }

    try {
      const result = await post.findByIdAndUpdate(
        id,
        {
          title,
          content,
          category,
          tags,
        },
        { new: true }
      );
      res.status(statusCode.OK).json({
        message: "수정 성공",
        data: result,
      });
    } catch (error) {
      console.log(error);
      res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        message: "DB 서버 에러",
      });
    }
  },
  deletePost: async (req, res) => {
    const userInfo = req.userInfo;
    const { id } = req.params;

    // 일치하는 회원인지 아닌지 확인
    const ownResult = await post.checkAuth({
      postId: id,
      writerId: userInfo._id,
    });
    console.log(ownResult);
    if (ownResult === -1) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .json({ message: "접근 권한이 없습니다." });
    } else if (ownResult === -2) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        message: "DB 서버 에러",
      });
    }

    try {
      await post.findByIdAndDelete(id);
      res.status(statusCode.OK).json({
        message: "삭제 성공",
      });
    } catch (error) {
      console.log(error);
      res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        message: "DB 서버 에러",
      });
    }
  },
  createComment: async (req, res) => {
    const userInfo = req.userInfo;
    const { commentContent } = req.body;
    const { id } = req.params;

    const commentModel = {
      commnetWriter: userInfo._id,
      commentContent: commentContent,
      commentDate: new Date(),
    };

    try {
      const result = await post.findByIdAndUpdate(
        id,
        { $push: { comments: commentModel } },
        { new: true }
      );
      if (result) {
        res.status(statusCode.OK).json({
          message: "댓글 입력 완료",
          data: result,
        });
      } else {
        res.status(statusCode.NO_CONTENT).json({
          message: "댓글 입력 실패",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        message: "DB 서버 에러",
      });
    }
  },
};

module.exports = postController;
