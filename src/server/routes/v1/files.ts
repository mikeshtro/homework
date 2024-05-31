import { snapshot } from '@webcontainer/snapshot';
import { createError, defineEventHandler, getQuery } from 'h3';

export default defineEventHandler(async event => {
  const { path } = getQuery(event);
  if (typeof path === 'string') {
    try {
      return snapshot(`src/files/${path}`);
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid path parameter',
      });
    }
  }
  throw createError({
    statusCode: 400,
    statusMessage: 'Invalid path parameter',
  });
});
