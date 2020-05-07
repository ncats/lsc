import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent, LeftNavComponent, HeaderComponent, TenantNavComponent} from '@labshare/ngx-base-components';
import {LabShareComponent} from './labshare/labshare.component';
import {ConfigResolverService} from '@labshare/ngx-base-components';
import {FormsComponent} from './forms/forms.component';
import {LoggingComponent} from './logging/logging.component';
import {AuthComponent} from './auth/auth.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'labshare',
    pathMatch: 'full'
  },
  {
    path: 'labshare',
    data: {
      theme: 'labshare'
    },
    component: LayoutComponent,
    resolve: {items: ConfigResolverService},
    children: [
      {
        path: '',
        component: LeftNavComponent,
        data: {
          items: [
            {id: 'left.home', icon: 'icon-Pages', text: `Home`, link: '#'},
            {id: 'left.forms', icon: 'icon-Pages', text: `Forms Example`, link: '#'},
            {id: 'left.auth', icon: 'icon-Pages', text: `Auth Example`, link: '#'},
            {id: 'left.logging', icon: 'icon-Pages', text: `Logging Example`, link: '#'},
            {id: 'left.version', icon: 'icon-Pages', text: `Version Example`, link: '#'}
          ]
        },
        outlet: 'left'
      },

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
            outlet: 'center'
          }
        ]
      },
      {
        path: 'auth',
        children: [
          {
            path: '',
            component: AuthComponent
          },
          {
            path: '',
            component: AuthComponent,
            outlet: 'center'
          }
        ]
      },
      {
        path: 'forms',
        children: [
          {
            path: '',
            component: FormsComponent
          },
          {
            path: '',
            component: FormsComponent,
            outlet: 'center'
          }
        ]
      },
      {
        path: 'logging',
        children: [
          {
            path: '',
            component: LoggingComponent
          },
          {
            path: '',
            component: LoggingComponent,
            outlet: 'center'
          }
        ]
      },
      {
        path: 'shell',
        loadChildren: () => import('./shell/shell.module').then(m => m.ShellModule)
      },
      {
        path: '',
        component: HeaderComponent,
        outlet: 'header',
        data: {
          config: {
            icon: 'icon-LsStorageIcon',
            text: 'Storage',
            leftNavList: [],
            centerNavList: [],
            rightNavList: [
              {
                click: 'search-click',
                type: 'i',
                icon: 'icon-lsi-search'
              },
              {
                click: 'search-click',
                type: 'i',
                icon: 'icon-lsi-bell'
              },
              {
                click: 'search-click',
                type: 'i',
                icon: 'icon-lsi-settings'
              },
              {
                click: 'search-click',
                type: 'i',
                icon: 'icon-lsi-user'
              }
            ]
          }
        }
      },
      {
        path: '',
        component: TenantNavComponent,
        outlet: 'tenant',
        data: {
          apps: [
            {
              id: '1',
              route: '/labshare/(right:test)',
              text: 'Instrumentation',
              click: 'tenant-switch',
              icon: 'icon-lsi-instrumentation'
            },
            {
              id: '2',
              route: '/noleft',
              text: 'Project Tracking',
              click: 'tenant-switch',
              icon: 'icon-lsi-publications'
            }
          ],
          settings: [
            {
              id: '1',
              route: '/labshare',
              text: 'Add App',
              click: 'tenant-switch',
              icon: 'icon-lsi-applications'
            },
            {
              id: '2',
              route: 'polus',
              text: 'LS Storage',
              click: 'tenant-switch',
              icon: 'icon-lsi-storage'
            },
            {
              id: '3',
              route: '/labshare/(right:test)',
              text: 'Manage',
              click: 'tenant-switch',
              icon: 'icon-lsi-auth'
            },
            {
              id: '4',
              route: '/noleft',
              text: 'Pages',
              click: 'tenant-switch',
              icon: 'icon-lsi-pages'
            },
            {
              id: '5',
              route: '/noleft',
              text: 'List',
              click: 'tenant-switch',
              icon: 'icon-lsi-list-view'
            },
            {
              id: '5',
              route: '/noleft',
              text: 'Groups',
              click: 'tenant-switch',
              icon: 'icon-lsi-groups'
            }
          ]
        }
      },

      {
        path: '',
        component: LayoutComponent,
        outlet: 'right'
      }
    ]
  }
];

export const UsersRouting = RouterModule.forRoot(routes);
