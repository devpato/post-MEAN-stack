import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  private postId: string;
  post: Post;
  isLoading = false;
  imagePreview: string;
  form = new FormGroup({
    title: new FormControl(null, {
      validators: [Validators.required, Validators.minLength(3)]
    }),
    content: new FormControl(null, {
      validators: [Validators.required, Validators.minLength(3)]
    }),
    image: new FormControl(null, {
      validators: [Validators.required],
      asyncValidators: [mimeType]
    })
  });

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.formMode();
  }

  onSavePost(): void {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
      this.form.reset();
    } else {
      console.log('update');
      this.postsService.updatePost({
        id: this.postId,
        title: this.form.value.title,
        content: this.form.value.content
      });
    }
  }

  formMode(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(post => {
          this.post = post;
          this.isLoading = false;
          this.form.setValue({
            title: this.post.title,
            content: this.post.content
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
        this.post = { id: null, title: '', content: '' };
      }
    });
  }

  onImagePicked(event: Event): void {
    const FILE = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: FILE });
    this.form.get('image').updateValueAndValidity();
    const READER = new FileReader();
    READER.onload = () => {
      this.imagePreview = READER.result as string;
    };

    READER.readAsDataURL(FILE);
  }
}
