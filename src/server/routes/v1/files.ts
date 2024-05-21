import { snapshot } from '@webcontainer/snapshot';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const folderSnapshot = await snapshot('src/files');

  return folderSnapshot;
});
