/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

import {UserFormComponent} from './user-form/user-form.component';
import {UserListComponent} from './user-list.component';
import {UserPreviewComponent} from './user-preview/user-preview.component';
import {userModule} from '../common/user/user.module';

export const userListModule = angular.module('app.userList', [
    userModule.name
]);

userListModule.component('wtUserForm', UserFormComponent.config);
userListModule.component('wtUserList', UserListComponent.config);
userListModule.component('wtUserPreview', UserPreviewComponent.config);

userListModule.run(($rootScope) => {

    let scopeFactory = $rootScope.$new.bind($rootScope);

    $rootScope.$new = () => {

        let scope = scopeFactory();
        let watch = scope.$watch.bind(scope);

        scope.$watch = (watchExpression, listener, ...args) => {

            let clearWatch = watch(watchExpression, (newValue, oldValue, ...args) => {

                if (listener == null) {
                    return;
                }

                if (newValue.subscribe != null) {
                    newValue.subscribe((value) => {
                        listener(value, oldValue, ...args);
                    });
                    clearWatch();
                }
                else {
                    listener(newValue, oldValue, ...args);
                }

            }, ...args);

            return clearWatch;

        };

        return scope;

    };

});