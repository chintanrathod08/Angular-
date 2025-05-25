import { Routes } from '@angular/router';
import { UserComponent } from './pages/user/user.component';
import { DataBindingComponent } from './pages/data-binding/data-binding.component';

export const routes: Routes = [

    {
        path:'',
        redirectTo:'user',
        pathMatch:'full'
    },
    {
        path:"user",
        component: UserComponent
    },
    {
        path:"dataBinding",
        component: DataBindingComponent
    }
];
