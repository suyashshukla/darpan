import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { WebEditorComponent } from '../web-editor/web-editor.component';
import { NgClass } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { JsonDataSharingService } from '../json-data-sharing.service';
import { LoaderService } from '../loader.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-json-viewer',
  templateUrl: './json-viewer.component.html',
  standalone: true,
  imports: [WebEditorComponent, NgClass, RouterModule],
})
export class JsonViewerComponent implements OnInit {
  title = 'Darpan | JSON Viewer & Editor';
  inputText: any = {};
  outputText: any = {};
  isDarkMode: boolean = false;
  shareButtonText: string = 'Copy Link';
  modalRef: BsModalRef | null = null;
  shareableLink: string = '';

  @ViewChild('shareLinkModal') shareLinkModal!: TemplateRef<any>;
  @ViewChild('copyToClipboardTemplate') aboutModal!: TemplateRef<any>;

  constructor(
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private jsonDataSharingService: JsonDataSharingService,
    private loaderService: LoaderService,
    //private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.queryParams['data']) {
      this.readFromQueryParam();
    } else if (window.localStorage.getItem('jsonData')) {
      this.readFromLocalStorage();
    }

    this.setUserPreferences();
  }

  readFromQueryParam() {
    if (this.route.snapshot.queryParams['data']) {
      try {
        this.loaderService.showLoader();
        this.jsonDataSharingService
          .getJsonDataShareLink(this.route.snapshot.queryParams['data'])
          .subscribe({
            next: (response) => {
              this.inputText = JSON.parse(atob(response.content));
              this.loaderService.hideLoader();
              this.changeDetectorRef.detectChanges();
              this.changeDetectorRef.markForCheck();
            },
            error: (error) => {
              this.readFromLocalStorage();
              this.loaderService.hideLoader();
            },
          });
      } catch (e) {
        this.readFromLocalStorage();
        this.loaderService.hideLoader();
      }
    }
  }

  readFromLocalStorage() {
    try {
      if (window.localStorage.getItem('jsonData')) {
        this.inputText = this.outputText = JSON.parse(window.localStorage.getItem('jsonData')!);
      }
    } catch (e) {
      this.inputText = this.outputText = {};
    }
  }

  setUserPreferences() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.isDarkMode = true;
    }
    if (window.localStorage.getItem('isDarkMode')) {
      this.isDarkMode = window.localStorage.getItem('isDarkMode') === 'true';
    } else {
      window.localStorage.setItem('isDarkMode', this.isDarkMode.toString());
    }
  }

  generateShareableLink() {
    this.shareButtonText = 'Generating..';
    this.loaderService.showLoader();
    const base64Data = btoa(JSON.stringify(this.inputText));
    const baseUrl = window.location.origin + window.location.pathname;
    let shareableLink = `${baseUrl}?data=${base64Data}`;

    this.jsonDataSharingService
      .addJsonDataShareLink({
        content: base64Data,
      })
      .subscribe((response) => {
        this.shareButtonText = 'Generated!';
        shareableLink = `https://darpan.codiebe.com/json?data=${response.jsonShareId}`;
        this.shareableLink = shareableLink;
        this.copyToClipboard(shareableLink);
        setTimeout(() => {
          this.shareButtonText = 'Copy Link';
          this.loaderService.hideLoader();
          //this.modalRef = this.modalService.show(this.shareLinkModal);
          this.changeDetectorRef.detectChanges();
          this.changeDetectorRef.markForCheck();
        }, 1000);
      });
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    window.localStorage.setItem('isDarkMode', this.isDarkMode.toString());
  }

  onTextChange(updatedText: string) {
    try {
      this.outputText = JSON.parse(updatedText);
    } catch (e) {
      this.outputText = JSON.parse('{}');
    }
    window.localStorage.setItem('jsonData', updatedText);
  }
}
