import type { NextApiRequest, NextApiResponse } from "next";

import { authenticateUser, handleApiError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Authenticate user
  const authenticatedUser = await authenticateUser(req);
  if (!authenticatedUser)
    return res.status(401).json({ error: "Unauthorized" });
  const { postId } = req.query;

  // Validate postId
  if (typeof postId !== "string") {
    return res.status(400).json({ error: "Invalid post ID" });
  }

  try {
    // Find the user in our database
    const user = await prisma.user.findUnique({
      where: { firebaseId: authenticatedUser.firebaseId },
      select: { id: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the post exists
    const postExists = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!postExists) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (req.method === "POST") {
      // Check if already liked
      const existingLike = await prisma.like.findFirst({
        where: {
          postId,
          userId: user.id,
        },
      });

      if (existingLike) {
        // Unlike the post
        await prisma.like.delete({
          where: { id: existingLike.id },
        });

        return res.status(200).json({
          success: true,
          action: "unliked",
          likeId: null,
        });
      } else {
        // Like the post
        const newLike = await prisma.like.create({
          data: {
            post: { connect: { id: postId } },
            user: { connect: { id: user.id } },
          },
          select: {
            id: true,
            postId: true,
            userId: true,
            createdAt: true,
          },
        });

        return res.status(201).json({
          success: true,
          action: "liked",
          likeId: newLike.id,
        });
      }
    } else if (req.method === "GET") {
      // Check like status
      const like = await prisma.like.findFirst({
        where: {
          postId,
          userId: user.id,
        },
        select: {
          id: true,
        },
      });

      return res.status(200).json({
        isLiked: !!like,
        likeId: like?.id || null,
      });
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error in like endpoint:", error);
    return handleApiError(res, error, 500);
  }
}
