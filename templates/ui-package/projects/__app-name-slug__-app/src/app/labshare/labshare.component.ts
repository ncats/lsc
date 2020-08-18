import {Component, OnInit} from '@angular/core';
import {EventService} from '@labshare/ngx-core-services';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-labshare',
  templateUrl: './labshare.component.html',
  styleUrls: ['./labshare.component.scss']
})
export class LabShareComponent implements OnInit {
  constructor(private eventService: EventService, private titleService: Title) {}
  ngOnInit() {}
}
