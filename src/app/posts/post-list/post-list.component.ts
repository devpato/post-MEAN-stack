import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[];
  isLoading = false;
  private postsSub: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
    this.postListBuilder();
  }

  onDelete(id: string) {
    this.postsService.deletePost(id);
  }

  postListBuilder(): void {
    this.posts = [];
    this.postsService.getPosts();
    this.isLoading = true;
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe(data => {
        this.isLoading = false;
        console.log(data);
        this.posts = data;
      });
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}
