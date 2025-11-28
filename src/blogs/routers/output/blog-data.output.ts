import { ResourceType } from '../../../core/consts/resource-type';

export type BlogDataOutput = {
  type: ResourceType.Blogs;
  id: string;
  attributes: {
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
  };
};
