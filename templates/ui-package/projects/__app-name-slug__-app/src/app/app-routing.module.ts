import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent, LeftNavComponent, HeaderComponent, TenantNavComponent} from '@labshare/ngx-base-components';
import {LabShareComponent} from './labshare/labshare.component';
import {ConfigResolverService} from '@labshare/ngx-base-components';
import {generatedRoutes} from './ui-modules/module-routes';
import {generatedMenuItems} from './ui-modules/menu-items';

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
          items: []
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
        path: '',
        component: HeaderComponent,
        outlet: 'header',
        data: {
          config: {
            icon: 'icon-LsStorageIcon',
            text: 'Header',
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

      /* Routes automatically generated by LSC/Shell-UI */
      ...generatedRoutes,

      {
        path: '',
        component: TenantNavComponent,
        outlet: 'tenant',
        data: {
          apps: [...generatedMenuItems],
          settings: [
            {
              id: '1',
              route: '/labshare',
              text: 'Add App',
              click: 'tenant-switch',
              icon: 'icon-lsi-applications'
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