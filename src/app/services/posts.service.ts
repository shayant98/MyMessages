import { Injectable } from '@angular/core';
import { Post } from "../models/Post.model";
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PostsService {

  posts: Post[] = []
  postUpdated = new Subject<Post[]>()

  constructor(private http: HttpClient) { }


  getPost(){
    // return [...this.posts]
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/post').subscribe(postData => {
      this.posts = postData.posts
      this.postUpdated.next([...this.posts])
    });
  }

  getPostUpdateListener(){
    return this.postUpdated.asObservable()
  }

  addPost(title: string, content: string){
    const post: Post = {
      id: null,
      title: title,
      content: content
    }
    this.http.post<{message: string}>('http://localhost:3000/api/post', post).subscribe(postData =>{
      console.log(postData);
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
      
    })

  }
}
