export const polusConfig: any = {
  name: 'polus',
  class: 'config',
  properties: {
    header: {
      logo: 'fa fa-folder-o',
      text: 'Default Text',
      leftNavList: [],
      centerNavList: [],
      rightNavList: [
        {
          click: 'search-click',
          type: 'i',
          icon: 'icon-Search'
        },
        {
          click: 'search-click',
          type: 'i',
          icon: 'icon-notification'
        },
        {
          click: 'search-click',
          type: 'i',
          icon: 'icon-SettingsIcon'
        },
        {
          click: 'search-click',
          type: 'i',
          icon: 'icon-UserIcon'
        }
      ]
    },
    tenantNav: {
      applist: [
        {
          id: '1',
          route: '/labshare',
          text: 'Pages',
          click: 'tenant-switch',
          icon: 'icon-Pages'
        },
        {
          id: '2',
          route: 'polus',
          text: 'Polus Layout / Theme',
          click: 'tenant-switch',
          icon: 'icon-Polus'
        },
        {
          id: '3',
          route: '/labshare/(right:test)',
          text: 'FOTS Application',
          click: 'tenant-switch',
          icon: 'icon-FOTSApp'
        },
        {
          id: '4',
          route: '/noleft',
          text: 'Book',
          click: 'tenant-switch',
          icon: 'icon-Book'
        }
      ]
    },

    leftNav: {
      logo: 'fa fa-folder-o',
      text: 'Selected Heirarchy',
      menu: [
        {
          icon: 'fa fa-folder-o',
          'router-link': 'test',
          text: 'Publication',
          children: [
            {
              icon: 'fa fa-folder-o',
              text: 'Test 1',
              link: 'https://osd.ncats.nih.gov/Shared%20Documents/PPC%20User%20Guide.pdf'
            },
            {
              icon: 'fa fa-folder-o',
              text: 'Test 2',
              link: 'https://osd.ncats.nih.gov/Shared%20Documents/PPC%20User%20Guide.pdf'
            }
          ]
        },
        {
          icon: 'fa fa-folder-o',
          'router-link': 'test2',
          text: 'Instruments & Resource'
        },
        {
          icon: 'fa fa-folder-o',
          'router-link': 'test2',
          text: 'Project Tracking'
        },
        {
          icon: 'fa fa-folder-o',
          text: 'Groups',
          link: 'https://osd.ncats.nih.gov/Shared%20Documents/PPC%20User%20Guide.pdf'
        },
        {
          icon: 'fa fa-folder-o',
          text: 'Pages',
          link: 'https://osd.ncats.nih.gov/Shared%20Documents/PPC%20User%20Guide.pdf'
        },
        {
          icon: 'fa fa-folder-o',
          'router-link': 'test2',
          text: 'Storage Space',
          link: 'https://osd.ncats.nih.gov/Shared%20Documents/PPC%20User%20Guide.pdf'
        }
      ]
    }
  }
};

export const labshareConfig: any = {
  name: 'labshare',
  class: 'config',
  properties: {
    header: {
      logo: 'icon-Polus',
      text: 'Default Text',
      leftNavList: [],
      centerNavList: [],
      rightNavList: [
        {
          click: 'search-click',
          type: 'i',
          icon: 'icon-Search'
        },
        {
          click: 'search-click',
          type: 'i',
          icon: 'icon-notification'
        },
        {
          click: 'search-click',
          type: 'i',
          icon: 'icon-SettingsIcon'
        },
        {
          click: 'search-click',
          type: 'i',
          icon: 'icon-UserIcon'
        }
      ]
    },
    tenantNav: {
      applist: [
        {
          id: '1',
          route: '/labshare',
          text: 'Pages',
          click: 'tenant-switch',
          icon: 'icon-Pages'
        },
        {
          id: '2',
          route: 'polus',
          text: 'Polus Layout / Theme',
          click: 'tenant-switch',
          icon: 'icon-Polus'
        },
        {
          id: '3',
          route: '/labshare/(right:test)',
          text: 'FOTS Application',
          click: 'tenant-switch',
          icon: 'icon-FOTSApp'
        },
        {
          id: '4',
          route: '/noleft',
          text: 'Book',
          click: 'tenant-switch',
          icon: 'icon-Book'
        }
      ]
    },

    leftNav: [
      {
        icon: 'fa fa-folder-o',
        'router-link': 'test',
        text: 'Publication',
        children: [
          {
            icon: 'fa fa-folder-o',
            text: 'Test 1',
            link: 'https://osd.ncats.nih.gov/Shared%20Documents/PPC%20User%20Guide.pdf'
          },
          {
            icon: 'fa fa-folder-o',
            text: 'Test 2',
            link: 'https://osd.ncats.nih.gov/Shared%20Documents/PPC%20User%20Guide.pdf'
          }
        ]
      },
      {
        icon: 'fa fa-folder-o',
        'router-link': 'test2',
        text: 'Instruments & Resource'
      },
      {
        icon: 'fa fa-folder-o',
        'router-link': 'test2',
        text: 'Project Tracking'
      },
      {
        icon: 'fa fa-folder-o',
        text: 'Groups',
        link: 'https://osd.ncats.nih.gov/Shared%20Documents/PPC%20User%20Guide.pdf'
      },
      {
        icon: 'fa fa-folder-o',
        text: 'Pages',
        link: 'https://osd.ncats.nih.gov/Shared%20Documents/PPC%20User%20Guide.pdf'
      },
      {
        icon: 'fa fa-folder-o',
        'router-link': 'test2',
        text: 'Storage Space',
        link: 'https://osd.ncats.nih.gov/Shared%20Documents/PPC%20User%20Guide.pdf'
      }
    ]
  }
};
