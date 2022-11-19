import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/testapi/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})

export class TestApiService {

  constructor(private http: HttpClient) { }



execute(method:string, apiUrl :string , input :string , exceptedOutput:string): Observable<any> {

  return this.http.post(AUTH_API + 'ronin', {
       method : method,
       apiUrl : apiUrl,
       input:input,
       exceptedOutput:exceptedOutput
  }, httpOptions);
}
}
