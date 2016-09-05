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

        this.userObservable = new Observable(observer => {

            observer.next(this.user);

            setInterval(() => {
                this.user = {
                    firstName: this.user.firstName += 'x'
                };
                observer.next(this.user);
            }, 1000);

        });

    }

    user;
    userObservable;

}
