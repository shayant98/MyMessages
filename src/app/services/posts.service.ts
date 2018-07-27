import { Injectable } from '@angular/core';
import { Post } from "../models/Post.model";
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class PostsService {

  posts: Post[] = []
  postUpdated = new Subject<Post[]>()

  constructor(private http: HttpClient, private router: Router) { }


  getPosts(){
    // return [...this.posts]
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/post')
    .pipe(map(postData => {
      return postData.posts.map(post =>{
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imgPath: post.imgPath
        }
      })
    }))
    .subscribe(transformedPost => {
      this.posts = transformedPost;
      this.postUpdated.next([...this.posts])
    });
  }

  getPostsUpdateListener(){
    return this.postUpdated.asObservable()
  }

  getPost(id: string){;
    return this.http.get<{_id: string, title: string, content: string, imgPath: string}>('http://localhost:3000/api/post/'+id)
  }

  addPost(title: string, content: string, image: File){
    const postData = new FormData()
    postData.append("title", title)
    postData.append("content", content)
    postData.append("image", image, title)
    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/post', postData).subscribe(postData =>{
      const post: Post ={
        id: postData.post.id,
        title: title,
        content: content,
        imagePath: postData.post.imagePath
      }
      const id= postData.post.id
      post.id = id;
      console.log(postData);
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
      this.router.navigate(['/'])
    })

  }


  deletePost(postId: string){
    this.http.delete('http://localhost:3000/api/post/'+postId).subscribe(() => {
        const updatedPost = this.posts.filter(post => post.id !== postId)
        this.posts = updatedPost;
        this.postUpdated.next([...this.posts]);
    })
  }


  updatePost(id: string, title: string, content: string, image: File | string){
    //const post: Post = {id: id, title: title, content: content, imagePath: null}
    let postData: Post | FormData
    if(typeof(image) == 'object'){
      postData = new FormData()
      postData.append('id', id)
      postData.append('title', title)
      postData.append('content', content)
      postData.append('image', image, title)
    }else {
      postData = {
        id: id, 
        title: title, 
        content: content, 
        imagePath: image
      }
    }
    this.http.put('http://localhost:3000/api/post/'+id, postData).subscribe(res => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(postIndex => postIndex.id === id )
      const post: Post = {
        id: id, 
        title: title, 
        content: content, 
        imagePath: ''
      }
      updatedPosts[oldPostIndex] = post
      this.posts = updatedPosts
      this.postUpdated.next([...this.posts])
      console.log(this.posts);
      this.router.navigate(['/'])
      
    })
  }
}
