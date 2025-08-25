// имитация базы данных (хранит данные в памяти приложения)
//Содержит объект db с коллекцией blogs 
// (аналогично было для posts в примере)

import { Blog } from '../blogs/types/blog';
import { Post } from '../posts/types/post';
export const db = {
    blogs: <Blog[]>[],
    posts: <Post[]>[],
}