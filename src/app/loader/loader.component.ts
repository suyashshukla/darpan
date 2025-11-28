import { Component, Input, NgZone, OnInit } from '@angular/core';
import { LoaderService } from '../loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  standalone: true,
})
export class LoaderComponent implements OnInit {

  @Input() message = 'Loading...';
  isLoading = false;

  constructor(
    private loaderService: LoaderService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.loaderService.loaderEmitter.subscribe((loading: boolean) => {
      this.zone.run(() => {
        this.isLoading = loading;
        console.log("Loader visibility changed:", this.isLoading);
      });
    });
  }
}