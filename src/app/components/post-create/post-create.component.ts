import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from "../../models/Post.model";
import { PostsService } from "../../services/posts.service";

import { NgForm } from '@angular/forms';
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

  constructor(private postService: PostsService,  private route: ActivatedRoute) { }

  ngOnInit() {

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
        });
      }else {
        this.mode = 'create'
        this.postId = null
      }
    });
  }

  onSavePost(form: NgForm){
    if(form.valid == false){
      alert('Vul alles in!')
    }else{
      this.isloading = true
      if(this.mode === 'create'){
        this.postService.addPost(form.value.title, form.value.content)
        form.resetForm();
      }else{
        this.postService.updatePost(this.postId,form.value.title, form.value.content);

      }
      
  }
}

}
