import { Component, OnInit } from '@angular/core';
import { TestApiService } from 'src/app/_services/test-api.service';

@Component({
  selector: 'app-test-api',
  templateUrl: './test-api.component.html',
  styleUrls: ['./test-api.component.less']
})
export class TestApiComponent implements OnInit {

  form: any = {
    method: null,
    apiUrl: null,
    statusCode: null,
    input: null,
    expectedOutput: null
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

  constructor(
    private testApiService: TestApiService
  ) { }

  ngOnInit() {
  }

  onSubmit(): void {
    const { method, apiUrl, statusCode, input, expectedOutput } = this.form;

    this.testApiService.execute(method, apiUrl, statusCode, input, expectedOutput).subscribe({
      next: data => {
        console.log(data);
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
