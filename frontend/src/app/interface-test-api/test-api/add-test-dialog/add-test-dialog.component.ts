import {Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {testModel} from "../../../models/test-model";
import {TestApiService} from "../../../_services/test-api.service";
import {testModel2}  from "../../../models/testmodel2";

@Component({
  selector: 'app-add-test-dialog',
  templateUrl: './add-test-dialog.component.html',
  styleUrls: ['./add-test-dialog.component.css']
})
export class AddTestDialogComponent implements OnInit {
  headerRequest = [{ key: '', value: '' }];
  method: any;
  apiUrl: any;
  responseTime: any;
  statusCode: any;
  expectedOutput: any;

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

  addnewHeader() {
    this.headerRequest.push({ key: '', value: '' });
  }
  deleteHeader(index: number) {
    this.headerRequest.splice(index, 1);
  }

  // ... (reste du code)

  //function qui teste est ce que expectedoutput commence par { et termine avec }
  isValidJsonFormat(value: string): boolean {
    if (!value) {
      return false;
    }
    return value.trim().startsWith('{') && value.trim().endsWith('}');
  }

  // verfiier le format de apiurl avec regexp
  isValidApiUrl(apiUrl: string): boolean {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$',
      'i'
    );
    return !!pattern.test(apiUrl);
  }

  saveHeaders() {
    if (!this.isValidApiUrl(this.apiUrl)) {
      console.error("L'URL fournie n'est pas valide.");
      return;
    }

    if (!this.isValidJsonFormat(this.expectedOutput)) {
      console.error("le format de json n'est pas compatible.");
      return;
    }

    const jsonData: testModel2 = {
      method: this.method,
      apiUrl: this.apiUrl,
      responseTime: this.responseTime,
      expectedOutput: this.expectedOutput,
      statusCode: this.statusCode,
      headers: {},
      expectedHeaders: this.expectedOutput,
    };

    this.headerRequest.forEach((pair) => {
      jsonData.headers[pair.key] = pair.value;
    });

    console.log('Formatted JSON Data:', JSON.stringify(jsonData, null, 2));
  }


}
