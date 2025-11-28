import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderService } from './loader.service';
import { LoaderComponent } from "./loader/loader.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('darpan | JSON Viewer & Editor');
  ngOnInit() {
  }
}
