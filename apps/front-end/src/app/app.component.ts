import { NoteService } from './services/note.service';
import { environment } from './../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { UserApiService } from './services/user-api.service';
import { UserService } from './services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private userService: UserService,
    private userApiService: UserApiService,
    private noteService: NoteService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      const token = localStorage.getItem('token');

      if (token) {
        const response = await this.userApiService.getUserData(token);

        if (!environment.production) {
          console.log(token);
          console.log(response);
        }

        this.noteService.setNotes(response.notes);
        delete response.notes;

        this.userService.setUser(response);

        this.router.navigate(['user']);
      }
    } catch (error) {
      if (!environment.production) {
        console.error(error);
      }
    }
  }
}
