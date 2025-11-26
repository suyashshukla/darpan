import { Component, OnInit } from "@angular/core";
import { WebEditorComponent } from "../web-editor/web-editor.component";

@Component({
    selector: "app-json-viewer",
    templateUrl: "./json-viewer.component.html",
    standalone: true,
    imports: [WebEditorComponent]
})
export class JsonViewerComponent implements OnInit {

    ngOnInit(): void {
        if (window.localStorage.getItem('jsonData')) {
            this.text = JSON.parse(window.localStorage.getItem('jsonData')!);
        }
    }
    text: any = {};

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