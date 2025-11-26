import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: "app-web-editor",
    templateUrl: "./web-editor.component.html",
    standalone: true,
})
export class WebEditorComponent implements OnInit, AfterViewInit {


    @Input() text: string = '{}';
    @Input() slug: string = 'editor';
    @Input() isJsonViewerMode: boolean = false;
    @Output() textChange = new EventEmitter<string>();

    ngOnInit() {

    }

    ngAfterViewInit(): void {
        const editor = (window as any).ace.edit(this.slug);
        const data = this.isJsonViewerMode ? JSON.stringify(this.text, null, 2) : JSON.stringify(this.text);
        editor.setValue(data, -1);
        editor.setTheme("ace/theme/monokai");
        editor.session.setMode("ace/mode/json");

        editor.on('change', () => {
            this.text = editor.getValue();
            this.textChange.emit(this.text);
        });

        if (this.isJsonViewerMode) {
            this.configureJsonViewerMode(editor);
        }
        else {
            editor.setOptions({
                fontSize: "16px",
            });
        }

        editor.session.setUseWrapMode(true);
    }

    configureJsonViewerMode(editor: any) {
        editor.renderer.$cursorLayer.element.style.display = "none"; // hides cursor blinking

        editor.setOptions({
            readOnly: true,
            highlightActiveLine: false,
            highlightGutterLine: false,
            showPrintMargin: false,
            fontSize: "16px",
        });
    }
}