import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { error } from 'util';
import { stringify } from '@angular/compiler/src/util';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new BehaviorSubject<Post[]>(null);
  BASE_URL = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getPosts() {
    return this.http
      .get<{ message: string; posts: any[] }>(this.BASE_URL + '/posts')
      .pipe(
        map(posts => {
          return posts.posts.map(post => {
            return { id: post._id, title: post.title, content: post.content };
          });
        })
      )
      .subscribe(res => {
        this.posts = res;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string; id: string }>(this.BASE_URL + '/posts', post)
      .subscribe(res => {
        console.log(res);
        post.id = res.id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(id: string) {
    this.http.delete(this.BASE_URL + '/posts/' + id).subscribe(() => {
      console.log('Post deleted');
      const UPDATED_POST = this.posts.filter(post => post.id !== id);
      this.postsUpdated.next([...UPDATED_POST]);
    });
  }
}
