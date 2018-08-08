import { NgModule } from '@angular/core';

import {RouterModule, Routes} from '@angular/router'
import { PostListComponent } from './components/post-list/post-list.component';
import { PostCreateComponent } from './components/post-create/post-create.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path:'',component:PostListComponent},
  {path:'create',component:PostCreateComponent, canActivate:[AuthGuard]},
  {path:'edit/:id',component:PostCreateComponent, canActivate:[AuthGuard]},
  {path:'auth', loadChildren: './auth.module#AuthModule'}
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuard
  ]
})
export class AppRoutingModule { }
