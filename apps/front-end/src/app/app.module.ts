import { ProgressBarModuleComponent } from './modules/progress-bar-module/progress-bar-module.component';
import { ConfirmationModalComponent } from './pages/user-settings-page/components/confirmation-modal/confirmation-modal.component';
import { UserSettingsPageComponent } from './pages/user-settings-page/user-settings-page.component';
import { DeleteConfirmationComponent } from './pages/note-edit-page/components/delete-confirmation/delete-confirmation.component';
import { NoteEditPageComponent } from './pages/note-edit-page/note-edit-page.component';
import { NotePreviewComponent } from './pages/user-page/components/note-preview/note-preview.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FrontPageComponent } from './pages/front-page/front-page.component';

import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GraphQLModule } from './graphql.module';
import { CustomNotificationComponent } from './modules/custom-notification/custom-notification.component';

@NgModule({
  declarations: [
    AppComponent,
    FrontPageComponent,
    UserPageComponent,
    CustomNotificationComponent,
    NotePreviewComponent,
    NoteEditPageComponent,
    DeleteConfirmationComponent,
    UserSettingsPageComponent,
    ConfirmationModalComponent,
    ProgressBarModuleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    BrowserAnimationsModule,
    GraphQLModule,
    MatDialogModule,
    MatProgressBarModule,
  ],
  exports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
