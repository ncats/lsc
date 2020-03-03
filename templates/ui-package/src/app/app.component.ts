import { Component, OnInit } from "@angular/core";
import { AuthService, EventService } from "@labshare/ngx-core-services";
import { ActivatedRoute, Router } from "@angular/router";
import { EventKeys } from "@labshare/ngx-core-components";
import { filter } from "rxjs/operators";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private eventService: EventService) {}
  title = "<%= appNameSlug %>";
  ngOnInit(): void {
    this.eventService
      .get(EventKeys.LeftMenu)
      .pipe(filter(x => x !== null))
      .subscribe(val => {
        switch (val.id) {
          case "left.home":
            this.router.navigate(["./labshare/"]);
            break;
          case "left.forms":
            this.router.navigate(["./labshare/forms"]);
            break;
          case "left.auth":
            this.router.navigate(["./labshare/auth"]);
            break;
          case "left.logging":
            this.router.navigate(["./labshare/logging"]);
            break;
          case "left.version":
            this.router.navigate(["./labshare/shell"]);
            break;
        }
      });
  }
}
