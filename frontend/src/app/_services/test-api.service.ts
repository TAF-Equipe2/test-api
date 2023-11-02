import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {filter, Observable, Subject, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {testModel} from "../models/test-model";
import {testModel2} from "../models/testmodel2";

const AUTH_API = `${environment.apiUrl}/api/testapi/`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})

export class TestApiService {
  REST_API: string = environment.apiUrl
  constructor(private http: HttpClient) { }

  listTests : testModel2 []=[{
    "id": 1,
    "method": "POST",
    "apiUrl": "api.stm.info/pub/od/i3/v2/messages/etatservice",
    "responseTime": 0.1,
    "expectedOutput": "{[}",
    "statusCode": 200,
    "headers": {},
    "expectedHeaders": {}
  }];

  executeTests(dataTests : testModel2 []): Observable<any> {
    let API_URL = `${this.REST_API}/tests`; // a modifier selon le backend
    return this.http.post(API_URL,dataTests)
      .pipe(
        catchError(this.handleError)

      )
  }


  private userAddedSubject = new Subject<testModel2>();

  getTestList() : testModel2 []  {
    return this.listTests;

    // return this.http.get<testModel[]>(`${this.REST_API}/users/${id}`)// endpoint a modifier selon le backen
  }
  addTestOnList(newTest: testModel2){
    newTest.id= this.listTests.length+1;
    this.listTests.push(newTest);
    this.userAddedSubject.next(newTest);
    console.log("list test on service file"+JSON.stringify(this.listTests, null, 2));

  }

  testAdded$ = this.userAddedSubject.asObservable();

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
