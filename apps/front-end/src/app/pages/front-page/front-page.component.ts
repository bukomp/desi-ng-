import { NoteService } from './../../services/note.service';
import { UserGQL } from '../../models/user';
import { UserService } from './../../services/user.service';
import { ErrorBlock } from './../../models/error';
import { UserApiService } from './../../services/user-api.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.css'],
})
export class FrontPageComponent implements OnInit {
  public form: FormGroup;

  public registration: boolean;

  public passwordHide: boolean;

  public error: ErrorBlock;

  public wait: boolean;

  constructor(
    private router: Router,
    private userApiService: UserApiService,
    private userService: UserService,
    private noteService: NoteService
  ) {}
  ngOnInit() {
    this.registration = false;
    this.passwordHide = true;
    this.wait = false;

    this.form = new FormGroup(
      {
        username: new FormControl('', {
          validators: [Validators.required],

          updateOn: 'change',
        }),
        email: new FormControl('', {
          validators: [Validators.required, Validators.email],
          updateOn: 'change',
        }),
        password: new FormControl('', {
          validators: [Validators.required],
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
  }

  public registerLoginSwitch() {
    this.registration = !this.registration;
    if (this.registration) {
      this.form.get('username').setValidators([Validators.required, Validators.minLength(4)]);
      this.form.get('password').setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('confirmPassword').setValidators([Validators.required]);
    } else {
      this.form.get('username').setValidators([Validators.required]);
      this.form.get('password').setValidators([Validators.required]);
      this.form.get('confirmPassword').setValidators([]);
    }
  }

  public async onLogin() {
    try {
      if (this.form.get('username').errors) {
        if (!environment.production) {
          console.log(this.form.get('username').errors);
        }
      } else if (this.form.get('password').errors) {
        if (!environment.production) {
          console.log(this.form.get('password').errors);
        }
      } else {
        const email: string = this.form.get('username').value.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/g)
          ? this.form.get('username').value.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/g)[0]
          : null;

        const username: string = email ? null : this.form.get('username').value;
        const password = this.form.get('password').value;

        if (!environment.production) {
          console.log(username, email, password);
        }

        this.wait = true;

        const response: UserGQL = await this.userApiService.login(username, email, password, null);

        this.noteService.setNotes(response.notes);
        delete response.notes;

        this.userService.setUser(response);

        this.router.navigate(['user']);
      }
    } catch (error) {
      setTimeout(() => {
        this.wait = false;
      }, 300);

      if (!environment.production) {
        console.error(error);
      }
      this.error = {
        message: error.message,
        type: 'error',
      };
    }
  }

  public async onRegister() {
    try {
      if (this.form.get('username').errors) {
        if (!environment.production) {
          console.log(this.form.get('username').errors);
        }
      } else if (this.form.get('email').errors) {
        if (!environment.production) {
          console.log(this.form.get('email').errors);
        }
      } else if (this.form.get('password').errors) {
        if (!environment.production) {
          console.log(this.form.get('password').errors);
        }
      } else if (this.form.get('confirmPassword').errors) {
        if (!environment.production) {
          console.log(this.form.get('confirmPassword').errors);
        }
      } else {
        const username = this.form.get('username').value;
        const email = this.form.get('email').value;
        const password = this.form.get('password').value;

        this.wait = true;

        const response = await this.userApiService.register(username, email, password);

        this.userService.setUser(response);

        this.router.navigate(['user']);
      }
    } catch (error) {
      setTimeout(() => {
        this.wait = false;
      }, 300);
      if (!environment.production) {
        console.error(error);
      }
      this.error = {
        message: error.message,
        type: 'error',
      };
    }
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
}
