import { ResourceType } from '../../../core/consts/resource-type';
import { PostAttributes } from '../../application/dtos/post-attributes';

export type PostUpdateInput = {
  data: {
    type: ResourceType.Posts;
    id: string;
    attributes: PostAttributes;
  };
};
