import { NoteService } from './../../services/note.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { ErrorBlock } from 'src/app/models';
import { UserApiService } from 'src/app/services/user-api.service';
import { UserService } from 'src/app/services/user.service';
import { UserGQL } from 'src/app/models/user';

@Component({
  selector: 'app-user-settings-page',
  templateUrl: './user-settings-page.component.html',
  styleUrls: ['./user-settings-page.component.css'],
})
export class UserSettingsPageComponent implements OnInit {
  public wait: boolean;

  public form: FormGroup;
  public passwordHide: boolean;

  public error: ErrorBlock;

  private currentUser: UserGQL;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private userApiService: UserApiService,
    private userService: UserService,
    private noteService: NoteService
  ) {
    this.currentUser = this.userService.getUser();

    this.form = new FormGroup(
      {
        username: new FormControl(this.currentUser.username, {
          validators: [Validators.minLength(4)],

          updateOn: 'change',
        }),
        email: new FormControl(this.currentUser.email, {
          validators: [Validators.email],
          updateOn: 'change',
        }),
        password: new FormControl('', {
          validators: [Validators.minLength(6)],
          updateOn: 'change',
        }),
        confirmPassword: new FormControl('', {
          validators: [],
          updateOn: 'change',
        }),
      },
      {
        validators: [this.passwordsMatch('password', 'confirmPassword')],
      }
    );

    this.passwordHide = true;
  }

  ngOnInit(): void {}

  public async updateUser(): Promise<void> {
    try {
      if (this.formHasNoErrors()) {
        const dialogRef = this.dialog.open(ConfirmationModalComponent, {
          width: '250px',
        });
        const currentPassword = await dialogRef.afterClosed().toPromise();
        if (currentPassword) {
          this.wait = true;

          console.log(this.form.get('username').value, this.form.get('email').value);
          const newUser = await this.userApiService.update(
            this.form.get('username').value,
            this.form.get('email').value,
            this.form.get('password').value,
            currentPassword,
            window.localStorage.getItem('token')
          );
          console.log(newUser);
          this.userService.setUser(newUser);
          this.backToUser();
        }
      }
    } catch (error) {
      this.wait = false;

      this.error.message = error;
      this.error.type = 'error';
    }
  }

  public async deleteUser(): Promise<void> {
    try {
      if (this.formHasNoErrors()) {
        const dialogRef = this.dialog.open(ConfirmationModalComponent, {
          width: '250px',
        });
        const currentPassword = await dialogRef.afterClosed().toPromise();
        if (currentPassword) {
          this.wait = true;

          await this.userApiService.delete(currentPassword, window.localStorage.getItem('token'));

          this.logout();
        }
      }
    } catch (error) {
      this.wait = false;
      this.error.message = error;
      this.error.type = 'error';
    }
  }

  public formHasNoErrors(): boolean {
    return (
      !this.form.get('username').errors &&
      !this.form.get('email').errors &&
      !this.form.get('password').errors &&
      !this.form.get('confirmPassword').errors
    );
  }

  public backToUser(): void {
    this.router.navigate(['user']);
  }

  private passwordsMatch(passwordKey?: string, confirmPasswordKey?: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control) {
        return null;
      }
      const password = control.get(passwordKey);
      const confirmPassword = control.get(confirmPasswordKey);
      if (!password.value || !confirmPassword.value) {
        return null;
      }

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return null;
      } else {
        return null;
      }
    };
  }

  private logout(): void {
    this.userService.clearUser();
    this.noteService.clearNotes();
    this.router.navigate(['']);
  }
}
