import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Post } from "../../models/Post.model";
import { PostsService } from "../../services/posts.service";
import {mimeType} from './mime-type.validator'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from '../../../../node_modules/rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit,OnDestroy {
  isloading =  false
  enteredTitle: string;
  enteredContent: string;
  private mode: string = 'create'
  private postId: string
  post: Post 
  form: FormGroup
  imagePreview: string
  private authStatusSub: Subscription;
  constructor(private postService: PostsService,private authService: AuthService,  private route: ActivatedRoute) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getauthStateListener().subscribe(authStatus =>{
      this.isloading = false
    })

    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators:[Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null,{
        validators:[Validators.required]
      }),
      'image': new FormControl(null,{
        validators:[Validators.required],
        asyncValidators:[mimeType]
      })

    })
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('id')){
        this.mode = 'edit'
        this.postId = paramMap.get('id')
        this.isloading = true
        this.postService.getPost(this.postId).subscribe(post => {
          this.isloading = false
          this.post = {
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imgPath,
            creator: post.creator
          }
          this.form.setValue({
            'title': this.post.title, 
            'content': this.post.content,
            'image': this.post.imagePath
          })
        });
      }else {
        this.mode = 'create'
        this.postId = null
      }
    });
  }

  onSavePost(){
    if(this.form.valid == false){
      return;
    }else{
      this.isloading = true
      if(this.mode === 'create'){
        this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image)

      }else{
        this.postService.updatePost(this.postId,this.form.value.title, this.form.value.content, this.form.value.image);
      }
      this.form.reset();
      
  }
}

onImagePicked(event: Event){
  const file = (event.target as HTMLInputElement).files[0];
  this.form.patchValue({'image':file});
  this.form.get('image').updateValueAndValidity();
  const reader = new FileReader();
  reader.onload = () =>{
    this.imagePreview = reader.result;
  }
  reader.readAsDataURL(file)
}

ngOnDestroy(){
  this.authStatusSub.unsubscribe()
}

}
