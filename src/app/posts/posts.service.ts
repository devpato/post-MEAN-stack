import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { error } from 'util';
import { stringify } from '@angular/compiler/src/util';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  BASE_URL = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getPosts() {
    return this.http.get<{ message: string; posts: Post[] }>(
      this.BASE_URL + '/posts'
    );
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
