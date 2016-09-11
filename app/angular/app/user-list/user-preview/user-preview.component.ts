import {Observable} from 'rxjs';
/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

export class UserPreviewComponent {

    static config = {
        bindings: <any>{
            onUserRemove: '&wtOnUserRemove',
            userId: '<wtUserId',
            userStore: '<wtUserStore',
        },
        controller: UserPreviewComponent,
        templateUrl: require('./user-preview.component.html')
    };

    userId;
    userStore;

}
