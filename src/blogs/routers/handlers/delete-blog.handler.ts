import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { BlogInputDto } from '../../dto/blog-input-model';
import { Blog } from '../../types/blog';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { blogsReposytory } from '../../reposytories/blogs.reposytories';
import { ValidationErrorType } from '../../../core/types/validationError';

export function deleteBlogHandler(
  req: Request<{ id: string }, void>,
  res: Response<{ errorMessages: ValidationErrorType[] } | void>, // ← Хэндлер получает данные от клиента
) {

  const id = req.params.id; // ← Хэндлер достает id из запроса
  const blog = blogsReposytory.findById(id); // ← Репозиторий ищет блог по id (доступ к данным)

  if (!blog) {
    res
      .status(HttpStatus.NotFound)
      .send(
        createErrorMessages([{ field: 'id', message: 'Blog not found' }]), // ← Бизнес-логика/валидация формирует ошибки
      );
    return;
  }

  blogsReposytory.delete(id); // ← Репозиторий удаляет объект по id
  res.sendStatus(HttpStatus.NoContent);// ← Хэндлер отправляет ничего клиенту http-уровень
}
