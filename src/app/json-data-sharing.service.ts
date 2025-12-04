import { Injectable } from "@angular/core";
import { JsonDataSharing } from "./json-data-share.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root"
})
export class JsonDataSharingService {

    constructor(
        private httpClient: HttpClient
    ) { }

    getJsonDataShareLink(jsonDataSharingId: string): Observable<JsonDataSharing> {
        return this.httpClient.get<JsonDataSharing>(`https://backend.codiebe.com/json/${jsonDataSharingId}`, {
            headers: {
                'X-User-Email': 'suyash.s@keka.com',
            }
        });
    }

    addJsonDataShareLink(jsonDataShare: JsonDataSharing): Observable<JsonDataSharing> {
        return this.httpClient.post<JsonDataSharing>(`https://backend.codiebe.com/json`, jsonDataShare, {
            headers: {
                'X-User-Email': 'suyash.s@keka.com',
            }
        });
    }
}