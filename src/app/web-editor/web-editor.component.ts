import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";

@Component({
    selector: "app-web-editor",
    templateUrl: "./web-editor.component.html",
    standalone: true,
})
export class WebEditorComponent implements OnInit, OnChanges, AfterViewInit {



    @Input() text: any = {};
    @Input() slug: string = 'editor';
    @Input() isJsonViewerMode: boolean = false;
    @Output() textChange = new EventEmitter<string>();

    editor: any;

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.isJsonViewerMode && changes['text'] && !changes['text'].firstChange) {
            this.editor.setValue(JSON.stringify(this.text, null, 2), -1);
        }
    }

    ngAfterViewInit(): void {
        this.editor = (window as any).ace.edit(this.slug);
        const data = this.isJsonViewerMode ? JSON.stringify(this.text, null, 2) : JSON.stringify(this.text);
        this.editor.setValue(data, -1);
        this.editor.setTheme("ace/theme/monokai");
        this.editor.session.setMode("ace/mode/json");
        this.editor.on('change', () => {
            this.text = this.editor.getValue();
            this.textChange.emit(this.text);
        });

        if (this.isJsonViewerMode) {
            this.configureJsonViewerMode(this.editor);
        }
        else {
            this.editor.setOptions({
                fontSize: "16px",
            });
        }

        this.editor.session.setUseWrapMode(true);
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