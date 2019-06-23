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
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath
            };
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
      .get<{ _id: string; title: string; content: string; imagePath: string }>(
        this.BASE_URL + '/posts/' + id
      )
      .pipe(
        map(post => {
          return {
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath
          };
        })
      );
  }

  getPostUpdateListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File): void {
    const POST_DATA = new FormData();
    POST_DATA.append('title', title);
    POST_DATA.append('content', content);
    POST_DATA.append('image', image, title);
    console.log('new post');
    this.http
      .post<{ message: string; post: Post }>(
        this.BASE_URL + '/posts',
        POST_DATA
      )
      .subscribe(res => {
        const post: Post = {
          id: res.post.id,
          title: title,
          content: content,
          imagePath: res.post.imagePath
        };
        this.posts.push(post);
        this.updatedUIandGoRedirect();
      });
  }

  deletePost(id: string): void {
    this.http.delete(this.BASE_URL + '/posts/' + id).subscribe(() => {
      console.log('Post deleted');
      const UPDATED_POST = this.posts.filter(post => post.id !== id);
      console.log(id);
      this.posts = UPDATED_POST;
      this.postsUpdated.next([...this.posts]);
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
