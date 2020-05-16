import { EventEmitter, Injectable } from '@angular/core';
import {
  ITypeOptions,
  TypewriterService
} from '../../general/services/typewriter/typewriter.service';


export interface IPromptStatus {
  code: number;
  name: string;
  kind: 'ok' | 'warning' | 'bad';
}



@Injectable({
  providedIn: 'root'
})
export class CmdPromptService {

  textChange: EventEmitter<string> = new EventEmitter<string>();
  statusChange: EventEmitter<IPromptStatus> = new EventEmitter<IPromptStatus>();
  pathChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private typewriter: TypewriterService
  ) {}

  clearPrompt() {
    this.typewriter.clear();
  }

  writeToPrompt(s: string, options?: ITypeOptions) {
    this.typewriter.type(s, (s) => this.textChange.emit(s), options);
  }

  setStatus(status: IPromptStatus) {
    this.statusChange.emit(status);
  }

  setPath(path: string) {
    this.pathChange.emit(path);
  }
}
