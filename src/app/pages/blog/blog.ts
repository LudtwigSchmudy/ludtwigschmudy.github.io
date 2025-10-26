import { Component, OnInit } from '@angular/core';
import { Post } from '../../types';
import { BlogPost } from '../../services/blog';
import { FullDateFormatPipe } from "../../pipes/full-date-format-pipe";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-blog',
  imports: [FullDateFormatPipe, MatIcon],
  templateUrl: './blog.html',
  styleUrl: './blog.scss'
})
export class Blog implements OnInit {
    posts!: Post[];

    constructor(private blogService: BlogPost) {
        blogService.blogPosts$.subscribe(() => {
            this.posts = blogService.getAllPosts();
        });
    }

    ngOnInit(): void {
        this.blogService.updatePosts();
    }
}
