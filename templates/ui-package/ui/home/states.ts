import {HomeComponent} from "./home.component";

export const states = [
    {
        name: 'home',
        data: {
            rolesRequired: ['user', 'staff', 'admin']
        },
        url: '/<%= appNameSlug %>/home',
        component: HomeComponent
    }
]; 