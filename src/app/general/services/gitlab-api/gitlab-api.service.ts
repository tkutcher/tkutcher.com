import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class GitlabApiService {
  constructor(private http: HttpClient) {}

  getProject(projectId: string | number) {
    return this.http.get(`https://gitlab.com/api/v4/projects/${projectId}`);
  }
}
