import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cmdPromptPathTruncate'
})
export class CmdPromptPathTruncatePipe implements PipeTransform {

  transform(url: string): unknown {
    return url.substr(0, 14);
  }

}
