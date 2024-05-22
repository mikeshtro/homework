import { ApplicationRef, enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { renderApplication } from '@angular/platform-server';
import '@angular/platform-server/init';

import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

import 'zone.js/node';

if (import.meta.env.PROD) {
  enableProdMode();
}

export function bootstrap(): Promise<ApplicationRef> {
  return bootstrapApplication(AppComponent, config);
}

export default async function render(url: string, document: string): Promise<string> {
  const html = await renderApplication(bootstrap, {
    document,
    url,
  });

  return html;
}
