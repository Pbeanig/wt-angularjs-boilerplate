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

    constructor(private userStore, $interval) {
        'ngInject';

        this.userList = new Observable((observer) => this._userListObserver = observer)
            /* Replay the last value for new subscribers. */
            .publishReplay(1);
        this.userList.connect();

        for(let i = 0; i < 1000; ++i) {
            this.userStore.addUser(new User({
                firstName: i.toString(),
                lastName: i.toString(),
            }));
        }

        $interval(() => {
            let index = Math.floor((Math.random() * 10));
            this.userStore.updateUser({
                userId: index.toString(),
                user: new User({
                    firstName: Math.floor((Math.random() * 10)).toString()
                })
            });
        }, 1000);

        this._updateUserList();

    }

    addUser(user: User) {

        this.userStore.addUser(user);

        this._updateUserList();

    }

    removeUser({userId}) {

        this.userStore.removeUser({userId: userId});

        this._updateUserList();

    }

    private _updateUserList() {

        this.userStore.userList()
            .then(userList => this._userListObserver.next(userList));
    }

}
