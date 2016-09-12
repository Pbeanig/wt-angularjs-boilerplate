/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

import {User} from './user';
import {Observable} from 'rxjs';

export class UserStore {

    _userList: User[] = [];

    constructor(private $q, private $rootScope) {
        'ngInject';
    }

    addUser(user: User) {
        user.id = user.firstName;
        this._userList.push(user);
    }

    getUser({userId}) {
        return new Observable((observer) => {

            this.$rootScope.$on(`user-update-${userId}`, (event, user) => observer.next(user));

            observer.next(this._userList.find((user) => user.id === userId));

        });
    }

    removeUser({userId}) {
        this._userList = this._userList
            .filter(userRef => userRef.id !== userId);
    }

    updateUser({userId, user}: {userId: string, user: User}) {

        user.id = userId;

        this.$rootScope.$broadcast(`user-update-${userId}`, user);

        // let index = this._userList.findIndex(userRef => userRef.id === userId);
        // this._userList[index].firstName = user.firstName;
        this._userList = this._userList
            .filter(it => !it.isEqual({user: user}));
    }

    userList(): Promise<User[]> {
        return this.$q.resolve(this._userList);
    }

}
