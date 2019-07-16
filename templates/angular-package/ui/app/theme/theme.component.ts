import {
  ApplicationRef,
  Component,
  Optional,
  SkipSelf,
  Input,
  forwardRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import {StatefulComponent, StatefulParent, StatefulService} from '@labshare/ngx-stateful';
import {Router} from '@angular/router';

export const STATE = () => ({
  selectedItem: `LABSHARE_ON_SELECTED`,
  sectionItems: [
    {
      name: 'First leftmost item',
      id: 'first-item',
      icon: 'http://placekitten.com/50/50'
    },
    {
      name: 'Second leftmost item',
      id: 'second-item',
      icon: 'http://placekitten.com/80/80'
    }
  ],
  items: [{name: 'home', link: 'home', icon: 'th'}, {name: 'version', link: 'version', icon: 'th-large'}]
});

export const UTILS = {};

export const PROPS = {};

@Component({
  selector: 'sc-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: StatefulParent,
      useExisting: forwardRef(() => ThemeComponent)
    }
  ]
})
export class ThemeComponent extends StatefulComponent {
  updateProps = {};

  constructor(
    public inj: ChangeDetectorRef,
    @Optional() @SkipSelf() public statefulParent: StatefulParent,
    public statefulService: StatefulService,
    public appRef: ApplicationRef,
    private router: Router
  ) {
    super(inj, STATE, statefulParent, statefulService, appRef);
  }

  public changeItem(selected) {
    switch (selected.link) {
      case 'home':
        this.router.navigate(['']);
        break;
      case 'version':
        this.router.navigate(['version']);
        break;
    }

    console.log(selected);
  }
}
