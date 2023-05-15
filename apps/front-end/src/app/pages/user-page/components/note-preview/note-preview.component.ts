import { NoteService } from './../../../../services/note.service';
import { NoteApiService } from './../../../../services/note-api.service';
import { Note } from 'src/app/models/note';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-note-preview',
  templateUrl: './note-preview.component.html',
  styleUrls: ['./note-preview.component.css'],
})
export class NotePreviewComponent implements OnInit {
  @Input() public note: Note;

  constructor(private router: Router, private noteService: NoteService, private noteApiService: NoteApiService) {}

  ngOnInit(): void {}

  public async editNote(): Promise<void> {
    this.router.navigate(['note/edit'], {
      state: {
        note: this.note,
      },
    });
  }

  public async switchFavStatus(): Promise<void> {
    try {
      this.note.favorite = !this.note.favorite;
      const token = window.localStorage.getItem('token');
      this.noteService.setNote(this.note.id, this.note);

      this.note = await this.noteApiService.update(token, null, null, this.note.id, this.note.favorite);
    } catch (error) {
      throw error;
    }
  }
}
