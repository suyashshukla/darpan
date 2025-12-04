import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { WebEditorComponent } from "../web-editor/web-editor.component";
import { NgClass } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";

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
        private changeDetectorRef: ChangeDetectorRef
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
                this.text = JSON.parse(atob(this.route.snapshot.queryParams['data']));
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
        this.shareButtonText = 'Copied!';
        const base64Data = btoa(JSON.stringify(this.text));
        const baseUrl = window.location.origin + window.location.pathname;
        const shareableLink = `${baseUrl}?data=${base64Data}`;
        navigator.clipboard.writeText(shareableLink);
        setTimeout(() => {
            this.shareButtonText = 'Share';
            this.changeDetectorRef.detectChanges();
            this.changeDetectorRef.markForCheck();
        }, 1000);
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