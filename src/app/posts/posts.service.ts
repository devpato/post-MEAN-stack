import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new BehaviorSubject<Post[]>(null);
  BASE_URL = 'http://localhost:5000/api';

  constructor(private http: HttpClient, private router: Router) {}

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

  getPost(id: string) {
    //return { ...this.posts.find(p => p.id === id) };
    return this.http
      .get<{ _id: string; title: string; content: string }>(
        this.BASE_URL + '/posts/' + id
      )
      .pipe(
        map(post => {
          return { id: post._id, title: post.title, content: post.content };
        })
      );
  }

  getPostUpdateListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string): void {
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string; id: string }>(this.BASE_URL + '/posts', post)
      .subscribe(res => {
        console.log(res);
        post.id = res.id;
        this.posts.push(post);
        this.updatedUIandGoRedirect();
      });
  }

  deletePost(id: string): void {
    this.http.delete(this.BASE_URL + '/posts/' + id).subscribe(() => {
      console.log('Post deleted');
      const UPDATED_POST = this.posts.filter(post => post.id !== id);
      this.postsUpdated.next([...UPDATED_POST]);
    });
  }

  updatePost(post: Post): void {
    this.http.put(this.BASE_URL + '/posts/' + post.id, post).subscribe(() => {
      const updatedPost = [...this.posts];
      const oldPostIndex = updatedPost.findIndex(p => p.id === post.id);
      updatedPost[oldPostIndex] = post;
      this.posts = updatedPost;
      this.updatedUIandGoRedirect();
    });
  }

  updatedUIandGoRedirect(): void {
    this.postsUpdated.next([...this.posts]);
    this.router.navigate(['/']);
  }
}
