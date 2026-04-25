import prisma from "../config/database.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: { select: { id: true, name: true, avatar: true, position: true, company: true, isMentor: true } },
        likes: true,
        comments: {
          include: {
            user: { select: { id: true, name: true, avatar: true } }
          },
          orderBy: { createdAt: "asc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    if (!content) return res.status(400).json({ success: false, message: "Content is required" });

    const post = await prisma.post.create({
      data: {
        content,
        image,
        userId: req.user.id
      },
      include: {
        user: { select: { id: true, name: true, avatar: true, position: true, company: true, isMentor: true } },
        likes: true,
        comments: true
      }
    });
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;

    const existingLike = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId } }
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      res.status(200).json({ success: true, message: "Post unliked" });
    } else {
      await prisma.like.create({ data: { postId, userId } });
      res.status(201).json({ success: true, message: "Post liked" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const { content } = req.body;

    if (!content) return res.status(400).json({ success: false, message: "Content is required" });

    const comment = await prisma.comment.create({
      data: {
        postId,
        userId: req.user.id,
        content
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } }
      }
    });
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
