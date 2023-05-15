import { DeleteConfirmationComponent } from './components/delete-confirmation/delete-confirmation.component';
import { NoteApiService } from './../../services/note-api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { NoteService } from 'src/app/services/note.service';
import { Note } from 'src/app/models/note';
import { ErrorBlock } from 'src/app/models';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-note-edit-page',
  templateUrl: './note-edit-page.component.html',
  styleUrls: ['./note-edit-page.component.css'],
})
export class NoteEditPageComponent implements OnInit {
  public note: Note;

  public header;

  public error: ErrorBlock;

  public wait: boolean;

  private editMode: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private noteService: NoteService,
    private noteApiService: NoteApiService,
    private dialog: MatDialog
  ) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        if (this.router.getCurrentNavigation().extras.state.note) {
          const noteToEdit: Note = this.router.getCurrentNavigation().extras.state.note;
          this.note = JSON.parse(JSON.stringify(noteToEdit));
          this.editMode = true;
        }
      }
      if (!this.note) {
        this.note = {
          header: '',
          content: '',
          favorite: false,
        };
        this.editMode = false;
      }
    });
    this.wait = false;
  }

  async ngOnInit(): Promise<void> {}

  public async saveNote(): Promise<void> {
    try {
      if (this.note.header !== '') {
        this.wait = true;
        if (this.editMode) {
          const newNote: Note = await this.noteApiService.update(
            window.localStorage.getItem('token'),
            this.note.header,
            this.note.content,
            this.note.id,
            this.note.favorite
          );
          this.noteService.setNote(this.note.id, newNote);
          this.wait = false;
        } else {
          const newNote: Note = await this.noteApiService.create(
            window.localStorage.getItem('token'),
            this.note.header,
            this.note.content,
            this.note.favorite
          );
          this.noteService.addNote(newNote);
          this.wait = false;

          this.backToUser();
        }
      }
    } catch (error) {
      this.wait = false;

      this.error.message = error.message;
      this.error.type = 'error';
    }
  }

  public async removeNote(): Promise<void> {
    try {
      const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        width: '250px',
      });
      const confirm = await dialogRef.afterClosed().toPromise();
      this.wait = true;

      if (confirm) {
        if (this.editMode) {
          await this.noteApiService.delete(window.localStorage.getItem('token'), this.note.id);
          this.noteService.removeNote(this.note.id);
        }
        this.wait = false;

        this.backToUser();
      }
      this.wait = false;
    } catch (error) {
      this.wait = false;

      this.error.message = error.message;
      this.error.type = 'error';
    }
  }

  public onFav(): void {
    this.note.favorite = !this.note.favorite;
  }

  public backToUser(): void {
    this.router.navigate(['user']);
  }
}
