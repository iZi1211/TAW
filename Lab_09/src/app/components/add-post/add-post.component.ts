import { Component, OnInit } from '@angular/core';
import { PlaceholderImageDirective } from '../../directives/placeholder-image.directive';
import { FormsModule } from '@angular/forms';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { error } from 'console';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [PlaceholderImageDirective, FormsModule, CommonModule],
  providers: [PostService],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css'
})
export class AddPostComponent implements OnInit{
  public post: Post = {
    title: '',
    text: '',
    image: ''
  }

  public wasSent = false;
  public errorMessage = ""

  constructor(public postService: PostService, private router: Router) {}
  ngOnInit(): void {}

  send() {
    this.postService.sendPost(this.post).pipe(
      catchError(error => {
        console.error(error);
        this.errorMessage = error.message
        return of(false);
      })
    ).subscribe(result => {
      console.log("Post added")
      this.wasSent = true;
      this.post = {
        title: '',
        text: '',
        image: ''
      }
    });
  }



  handleError(error: Error) {
    return of(false)
  }
}
