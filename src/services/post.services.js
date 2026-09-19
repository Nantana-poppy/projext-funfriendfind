import prisma from "../lib/prisma.js";
import createError from "http-errors";

export async function getUserPosts(userId) {
  const id = Number(userId);

  if (!Number.isInteger(id) || id < 1) {
    throw createError(400, "Invalid user ID");
  }

  // Check User
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw createError(404, "User not found");
  }

  // Get user's posts
  const posts = await prisma.post.findMany({
    where: {
      userId: id,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },

      category: {
        select: {
          id: true,
          name: true,
        },
      },

      images: {
        select: {
          id: true,
          imageUrl: true,
        },
      },

      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  return posts;
}

export async function createPost(userId, postData) {
  const { caption, location, categoryId, images } = postData;

  // Validate caption
  if (!caption || !caption.trim()) {
    throw createError(400, "Caption is required");
  }

  // Check User
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw createError(404, "User not found");
  }

  // Validate images
  if (images !== undefined && !Array.isArray(images)) {
    throw createError(400, "Images must be an array");
  }

  const post = await prisma.post.create({
    data: {
      caption: caption.trim(),

      location: location || null,

      user: {
        connect: {
          id: userId,
        },
      },

      ...(categoryId !== undefined &&
        categoryId !== null && {
          category: {
            connect: {
              id: Number(categoryId),
            },
          },
        }),

      ...(images &&
        images.length > 0 && {
          images: {
            create: images.map((imageUrl) => ({
              imageUrl,
            })),
          },
        }),
    },

    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },

      category: {
        select: {
          id: true,
          name: true,
        },
      },

      images: {
        select: {
          id: true,
          imageUrl: true,
        },
      },

      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  return post;
}

export async function getPostById(postId) {
  const id = Number(postId);

  if (!Number.isInteger(id) || id < 1) {
    throw createError(400, "Invalid post ID");
  }

  const post = await prisma.post.findUnique({
    where: {
      id,
    },

    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          bio: true,
        },
      },

      category: {
        select: {
          id: true,
          name: true,
        },
      },

      images: {
        select: {
          id: true,
          imageUrl: true,
        },
      },

      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  if (!post) {
    throw createError(404, "Post not found");
  }

  return post;
}

export async function likePost(postId, userId) {
  const id = Number(postId);

  if (!Number.isInteger(id) || id < 1) {
    throw createError(400, "Invalid post ID");
  }

  // Check post
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });

  if (!post) {
    throw createError(404, "Post not found");
  }

  // Check already liked
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId,
        postId: id,
      },
    },
  });

  if (existingLike) {
    throw createError(409, "Post has already been liked");
  }

  const like = await prisma.like.create({
    data: {
      userId,
      postId: id,
    },
  });

  return like;
}

export async function createComment(postId, userId, comment) {
  const id = Number(postId);

  if (!Number.isInteger(id) || id < 1) {
    throw createError(400, "Invalid post ID");
  }

  if (!comment || !comment.trim()) {
    throw createError(400, "Comment is required");
  }

  // Check Post
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });

  if (!post) {
    throw createError(404, "Post not found");
  }

  const newComment = await prisma.comment.create({
    data: {
      comment: comment.trim(),

      user: {
        connect: {
          id: userId,
        },
      },

      post: {
        connect: {
          id,
        },
      },
    },

    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
    },
  });

  return newComment;
}

export async function getAllPosts() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },

      category: {
        select: {
          id: true,
          name: true,
        },
      },

      images: {
        select: {
          id: true,
          imageUrl: true,
        },
      },

      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  return posts;
}

export async function updatePost(postId, userId, postData) {
  const id = Number(postId);

  if (!Number.isInteger(id) || id < 1) {
    throw createError(400, "Invalid post ID");
  }

  const existingPost = await prisma.post.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!existingPost) {
    throw createError(404, "Post not found");
  }

  if (existingPost.userId !== userId) {
    throw createError(403, "You are not authorized to edit this post");
  }

  const { caption, location, categoryId, images } = postData;

  if (caption !== undefined && (!caption || !caption.trim())) {
    throw createError(400, "Caption cannot be empty");
  }

  if (images !== undefined && !Array.isArray(images)) {
    throw createError(400, "Images must be an array");
  }

  const updatedPost = await prisma.$transaction(async (tx) => {
    // If new images array provided, replace old images
    if (images !== undefined) {
      await tx.postImage.deleteMany({
        where: { postId: id },
      });

      if (images.length > 0) {
        await tx.postImage.createMany({
          data: images.map((imageUrl) => ({
            postId: id,
            imageUrl,
          })),
        });
      }
    }

    return await tx.post.update({
      where: { id },
      data: {
        ...(caption !== undefined && { caption: caption.trim() }),
        ...(location !== undefined && { location: location ? location.trim() : null }),
        ...(categoryId !== undefined && {
          categoryId: categoryId ? Number(categoryId) : null,
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        images: {
          select: {
            id: true,
            imageUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
  });

  return updatedPost;
}

export async function deletePost(postId, userId) {
  const id = Number(postId);

  if (!Number.isInteger(id) || id < 1) {
    throw createError(400, "Invalid post ID");
  }

  const existingPost = await prisma.post.findUnique({
    where: { id },
  });

  if (!existingPost) {
    throw createError(404, "Post not found");
  }

  if (existingPost.userId !== userId) {
    throw createError(403, "You are not authorized to delete this post");
  }

  await prisma.post.delete({
    where: { id },
  });

  return { message: "Post deleted successfully" };
}

