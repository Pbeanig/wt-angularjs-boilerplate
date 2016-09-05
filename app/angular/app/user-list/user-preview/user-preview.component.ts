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
            user: '<wtUser'
        },
        controller: UserPreviewComponent,
        templateUrl: require('./user-preview.component.html')
    };

    constructor() {

        let firstName = '';

        this.userObservable = new Observable(observer => {

            setInterval(() => {
                observer.next({firstName: firstName += 'x'});
            }, 1000);

        });

    }

    user;
    userObservable;

}
