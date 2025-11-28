import { Component, OnInit } from "@angular/core";
import { WebEditorComponent } from "../web-editor/web-editor.component";
import { NgClass } from "@angular/common";

@Component({
    selector: "app-json-viewer",
    templateUrl: "./json-viewer.component.html",
    standalone: true,
    imports: [WebEditorComponent, NgClass]
})
export class JsonViewerComponent implements OnInit {
    title = 'Darpan | JSON Viewer & Editor';
    text: any = {};
    isDarkMode: boolean = false;
    ngOnInit(): void {
        if (window.localStorage.getItem('jsonData')) {
            this.text = JSON.parse(window.localStorage.getItem('jsonData')!);
        }
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