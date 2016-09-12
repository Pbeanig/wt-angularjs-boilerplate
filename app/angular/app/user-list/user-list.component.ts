/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

import {User} from '../common/user/user';

export class UserListComponent {

    static config = {
        controller: UserListComponent,
        templateUrl: require('./user-list.component.html')
    };

    userList;

    constructor(private userStore, $interval, $timeout) {
        'ngInject';

        for(let i = 0; i < 50; ++i) {
            $timeout(() => {
                for(let j = 0; j < 20; ++j) {

                    this.userStore.addUser(new User({
                        firstName: (i * 100 + j).toString(),
                        lastName: (i * 100 + j).toString(),
                    }));
                }
                this._updateUserList();
            }, 10 * i);
        }

        $interval(() => {
            let index = Math.floor((Math.random() * 3));
            this.userStore.updateUser({
                userId: index.toString(),
                user: new User({
                    firstName: Math.floor((Math.random() * 3)).toString()
                })
            });
            this._updateUserList();
        }, 1000);

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
            .then(userList => this.userList = userList);
    }

}
