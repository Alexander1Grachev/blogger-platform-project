
import { ObjectId } from 'mongodb';

export type Post = {
  //  id: string; <-- генерируем сервером, как и лоя блог
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId; //<-- ссылка. идентификатор, не данные иначе 
  // blogName: string; <-- имя достаем из единственного источника истины, не дублируем хранение в пост
  createdAt: Date;
};
