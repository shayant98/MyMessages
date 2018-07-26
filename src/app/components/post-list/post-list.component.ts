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
posts: Post[] = []
postsSub : Subscription

  constructor(private postsService: PostsService) { }
  isLoading: boolean = false
  ngOnInit() {
    this.isLoading = true
    this.postsService.getPost();
     this.postsSub =  this.postsService.getPostUpdateListener().subscribe(posts =>{
       this.isLoading = false
      this.posts = posts
    },err =>{
      alert(err)
    })
  }


  onDelete(postId: string){
    this.postsService.deletePost(postId);
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }

  

}
