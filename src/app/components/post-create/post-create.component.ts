import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from "../../models/Post.model";
import { PostsService } from "../../services/posts.service";

import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
   
  enteredTitle: string;
  enteredContent: string;

  constructor(private postService: PostsService) { }

  ngOnInit() {
  }

  onAddPost(form: NgForm){
    if(form.valid == false){
      alert('Vul alles in!')
    }else{
      this.postService.addPost(form.value.title, form.value.content)
      form.resetForm();
  }
}

}
