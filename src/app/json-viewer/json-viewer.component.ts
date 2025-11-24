import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from "@angular/core";
import { WebEditorComponent } from "../web-editor/web-editor.component";
import { NgxJsonViewerComponent, NgxJsonViewerModule } from "ngx-json-viewer";

@Component({
    selector: "app-json-viewer",
    templateUrl: "./json-viewer.component.html",
    standalone: true,
    imports: [WebEditorComponent, NgxJsonViewerModule]
})
export class JsonViewerComponent implements OnInit {

    ngOnInit(): void {
        if(window.localStorage.getItem('jsonData')) {
            this.text = JSON.parse(window.localStorage.getItem('jsonData')!);
        }
    }
    text: string = '{}';

    onTextChange(updatedText: string) {
        this.text = JSON.parse(updatedText);
        window.localStorage.setItem('jsonData', updatedText);
    }
}