import {Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {testModel} from "../../../models/test-model";
import {TestApiService} from "../../../_services/test-api.service";

@Component({
  selector: 'app-add-test-dialog',
  templateUrl: './add-test-dialog.component.html',
  styleUrls: ['./add-test-dialog.component.css']
})
export class AddTestDialogComponent implements OnInit {

  hide = true;
  addTestForm: any;
  errorMessage: string |undefined;
  constructor(public dialogRef: MatDialogRef<AddTestDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: testModel,

              private formBuilder : FormBuilder,
              private testApiService : TestApiService,) { }

  ngOnInit(): void {
    this.addTestForm= this.formBuilder.group({
      name : this.formBuilder.control("",[ Validators.required, Validators.minLength(5)]),
      description : this.formBuilder.control("",[ Validators.required, Validators.minLength(5)]),
      created : this.formBuilder.control("",[ Validators.required]),


    });
  }

  saveAdd() {
    this.testApiService.addTest(this.addTestForm.value).subscribe(() => {
      console.log( this.addTestForm.value)
      /*this.notificationService.success('projet ajouter avec succes !');*/

    }, (err) => {
      this.errorMessage=err;
     /* this.notificationService.warn('echec dajouter veuillez réesseyer !');*/
      console.log(this.addTestForm.value);

    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
