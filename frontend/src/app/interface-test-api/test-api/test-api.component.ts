import { Component, OnInit } from '@angular/core';
import { TestApiService } from 'src/app/_services/test-api.service';
import {testModel} from "../../models/test-model";
import {MatDialog} from "@angular/material/dialog";
import {AddTestDialogComponent} from "./add-test-dialog/add-test-dialog.component";
import {DeleteTestDialogComponent} from "./delete-test-dialog/delete-test-dialog.component";
import {first} from "rxjs";
import {testModel2} from "../../models/testmodel2";
import {TestResponseModel} from "../../models/testResponseModel";

const fakeData  = [
   { id: '01', methode : 'Get', URL : 'http://localhost:61714/test-api',TDR : '0.3',status: '200'},
  { id: '01', methode : 'Get', URL : 'http://localhost:61714/test-api',TDR : '0.1',status: '200'},
  { id: '01', methode : 'Get', URL : 'http://localhost:61714/test-api',TDR : '0.01',status: '200'},
]
@Component({
  selector: 'app-test-api',
  templateUrl: './test-api.component.html',
  styleUrls: ['./test-api.component.css']
})
export class TestApiComponent implements OnInit {
  isPopupOpened =true;

  displayedColumns: string[] = ['id', 'method', 'apiUrl', 'responseTime', 'statusCode', 'responseStatus', 'action'];
  dataTests : testModel2[]  = [];
  listTestsReponses : TestResponseModel[]=[];


  constructor(
    private testApiService: TestApiService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getTestList()
//this.testApiService.tests$.subscribe((tests : testModel2 [])=>{this.dataTests=tests});


  }


  getTestList  () : void {
    this.testApiService.tests$.subscribe((tests : testModel2 [])=>{this.dataTests=tests});
      console.log('Formatted JSON Data:', JSON.stringify(this.dataTests, null, 2));
   }

  addTest() {
    this.isPopupOpened = true;
    const dialogRef = this.dialog.open(AddTestDialogComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      this.isPopupOpened = false;

       this.ngOnInit()

    });

  }
  deleteTest(id: string) {
    this.isPopupOpened = true;
    const dialogRef = this.dialog.open(DeleteTestDialogComponent, { data: id});
    dialogRef.afterClosed().subscribe(result => {
      this.isPopupOpened = false;

    });
  }

  exportCSV(): void {
    if (this.dataTests.length === 0) {
      return;
    }
    const separator = ',';
    const keys = Object.keys(this.dataTests[0]) as (keyof testModel)[];
    const csvContent =
      keys.join(separator) +
      '\n' +
      this.dataTests.map(item => {
        return keys.map(key => {
          return (item as any)[key];
        }).join(separator);
      }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'dataTests.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  lunchTests() {
    this.testApiService.executeTests(this.dataTests).subscribe((listTestsReponses: TestResponseModel[]) => {
      this.updateTestsStatusExecution(listTestsReponses);
    });
  }

  updateTestsStatusExecution(listTestsReponses: TestResponseModel[]) {
    console.log("========>", listTestsReponses);
    this.dataTests.forEach((test, index) => {
        this.dataTests[index] = { ...test, responseStatus: listTestsReponses[index].answer.toString() };
    });
    console.log("dataTests========>", this.dataTests);
    this.getTestList();
  }
}
