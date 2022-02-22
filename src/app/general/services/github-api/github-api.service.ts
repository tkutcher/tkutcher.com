import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class GithubApiService {
  constructor(private http: HttpClient) {}

  getRepoInfo(repo: string, owner: string = "tkutcher") {
    return this.http.get(`https://api.github.com/repos/${owner}/${repo}`);
  }
}
