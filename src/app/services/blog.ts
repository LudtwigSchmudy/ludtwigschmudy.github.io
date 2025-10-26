import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../types';


@Injectable({
    providedIn: 'root'
})
export class BlogPost {
    private _blogSubject = new Subject<Post[]>();
    public blogPosts$ = this._blogSubject.asObservable();
    private blogPosts: Post[] = [];

    constructor() {
        this.getPosts()
            .then(blogPosts => blogPosts.map(bPost => ({ ...bPost, date: new Date(bPost.date) })))
            .then(blogPosts => blogPosts.sort((a, b) => b.date.getTime() - a.date.getTime()))
            .then((blogPosts: Post[]) => {
                this.blogPosts = blogPosts;
                this._blogSubject.next(this.blogPosts);
            });
    }
    
    async getPosts(): Promise<Post[]> {
        return (await fetch('/data/blog-posts.json')).json();
    }
    getAllPosts(): Post[] {
        return this.blogPosts;
    }
    getLatestPosts(count: number): Post[] {
        return this.blogPosts.slice(0, count);
    }
    updatePosts(): void {
        this._blogSubject.next(this.blogPosts);
    }
  
}
