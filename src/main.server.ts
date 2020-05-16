import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';

const domino = require('domino');
const fs = require('fs');
const path = require('path');


if (environment.production) {
  enableProdMode();
}

// FIXME - just living with the error for now.
// Use the browser index.html as template for the mock window
const template = fs.readFileSync(path.join(__dirname, '..', 'browser', 'index.html')).toString();

// Shim for the global window and document objects.
const window = domino.createWindow(template);
// Ignite UI browser objects abstractions

(global as any).window = window;
(global as any).document = window.document;
(global as any).Event = window.Event;
(global as any).KeyboardEvent = window.KeyboardEvent;
(global as any).MouseEvent = window.MouseEvent;
(global as any).FocusEvent = window.FocusEvent;
(global as any).PointerEvent = window.PointerEvent;
(global as any).HTMLElement = window.HTMLElement;
(global as any).HTMLElement.prototype.getBoundingClientRect = () => {
    return {
      left: '',
      right: '',
      top: '',
      bottom: ''
  };
};

// Other optional depending on your application configuration
(global as any).object = window.object;
(global as any).navigator = window.navigator;
(global as any).localStorage = window.localStorage;
(global as any).DOMTokenList = window.DOMTokenList;

export { AppServerModule } from './app/app.server.module';
export { renderModule, renderModuleFactory } from '@angular/platform-server';
