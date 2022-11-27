import { Component, OnInit } from '@angular/core';
import { TestApiService } from 'src/app/_services/test-api.service';

@Component({
  selector: 'app-test-api',
  templateUrl: './test-api.component.html',
  styleUrls: ['./test-api.component.less']
})
export class TestApiComponent implements OnInit {

  form: any = {
    method: "get",
    apiUrl: null,
    input: "",
    exceptedOutput:"",
    statusCode:200
  };

  methods: any [] = [
    { id: "get", name: 'Get' },
    { id: "post", name: 'Post' },
    { id: "delete", name: 'Delete' },
    { id: "update", name: 'Update' },
    { id: "options", name: 'Options' },
  ];

  constructor(
    private testApiService:TestApiService
  ) { }

  ngOnInit() {
  }


  onSubmit(): void {
    const { method, apiUrl, input, exceptedOutput, statusCode} = this.form;
    this.testApiService.execute(method, apiUrl, input, exceptedOutput,statusCode).subscribe({
      next: data => {
        console.log(data);
      },
      error: err => {
        console.log(err);
      }
    });

  }
}
