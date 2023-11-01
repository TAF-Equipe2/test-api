import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {testModel} from "../models/test-model";

const AUTH_API = `${environment.apiUrl}/microservice/testapi/`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class TestApiService {
  REST_API: string = environment.apiUrl
  constructor(private http: HttpClient) { }

  execute(method:string, apiUrl:string, statusCode:number, input:string, expectedOutput:string): Observable<any> {
    return this.http.post(AUTH_API + 'checkApi', {
         method: method,
         apiUrl: apiUrl,
         statusCode: statusCode,
         expectedOutput: expectedOutput,
         input: input,
    }, httpOptions);
  }
  getTestList() {
    const id =localStorage.getItem('idUser');// a modifier selon le backend

    return this.http.get<testModel[]>(`${this.REST_API}/users/${id}`)// endpoint a modifier selon le backen
  }

  getTest(testModel: testModel): Observable<any> {
    let API_URL = `${this.REST_API}/tests`; // a modifier selon le backend
    return this.http.post(API_URL,testModel)
      .pipe(
        catchError(this.handleError)

      )
  }

  addTest(testModel: testModel): Observable<any> {
    let API_URL = `${this.REST_API}/tests`;  // a modifier selon le backend
    return this.http.post(API_URL, testModel)
      .pipe(
        catchError(this.handleError)
      )
  }

  deleteTest(id: any){
    const url = `${this.REST_API}/test/${id}`; //  a modifier selon el backend
    return this.http.delete<testModel>(url).pipe(
      catchError(this.handleError)
    )

  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Handle client error
      errorMessage = error.error.message;
    } else {
      // Handle server error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
