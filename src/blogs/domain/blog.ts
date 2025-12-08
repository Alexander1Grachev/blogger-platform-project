



export type Blog = {
    // id: string; <- уникальный тип данных ObjectId генерируется сам
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date;     // ISO string ($date-time)
    isMembership: boolean; 
};



