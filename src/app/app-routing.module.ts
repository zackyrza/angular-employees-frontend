import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {InputComponent} from './input/input.component';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'input', component: InputComponent},
  {path: 'input/:id', component: InputComponent},
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
