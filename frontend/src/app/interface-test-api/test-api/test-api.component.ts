import { Component, OnInit } from '@angular/core';
import { TestApiService } from 'src/app/_services/test-api.service';
import {testModel} from "../../models/test-model";
import {MatDialog} from "@angular/material/dialog";
import {AddTestDialogComponent} from "./add-test-dialog/add-test-dialog.component";
import {DeleteTestDialogComponent} from "./delete-test-dialog/delete-test-dialog.component";

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
  name: any;
  displayedColumns: string[] = ['id', 'methode ', 'URL', 'TDR', 'status', 'action'];

  form: any = {
    method: "get",
    apiUrl: "",
    input: "",
    expectedOutput: "",
    statusCode:200
  };

  methods: any [] = [
    { id: "get", name: 'Get' },
    { id: "head", name: 'Head' },
    { id: "post", name: 'Post' },
    { id: "put", name: 'Put' },
    { id: "delete", name: 'Delete' },
    { id: "options", name: 'Options' },
    { id: "patch", name: 'Patch' },
  ];
  //dataTests : testModel [] = [];
  dataTests = fakeData;




  answer ="";
  isResponse =false;
  statusCode :any;


  constructor(
    private testApiService: TestApiService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getTestsList();
  }

  getTestsList(): void{
    this.dataTests ;
    /*setTimeout(() => {
      this.projectsService.getTestList()
      .pipe(first())
      .subscribe(projects => this.dataTests = tests);
    }, 300);
    */
  }

  deleteProject(id: string) {
    this.isPopupOpened = true;
    const dialogRef = this.dialog.open(DeleteTestDialogComponent, { data: id});
    dialogRef.afterClosed().subscribe(result => {
      this.isPopupOpened = false;
      this.getTestsList();
    });
  }

  onSubmit(): void {
    const { method, apiUrl, statusCode, input, expectedOutput } = this.form;
    this.testApiService.execute(method, apiUrl, statusCode, input, expectedOutput).subscribe({
      next: data => {
        this.isResponse = true;
        this.answer = data.answer;
        this.statusCode = JSON.stringify(data.statusCode);
      },
      error: err => {
      }
    });
  }

  addTest() {
    this.isPopupOpened = true;
    const dialogRef = this.dialog.open(AddTestDialogComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      this.isPopupOpened = false;
      this.getTestsList();
    });

  }
  deleteTest(id: string) {
    this.isPopupOpened = true;
    const dialogRef = this.dialog.open(DeleteTestDialogComponent, { data: id});
    dialogRef.afterClosed().subscribe(result => {
      this.isPopupOpened = false;
      this.getTestsList();
    });
  }
}
