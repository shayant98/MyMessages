import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from "../../models/Post.model";
import { PostsService } from "../../services/posts.service";
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {
  //     title:'Title 1',
  //     content: 'Content 1'
  //   },
  //   {
  //     title:'Title 2',
  //     content: 'Content 3'
  //   },
  //   {
  //     title:'Title 3',
  //     content: 'Content 3'
  //   }

  // ]



posts: Post[] = []
postsSub : Subscription

  constructor(private postsService: PostsService) { }

  ngOnInit() {

    this.postsService.getPost();
     this.postsSub =  this.postsService.getPostUpdateListener().subscribe(posts =>{
      this.posts = posts
    },err =>{
      alert(err)
    })
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }

}
