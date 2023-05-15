import { UserSettingsPageComponent } from './pages/user-settings-page/user-settings-page.component';
import { NoteEditPageComponent } from './pages/note-edit-page/note-edit-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { FrontPageComponent } from './pages/front-page/front-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: FrontPageComponent },
  { path: 'user', component: UserPageComponent },
  { path: 'settings', component: UserSettingsPageComponent },
  { path: 'note/create', component: NoteEditPageComponent },
  { path: 'note/edit', component: NoteEditPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
