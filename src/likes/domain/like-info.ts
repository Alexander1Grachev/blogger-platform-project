export type LikeInfoView = {
    likesCount: number;
    dislikesCount: number;
}

export const likeInfoSchema = ({
    likesCount: { type: Number, required: true, default: 0 },
    dislikesCount: { type: Number, required: true, default: 0 },
})

export type NewestLike = {
  addedAt: Date,
  userId: string,
  login: string,
}
