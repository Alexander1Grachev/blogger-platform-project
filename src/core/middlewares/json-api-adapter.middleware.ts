// чтобы принимать плоский 
import { Request, Response, NextFunction } from 'express';


function getResourceTypeFromUrl(url: string): string {
  if (url.includes('/blogs')) return 'blogs';
  if (url.includes('/posts')) return 'posts';
  return 'unknown';
}

export function jsonApiAdapterMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
    // Если это плоский JSON (нет data.attributes), оборачиваем в JSON:API
    if (req.body && !req.body.data && (req.body.name || req.body.title)) {
      const resourceType = getResourceTypeFromUrl(req.url);

      req.body = {
        data: {
          type: resourceType,
          attributes: req.body,
        },
      };

      console.log('🔧 JSON-API Adapter: transformed flat JSON to JSON:API');
    }

    // ДОБАВЛЯЕМ ЭТУ ЧАСТЬ ДЛЯ blogId ИЗ URL
    if (req.url.includes('/blogs/') && req.url.includes('/posts')) {
      const blogId = req.params.blogId;
      if (blogId && req.body.data?.attributes) {
        req.body.data.attributes.blogId = blogId;
        console.log('🔧 JSON-API Adapter: added blogId from URL:', blogId);
      }
    }

    // ДОБАВЛЯЕМ ЭТУ ЧАСТЬ ДЛЯ data.id В PUT ЗАПРОСАХ
    if (req.method === 'PUT' && req.params.id && req.body.data) {
      req.body.data.id = req.params.id;
      console.log('🔧 JSON-API Adapter: added data.id for PUT:', req.params.id);
    }
  }
  next();
}
//response-adapter.middleware.ts

interface JsonApiItem {
  id: string;
  type: string;
  attributes: Record<string, any>;
}

export function responseAdapterMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const originalSend = res.send;

  res.send = function (data: any) {
    // Если это JSON:API формат, преобразуем в плоский JSON
    if (data && typeof data === 'object' && data.data) {
      if (Array.isArray(data.data)) {
        // Для массивов: { data: [{type, id, attributes}, ...] }
        data = data.data.map((item: JsonApiItem) => ({
          id: item.id,
          ...item.attributes,
        }));
      } else if (data.data.attributes) {
        // Для одиночных объектов: { data: {type, id, attributes} }
        data = {
          id: data.data.id,
          ...data.data.attributes,
        };
      }
    }

    // ДОБАВЛЯЕМ ЭТУ ЧАСТЬ ДЛЯ ПАГИНАЦИИ
    // Если это GET запрос на списки и данные - массив, добавляем пагинацию
    if (req.method === 'GET' && Array.isArray(data) &&
      (req.url.includes('/blogs') || req.url.includes('/posts'))) {

      // Базовые значения пагинации (можно настроить под твою логику)
      const pageSize = 10;
      const pageNumber = 1;
      const totalCount = data.length;
      const pagesCount = Math.ceil(totalCount / pageSize);

      data = {
        pagesCount,
        page: pageNumber,
        pageSize,
        totalCount,
        items: data,
      };

      console.log('🔧 Response Adapter: added pagination structure');
    }

    return originalSend.call(this, data);
  };

  next();
}