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

    ngOnInit(): void {
        if (window.localStorage.getItem('jsonData')) {
            this.text = JSON.parse(window.localStorage.getItem('jsonData')!);
        }
    }
    text: any = {};
    isDarkMode: boolean = false;

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