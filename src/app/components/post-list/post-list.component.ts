import {
  Component,
  OnInit,
  Input,
  OnDestroy
} from '@angular/core';
import {
  Post
} from "../../models/Post.model";
import {
  PostsService
} from "../../services/posts.service";
import {
  Subscription
} from 'rxjs';
import { PageEvent } from '../../../../node_modules/@angular/material';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = []
  postsSub: Subscription;
  totalPosts: number = 0;
  postsPerPage: number = 1;
  currentPage = 1
  pageSizeOptions = [1,2,5,10];

  total
  constructor(private postsService: PostsService) {}
  isLoading: boolean = false
  ngOnInit() {
    this.isLoading = true
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostsUpdateListener().subscribe((postData: {posts: Post[], postCount: number})  => {
      this.totalPosts = postData.postCount
      this.isLoading = false
      this.posts= postData.posts
    })
  }


  onDelete(postId: string) {
    this.isLoading = true
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage)
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }



}
