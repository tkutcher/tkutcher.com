import { EventEmitter, Injectable } from '@angular/core';
import { IdGenService } from '../id-gen/id-gen.service';

export interface ITypeOptions {
  delay?: number;
  duration?: number;
  delayToClear?: number;
  clearAfter?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class TypewriterService {

  cb;
  typingSessionId;

  constructor(
    private idGenService: IdGenService
  ) {}

  clear() {
    this.cb ? this.cb('') : null;
    this.typingSessionId = -1;
  }

  type(s: string, cb: Function, options?: ITypeOptions) {
    const typingSpeed = options?.duration ? options.duration / s.length : 100;
    const delay = options?.delay ? options.delay : 0;
    const delayToClear = options?.delayToClear ? options.delayToClear : 500;

    const clearAfter = options?.clearAfter === null || options?.clearAfter === undefined ?
      true : options.clearAfter;

    this.typingSessionId = this.idGenService.nextId();
    this.cb = cb;
    const thisSession = this.typingSessionId;

    setTimeout(() => {
      for (let i = 0; i <= s.length; i++) {
        setTimeout(() => {
          if (thisSession === this.typingSessionId) {
            cb(s.substr(0, i))
          }
        }, typingSpeed * i);
      }
      if (clearAfter) {
        setTimeout(() => {
          if (thisSession === this.typingSessionId) {
            this.clear()
          }
        }, typingSpeed * s.length + delayToClear);
      }
    }, delay);
  }
}
