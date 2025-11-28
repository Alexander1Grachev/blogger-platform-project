import request from 'supertest';
import { Express } from 'express';
import { TESTING_CLEAR_PATH } from '../../src/core/paths/paths';
import { HttpStatus } from '../../src/core/consts/http-statuses';

export async function clearDb(app: Express) {
  console.log('🔄 Attempting to clear DB...');

  const response = await request(app).delete(`${TESTING_CLEAR_PATH}/all-data`);

  console.log('📊 Response status:', response.status);
  console.log('📊 Response body:', response.body);

  if (response.status !== HttpStatus.NoContent) {
    console.error('❌ Unexpected response:', {
      status: response.status,
      body: response.body,
    });
  }

  return;
}
