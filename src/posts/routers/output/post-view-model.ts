
export type PostViewModel = {
    id: string; // <-- Добавляем id только в ответ
    title: string;
    shortDescription: string;
    content: string;
    blogId: string; // <-- Добавляем id блога только в ответ
    blogName: string; // <-- Добавляем имя блога только в ответ
    createdAt: string; // <-- Меняем на строку
};
