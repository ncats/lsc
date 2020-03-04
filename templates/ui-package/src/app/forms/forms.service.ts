import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
declare let require: any;
const exampleForm = require('./example-form.json');

@Injectable({
  providedIn: 'root'
})
export class FormsService {
  constructor(private http: HttpClient) {}
  getFields() {
    return of(exampleForm as any);
  }
}
