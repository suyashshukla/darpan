import { EventEmitter, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LoaderService {    
    private isLoaderVisible: boolean = false;
    loaderEmitter = new BehaviorSubject<boolean>(this.isLoaderVisible);

    constructor() {}

    showLoader() {
        this.isLoaderVisible = true;
        this.loaderEmitter.next(this.isLoaderVisible);
    }

    hideLoader() {
        this.isLoaderVisible = false;
        this.loaderEmitter.next(this.isLoaderVisible);
    }
}