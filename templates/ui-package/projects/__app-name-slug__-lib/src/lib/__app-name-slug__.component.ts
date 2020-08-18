import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-<%= appNameSlug %>',
  template: `
    <p>
      <%= appNameSlug %> works!
    </p>
  `,
  styles: [
  ]
})
export class <%= appNamePascalCase %>Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
