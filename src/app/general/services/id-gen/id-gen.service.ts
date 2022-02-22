import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class IdGenService {
  private num;

  constructor() {
    this.num = 0;
  }

  nextId() {
    const id = this.num;
    this.num += 1;
    return id;
  }
}
