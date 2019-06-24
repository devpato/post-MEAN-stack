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

  getPosts(postPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postPerPage}&page=${currentPage}`;
    return this.http
      .get<{ message: string; posts: any[] }>(
        this.BASE_URL + '/posts' + queryParams
      )
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

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    this.http
      .put(this.BASE_URL + '/posts/' + id, postData)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        console.log(response);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: ''
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.updatedUIandGoRedirect();
      });
  }

  updatedUIandGoRedirect(): void {
    this.postsUpdated.next([...this.posts]);
    this.router.navigate(['/']);
  }
}
