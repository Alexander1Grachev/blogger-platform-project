import { db } from '../../db/in-memory.db';
import { Post } from '../types/post';
import { PostInputDto } from '../dto/post-input-model';

export const postsReposytory = {
  findAll(): Post[] {
    return db.posts;
  },
  findById(id: string): Post | null {
    return db.posts.find((p) => p.id === id) ?? null;
  },
  create(newPost: Post): Post {
    db.posts.push(newPost);
    return newPost;
  },
  update(id: string, input: PostInputDto): void {
    const post = db.posts.find((p) => p.id === id) ?? null;

    if (!post) {
      throw new Error('Post not exist');
    }
    post.title = input.title;
    post.shortDescription = input.shortDescription;
    post.content = input.content;
    post.blogId = input.blogId;
    return;
  },

  delete(id: string): void {
    const index = db.posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Post not exist');
    }
    db.posts.splice(index, 1);
    return;
  },
};
