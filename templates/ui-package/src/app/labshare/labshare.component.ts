import {Component, OnInit} from '@angular/core';
import {EventService} from '@labshare/ngx-core-services';
import {Title} from '@angular/platform-browser';
import {EventKeys} from '@labshare/ngx-base-components';

@Component({
  selector: 'app-labshare',
  templateUrl: './labshare.component.html',
  styleUrls: ['./labshare.component.scss']
})
export class LabShareComponent implements OnInit {
  theme = 'labshare';
  hideContent: boolean;
  selectedDirectory;

  sourceCode = `
  constructor(
    private eventService: EventService,
    private titleService: Title,
  ) {
    this.hideContent = false;
    // click on search button
    const searchEvent = this.eventService.get('search-click');
    searchEvent.subscribe(val => {
      if (val !== null) {
        this.hideContent = !this.hideContent;
      }
    });
    this.selectedDirectory = 'Click left nav';
    this.eventService.get('left-nav-click').subscribe(val => {
      if (val) {
        this.selectedDirectory = val.id;
      }
    });
    this.titleService.setTitle('My Title');
  }
  ngOnInit() {}

  changeTitle() {
    this.titleService.setTitle('Next Title');
    this.eventService.get(EventKeys.Title).next('Test');
  }

  `;

  routingHTMLCode = `
  This code is for calling routes from the html
  /*<a [routerLink]="['../forms']">Forms A</a>*/
  `;

  routingConfigurationCode = `
 ... // Check app-routing module
 {
  path: '',
  children: [
    {
      path: '',
      component: LabShareComponent
    },
    {
      path: '',
      component: LabShareComponent,
      outlet: 'center' // you need to define both
    }
  ]
},....
  `;

  constructor(private eventService: EventService, private titleService: Title) {
    this.hideContent = false;
    const searchEvent = this.eventService.get('search-click');
    searchEvent.subscribe(val => {
      if (val !== null) {
        this.hideContent = !this.hideContent;
      }
    });
    this.selectedDirectory = 'Click left nav';
    this.eventService.get('left-nav-click').subscribe(val => {
      if (val) {
        this.selectedDirectory = val.id;
      }
    });
    this.titleService.setTitle('My Title');
  }
  ngOnInit() {}

  changeTitle() {
    this.titleService.setTitle('Next Title');
    this.eventService.get(EventKeys.Title).next('Test');
  }
}
