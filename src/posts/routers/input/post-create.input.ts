import { ResourceType } from '../../../core/consts/resource-type';
import { PostAttributes } from '../../application/dtos/post-attributes';

export type PostCreateInput = {
  data: {
    type: ResourceType.Posts;
    attributes: PostAttributes;
  };
};
