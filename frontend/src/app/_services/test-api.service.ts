import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject,  Observable, Subject, throwError} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {testModel} from "../models/test-model";
import {testModel2} from "../models/testmodel2";
import {forkJoin} from "rxjs";



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})

export class TestApiService {
  REST_API: string = environment.apiUrl
  constructor(private http: HttpClient) { }

  listTests : testModel2 []=[];
  listTestsExecuted : any ;

  /* executeTests(dataTests : testModel2 []): Observable<any[]> {
    const observables: Observable<any> []=  dataTests.map(test =>{
      return this.http.post(`${this.REST_API}/tests/`,test)
        .pipe(
          catchError(this.handleError)
        );
    });
    return forkJoin(observables).pipe(
      map(responses => {

        return responses;
      })
    );
  } */

  executeTests (dataTests : testModel2 [])  {
    for (let i=0; i < dataTests.length; i++){

      const test = dataTests[i];
      const testExecuted  = this.http.post(`${this.REST_API}/tests/`,test);
      this.listTestsExecuted.push(testExecuted);
    }
    return this.listTestsExecuted

  }




  private testsSubject: BehaviorSubject<testModel2[]> = new BehaviorSubject<testModel2[]>([]);
  tests$ : Observable<testModel2[]> = this.testsSubject.asObservable();

  addTestOnList(newTest: testModel2){
    newTest.id= this.listTests.length+1;
    this.listTests.push(newTest);
    this.testsSubject.next([...this.listTests]);
    console.log("list test on service file"+JSON.stringify(this.listTests, null, 2));

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
