import {Component, Inject, OnInit} from '@angular/core';
import {TestApiService} from "../../../_services/test-api.service";
import { FormBuilder, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-delete-test-dialog',
  templateUrl: './delete-test-dialog.component.html',
  styleUrls: ['./delete-test-dialog.component.less']
})
export class DeleteTestDialogComponent implements OnInit {
  errorMessage: any;
  testModel: any;

  constructor(private testApiService : TestApiService,
              public dialogRef: MatDialogRef<DeleteTestDialogComponent >,
              @Inject(MAT_DIALOG_DATA) public id: any,) { }

  ngOnInit(): void {
    this.testApiService.getTest(this.id)
      .subscribe(testModel=>this.testModel=testModel)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(id : string){
    this.testApiService.deleteTest(this.id)
      .subscribe(() => {
        console.log('Data deleted successfully!');
        /*this.notificationService.success('suppression effectuée avec succes !');*/

      }, (err) => {
        this.errorMessage=err;
       /* this.notificationService.warn('erreur veuillez réesseyer !');*/


      });

  }


}
