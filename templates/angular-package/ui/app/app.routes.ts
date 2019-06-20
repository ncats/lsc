// All the routes goes here
import {HomeComponent} from './home/home.component';
import {AppKeys} from './app.keys';
export const routes = {
  states: [
    {
      name: AppKeys.ROOT,
      url: AppKeys.HOME_URL,
      component: HomeComponent,
    },
  ],
  useHash: false,
  otherwise: {state: AppKeys.ROOT},
};
