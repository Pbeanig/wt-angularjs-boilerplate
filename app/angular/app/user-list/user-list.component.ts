/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

import {User} from '../common/user/user';
import {Observable} from 'rxjs';

export class UserListComponent {

    static config = {
        controller: UserListComponent,
        templateUrl: require('./user-list.component.html')
    };

    userList;
    _userListObserver;

    constructor(private userStore) {
        'ngInject';

        this.userList = new Observable((observer) => this._userListObserver = observer).publish();
        this.userList.connect();
        this._updateUserList();

    }

    addUser(user: User) {

        this.userStore.addUser(user);

        this._updateUserList();

    }

    removeUser(user: User) {

        this.userStore.removeUser(user);

        this._updateUserList();

    }

    private _updateUserList() {
        this.userStore.userList()
            .then(userList => this._userListObserver.next(userList));
    }

}
