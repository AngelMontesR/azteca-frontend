import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class EncryptService {

  constructor(private http: HttpClient) { }

  private apiUrl = `${environment.apiUrl}encrypt`;

  encrypt(nombre: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { nombre };
    return this.http.post(this.apiUrl, body, { headers });
  }


}
