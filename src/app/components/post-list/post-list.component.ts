import {
  Component,
  OnInit,  OnDestroy
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
import {
  PageEvent
} from '@angular/material';
import {
  AuthService
} from '../../services/auth.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = []
  postsSub = new Subscription();
  userIsAuthenticated: boolean = false
  private authStateListenerSubs = new Subscription();
  totalPosts: number = 0;
  postsPerPage: number = 1;
  currentPage = 1
  pageSizeOptions = [1, 2, 5, 10];
  userId: string
  
  constructor(private postsService: PostsService, private authService: AuthService) {}

  isLoading: boolean = false
  ngOnInit() {
    this.isLoading = true //spinner show
    this.userIsAuthenticated = this.authService.getIsAuth() //check ig user is authenticated
    this.userId = this.authService.getUserId() //get userid
    this.authStateListenerSubs = this.authService.getauthStateListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated; //check if user authentication status(is logged in or not logged in)
      this.userId = this.authService.getUserId() // check if user id has changed
    });
    this.postsService.getPosts(this.postsPerPage, this.currentPage); //get posts to display anf pass maxposts per page and the currentpage(1)
    this.postsSub = this.postsService.getPostsUpdateListener().subscribe((postData: {
      posts: Post[], //check if posts have changed
      postCount: number //update post number on change
    }) => {
      this.totalPosts = postData.postCount 
      this.isLoading = false //spinner hide
      this.posts = postData.posts
    })
  }


  onDelete(postId: string) {
    this.isLoading = true //spinner show
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage)
    });

  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStateListenerSubs.unsubscribe();
  }



}
