import { Injectable } from '@angular/core';
import { Post } from "../models/Post.model";
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  posts: Post[] = []
  postUpdated = new Subject<Post[]>()

  constructor() { }


  getPost(){
    return [...this.posts]
  }

  getPostUpdateListener(){
    return this.postUpdated.asObservable()
  }

  addPost(title: string, content: string){
    const post: Post = {
      title: title,
      content: content
    }
    this.posts.push(post);
    this.postUpdated.next([...this.posts]);
  }
}
