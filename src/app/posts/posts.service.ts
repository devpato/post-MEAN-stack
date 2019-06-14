import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { error } from 'util';
import { stringify } from '@angular/compiler/src/util';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new BehaviorSubject<Post[]>(null);
  BASE_URL = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getPosts() {
    return this.http
      .get<{ message: string; posts: Post[] }>(this.BASE_URL + '/posts')
      .subscribe(res => {
        this.posts = res.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string }>(this.BASE_URL + '/posts', post)
      .subscribe(res => {
        console.log(res);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
