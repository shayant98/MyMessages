import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from "../../models/Post.model";
import { PostsService } from "../../services/posts.service";

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  isloading =  false
  enteredTitle: string;
  enteredContent: string;
  private mode: string = 'create'
  private postId: string
  post: Post 
  form: FormGroup
  imagePreview: string

  constructor(private postService: PostsService,  private route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators:[Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null,{
        validators:[Validators.required]
      }),
      'image': new FormControl(null,{
        validators:[Validators.required]
      })

    })
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('id')){
        this.mode = 'edit'
        this.postId = paramMap.get('id')
        this.isloading = true
        this.postService.editPost(this.postId).subscribe(post => {
          this.isloading = false
          this.post = {
            id: post._id,
            title: post.title,
            content: post.content,
          }
          this.form.setValue({
            'title': this.post.title, 
            'content': this.post.content
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
      alert('Vul alles in!')
    }else{
      this.isloading = true
      if(this.mode === 'create'){
        this.postService.addPost(this.form.value.title, this.form.value.content)

      }else{
        this.postService.updatePost(this.postId,this.form.value.title, this.form.value.content);
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

}
