import { Component } from '@angular/core';
// 和jquery引入不一样，lodash是直接import
import * as _ from 'lodash';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'helloworld';
  myModal: any;
  ngOnInit(): void {
    $('#bu').on('click',function() {
      $('.aa').css('color', 'red');
    })

    _.isEmpty('')
  }
}
