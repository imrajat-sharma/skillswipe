const toIdString = (value) => value?._id?.toString?.() || value?.toString?.() || '';

const formatComment = (comment) => ({
  _id: comment._id,
  author: comment.author,
  content: comment.content,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
});

const formatPost = (post, currentUserId) => ({
  _id: post._id,
  type: post.type,
  formatting: post.formatting,
  content: post.content,
  caption: post.caption,
  images: post.images,
  poll: post.poll?.question
    ? {
        question: post.poll.question,
        options: post.poll.options,
        closesAt: post.poll.closesAt,
        isClosed: Boolean(post.poll.closesAt && new Date(post.poll.closesAt) <= new Date()),
      }
    : null,
  author: post.author,
  isOwner: Boolean(currentUserId && toIdString(post.author) === currentUserId.toString()),
  likeCount: post.likedBy?.length || 0,
  commentCount: post.comments?.length || 0,
  shareCount: post.sharedBy?.length || 0,
  isLiked: Boolean(currentUserId && post.likedBy?.some((userId) => toIdString(userId) === currentUserId.toString())),
  isShared: Boolean(currentUserId && post.sharedBy?.some((userId) => toIdString(userId) === currentUserId.toString())),
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
});

module.exports = {
  formatPost,
  formatComment,
};
