export interface RefreshTokenDbModel {
  refreshToken: string;  // сам JWT
  userId: string; // для связи с пользователем
  expiresAt: Date;   // когда токен истекает
  isRevoked: boolean;  // отметка, что токен больше не действителен
}