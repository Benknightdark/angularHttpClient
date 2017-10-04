import {HttpResponse, HttpEventType,  HttpRequest,   HttpHeaders,    HttpClient} from '@angular/common/http';
import { Component } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/shareReplay';
import * as _ from 'lodash';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private http: HttpClient) { }
  SpecData: Observable<any>
  show = false;

  ngOnInit() {

    this.http.post('/api/Account', {
      'WorkID': '',
      'Password': ''
    }).subscribe(data => {
      console.log(data);
      this.show = false;
      this.SpecData = this.list(data)
      this.show = true;
      console.log(this.SpecData)
      //.subscribe(res=>this.SpecData = res[0]);
    });
  }
  list(data): Observable<any> {
    return this.http.get('/EquipmentSpec/HQ-POW-7F-01', {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + data['Token']),
    }).map(a => _.values(a[0])).shareReplay();
  }
  fileChange(event) {
console.log()

    const formData: FormData = new FormData();
    const fileList: FileList = event.target.files;

      const file: File = fileList[0];
    formData.append('image', file, file.name);
    const headers = new HttpHeaders();
    const req = new HttpRequest('POST',
    '/apiAzureBlob', formData, {
     reportProgress: true,
   });
    this.http.request(req).subscribe(evuplent => {
      if (evuplent.type === HttpEventType.UploadProgress) {
        const percentDone = Math.round(100 * evuplent.loaded / evuplent.total);
        console.log(`File is ${percentDone}% uploaded.`);

      } else if (evuplent instanceof HttpResponse) {
        console.log('File is completely uploaded!');
        console.log(evuplent);
      }
    });
  }

}
