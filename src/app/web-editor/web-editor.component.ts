import { NgClass } from "@angular/common";
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { LoaderService } from "../loader.service";
import * as XLSX from 'xlsx';

@Component({
    selector: "app-web-editor",
    templateUrl: "./web-editor.component.html",
    standalone: true,
    imports: [NgClass],
})
export class WebEditorComponent implements OnInit, OnChanges, AfterViewInit {

    @Input() text: any = {};
    @Input() slug: string = 'editor';
    @Input() isJsonViewerMode: boolean = false;
    @Input() isDarkMode: boolean = false;
    @Output() textChange = new EventEmitter<string>();

    editor: any;
    isExpanded: boolean = true;
    copyButtonText: string = 'Copy JSON';
    pasteButtonText: string = 'Paste JSON';

    constructor(
        private loaderService: LoaderService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['text'] && !changes['text'].firstChange) {
            this.editor.setValue(JSON.stringify(this.text, null, 2), -1);
        }

        if (this.isDarkMode && changes['isDarkMode'] && changes['isDarkMode'].currentValue && !changes['isDarkMode'].firstChange) {
            this.editor.setTheme("ace/theme/monokai");
        }
        else if (!this.isDarkMode && changes['isDarkMode'] && !changes['isDarkMode'].currentValue && !changes['isDarkMode'].firstChange) {
            this.editor.setTheme("ace/theme/chrome");
        }
    }

    ngAfterViewInit(): void {
        this.editor = (window as any).ace.edit(this.slug);
        const data = this.isJsonViewerMode ? JSON.stringify(this.text, null, 2) : JSON.stringify(this.text);
        this.editor.setValue(data, -1);
        this.editor.setTheme(this.isDarkMode ? "ace/theme/monokai" : "ace/theme/chrome");
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

    expandAll() {
        this.editor.session.unfold();
        this.isExpanded = true;
    }

    collapseAll() {
        this.editor.session.foldAll(1);
        this.isExpanded = false;
    }

    minifyContent() {
        try {
            const jsonContent = JSON.parse(this.editor.getValue());
            const minifiedContent = JSON.stringify(jsonContent);
            this.editor.setValue(minifiedContent, -1);
        }
        catch (e) {
            // do nothing
        }
    }

    prettyPrintContent() {
        try {
            const jsonContent = JSON.parse(this.editor.getValue());
            const prettyContent = JSON.stringify(jsonContent, null, 2);
            this.editor.setValue(prettyContent, -1);
        }
        catch (e) {
            // do nothing
        }
    }

    downloadContent() {
        this.loaderService.showLoader();
        const element = document.createElement('a');
        const file = new Blob([this.editor.getValue()], { type: 'application/json' });
        element.href = URL.createObjectURL(file);
        const fileName = this.generateUUID();
        element.download = `${fileName}.json`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        document.body.removeChild(element);
        this.loaderService.hideLoader();
    }

    pasteFromClipboard() {
        this.pasteButtonText = 'Pasted!';
        navigator.clipboard.readText().then(
            clipText => this.editor.setValue(this.getJsonContent(clipText), -1));
        setTimeout(() => {
            this.pasteButtonText = 'Paste JSON';
            this.changeDetectorRef.detectChanges();
            this.changeDetectorRef.markForCheck();
        }, 1000);
    }

    getJsonContent(data: any) {
        try {
            return JSON.stringify(JSON.parse(data));
        }
        catch (e) {
            return '{}';
        }
    }

    copyToClipboard() {
        const textToCopy = this.editor.getValue();
        navigator.clipboard.writeText(textToCopy);
        this.copyButtonText = 'Copied!';
        setTimeout(() => {
            this.copyButtonText = 'Copy JSON';
            this.changeDetectorRef.detectChanges();
            this.changeDetectorRef.markForCheck();
        }, 1000);
    }

    generateExcel() {
        this.loaderService.showLoader();
        let jsonData = this.editor.getValue();
        const isJsonArray = Array.isArray(JSON.parse(jsonData));
        if (!isJsonArray) {
            jsonData = `[${jsonData}]`;
        }
        const worksheet = XLSX.utils.json_to_sheet(JSON.parse(jsonData));
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        const element = document.createElement('a');
        element.href = URL.createObjectURL(data);
        const fileName = this.generateUUID();
        element.download = `${fileName}.xlsx`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        this.loaderService.hideLoader();
    }

    generateUUID() {
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });

        return uuid;
    }

    resetView() {
        this.editor.setValue('{}', -1);
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