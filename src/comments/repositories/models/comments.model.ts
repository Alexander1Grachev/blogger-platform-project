export type CommentatorInfoView = {
  userId: string;
  userLogin: string;
};



export type Comment = {
  content: string;
  commentatorInfo: CommentatorInfoView;
  postId: string; // для фильтрации коментариев 
  createdAt: Date;
};