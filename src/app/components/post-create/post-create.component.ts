import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  newPost: string
  enteredValue: string

  constructor() { }

  ngOnInit() {
  }

  onAddPost(post: HTMLTextAreaElement){
    //console.dir(post);
    
    this.newPost = this.enteredValue
  }

}
