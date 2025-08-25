import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { BlogInputDto } from '../../dto/blog-input-model';
import { Blog } from '../../types/blog';
import { blogsReposytory } from '../../reposytories/blogs.reposytories';
import { db } from '../../../db/in-memory.db';

export function createBlogHandler(
  req: Request<{}, {}, BlogInputDto>,// ← Хэндлер получает данные от клиента
  res: Response,
) {
    // ↓ Сейчас тут все смешано
  const newBlog: Blog = {
    id: db.blogs.length // ← Генерация id задача репозитория, НЕ хэндлера
      ? String(Number(db.blogs[db.blogs.length - 1].id) + 1)
      : '1', 
      // ↓ бизнес логика - задача сервиса:
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,// ← Генерация url обычно на сервере, учебный на клиенте получается. Задача сервиса (логика построения url на основе бизнес-правил)
  };

  blogsReposytory.create(newBlog);  // ← Репозиторий сохраняет объект, добавляет id, возвращает готовый блог
  res.status(HttpStatus.Created).send(newBlog); // ← Хэндлер отправляет готовый объект клиенту
}
