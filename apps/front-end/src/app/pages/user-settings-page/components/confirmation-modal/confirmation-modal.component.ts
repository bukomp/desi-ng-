import { UserApiService } from './../../../../services/user-api.service';
import { FormControl, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModalComponent implements OnInit {
  public passwordControl: FormControl;
  public wait: boolean;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    private userApiService: UserApiService,
    private userService: UserService
  ) {
this.passwordControl = new FormControl('', {
      validators: [Validators.required],
    });
  }

  ngOnInit(): void {
    this.wait = false;

  }

  async onYes(): Promise<void> {
    try {
      this.wait = true;
      await this.userApiService.checkPassword(this.userService.getUser().username, undefined, this.passwordControl.value);
      this.dialogRef.close(this.passwordControl.value);
    } catch (error) {
      this.wait = false;
      this.passwordControl.setErrors({ incorrect: true });
    }
  }

  onNo(): void {
    this.dialogRef.close(false);
  }
}
