import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  @Output() postCreated= new EventEmitter();
   
  enteredTitle: string;
  enteredContent: string;

  constructor() { }

  ngOnInit() {
  }

  onAddPost(){
    const post = {
      title: this.enteredTitle,
      content: this.enteredContent
    }
    this.postCreated.emit(post)
  }

}
