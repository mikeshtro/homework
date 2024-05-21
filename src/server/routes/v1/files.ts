import { snapshot } from '@webcontainer/snapshot';
import { defineEventHandler } from 'h3';

export default defineEventHandler(() => snapshot('src/files'));
