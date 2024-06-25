import { Inject, Injectable } from '@angular/core';
import { Post } from '../models/post';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { AuthService } from './auth.service';
import { EMPTY, catchError, map, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private url = "http://localhost:3100/api/post"

  constructor(private http: HttpClient, private authenticationService: AuthService, @Inject(DOCUMENT) private document: Document) { }

  sendPost(post: Post) {
    if(!this.authenticationService.isLoggedIn()) {
      return throwError(() => new Error("Not logged in"));
    }

    return this.http.post(
      this.url,
      post
    ).pipe(
      catchError(err => {
        return throwError(() => new Error("Something went wrong"))
      }),
      map(result => {
        return true;
      })
    );
  }
}
