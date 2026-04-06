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
  isOwner: Boolean(currentUserId && post.author?._id?.toString() === currentUserId.toString()),
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
});

module.exports = {
  formatPost,
};
