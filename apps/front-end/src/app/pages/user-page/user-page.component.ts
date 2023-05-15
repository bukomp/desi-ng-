import { NotePreviewComponent } from './components/note-preview/note-preview.component';
import { NoteService } from './../../services/note.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Note } from 'src/app/models/note';
import { ErrorBlock } from 'src/app/models';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['../../app.component.css', './user-page.component.css'],
})
export class UserPageComponent implements OnInit {
  public name: string;
  public email: string;

  public notes: Note[];

  public onlyFavorites: boolean;

  public error: ErrorBlock;

  constructor(private router: Router, private userService: UserService, private noteService: NoteService) {}

  ngOnInit(): void {
    this.name = this.userService.getUser().username;
    this.notes = this.noteService.getNotes();
    this.onlyFavorites = false;
  }

  public logOut(): void {
    this.userService.clearUser();
    this.router.navigate(['']);
  }

  public switchFavStatus(): void {
    this.onlyFavorites = !this.onlyFavorites;
  }

  public createNewNote(): void {
    this.router.navigate(['note/create']);
  }

  public goToSettings(): void {
    this.router.navigate(['settings']);
  }
}
