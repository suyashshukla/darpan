import { Injectable } from "@angular/core";
import { Ursho } from "./ursho.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root"
})
export class UrshoService {

    constructor(
        private httpClient: HttpClient
    ) { }

    generateUrshoLink(ursho: Ursho): Observable<Ursho> {
        return this.httpClient.post<Ursho>('https://backend.codiebe.com/ursho/generate', ursho, {
            headers: {
                'X-User-Email': 'suyash.s@keka.com',
            }
        });
    }
}