import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: "app-web-editor",
    templateUrl: "./web-editor.component.html",
    standalone: true
})
export class WebEditorComponent implements OnInit {

    @Input() text: string = '{}';
    @Output() textChange = new EventEmitter<string>();

    ngOnInit() {
        const editor = (window as any).ace.edit("editor");
        editor.setValue(JSON.stringify(this.text), -1);
        editor.setTheme("ace/theme/monokai");
        editor.session.setMode("ace/mode/json");

        editor.on('change', () => {
            this.text = editor.getValue();
            this.textChange.emit(this.text);
            console.log("Updated:", this.text);
        });

        editor.session.setUseWrapMode(true);
    }
}