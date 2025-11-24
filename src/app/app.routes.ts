import { Routes } from '@angular/router';
import { JsonViewerComponent } from './json-viewer/json-viewer.component';

export const routes: Routes = [
    {
        path: 'json',
        component: JsonViewerComponent
    },
    {
        path: '',
        redirectTo: 'json',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'json'
    }
];
