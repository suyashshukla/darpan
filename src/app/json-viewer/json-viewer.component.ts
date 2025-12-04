import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { WebEditorComponent } from "../web-editor/web-editor.component";
import { NgClass } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { JsonDataSharing } from "../json-data-share.model";
import { JsonDataSharingService } from "../json-data-sharing.service";

@Component({
    selector: "app-json-viewer",
    templateUrl: "./json-viewer.component.html",
    standalone: true,
    imports: [WebEditorComponent, NgClass, RouterModule]
})
export class JsonViewerComponent implements OnInit {
    title = 'Darpan | JSON Viewer & Editor';
    text: any = {};
    isDarkMode: boolean = false;
    shareButtonText: string = 'Share';

    constructor(
        private route: ActivatedRoute,
        private changeDetectorRef: ChangeDetectorRef,
        private jsonDataSharingService: JsonDataSharingService
    ) { }

    ngOnInit(): void {
        if (this.route.snapshot.queryParams['data']) {
            this.readFromQueryParam();
        }
        else if (window.localStorage.getItem('jsonData')) {
            this.readFromLocalStorage();
        }

        this.setUserPreferences();
    }

    readFromQueryParam() {
        if (this.route.snapshot.queryParams['data']) {
            try {
                this.jsonDataSharingService.getJsonDataShareLink(this.route.snapshot.queryParams['data']).subscribe(response => {
                    this.text = JSON.parse(atob(response.content));
                }, error => {
                    this.readFromLocalStorage();
                });
            }
            catch (e) {
                this.readFromLocalStorage();
            }
        }
    }

    readFromLocalStorage() {
        try {
            if (window.localStorage.getItem('jsonData')) {
                this.text = JSON.parse(window.localStorage.getItem('jsonData')!);
            }
        }
        catch (e) {
            this.text = {};
        }
    }

    setUserPreferences() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.isDarkMode = true;
        }
        if (window.localStorage.getItem('isDarkMode')) {
            this.isDarkMode = window.localStorage.getItem('isDarkMode') === 'true';
        }
        else {
            window.localStorage.setItem('isDarkMode', this.isDarkMode.toString());
        }
    }

    generateShareableLink() {
        this.shareButtonText = 'Generating..';
        const base64Data = btoa(JSON.stringify(this.text));
        const baseUrl = window.location.origin + window.location.pathname;
        let shareableLink = `${baseUrl}?data=${base64Data}`;

        this.jsonDataSharingService.addJsonDataShareLink({
            content: base64Data
        }).subscribe(response => {
            this.shareButtonText = 'Generated!';
            shareableLink = `https://darpan.codiebe.com/json?data=${response.jsonShareId}`;
            navigator.clipboard.writeText(shareableLink);
            setTimeout(() => {
                this.shareButtonText = 'Share';
                this.changeDetectorRef.detectChanges();
                this.changeDetectorRef.markForCheck();
            }, 1000);
        });
    }

    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        window.localStorage.setItem('isDarkMode', this.isDarkMode.toString());
    }

    onTextChange(updatedText: string) {
        try {
            this.text = JSON.parse(updatedText);
        }
        catch (e) {
            this.text = JSON.parse('{}');
        }
        window.localStorage.setItem('jsonData', updatedText);
    }
}