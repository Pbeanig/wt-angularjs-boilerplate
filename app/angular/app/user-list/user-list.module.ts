/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

import {UserFormComponent} from './user-form/user-form.component';
import {UserListComponent} from './user-list.component';
import {UserPreviewComponent} from './user-preview/user-preview.component';
<<<<<<< Updated upstream
import {userModule} from '../common/user/user.module';
=======
import {Observable} from 'rxjs';
>>>>>>> Stashed changes

export const userListModule = angular.module('app.userList', [
    userModule.name
]);

userListModule.component('wtUserForm', UserFormComponent.config);
userListModule.component('wtUserList', UserListComponent.config);
userListModule.component('wtUserPreview', UserPreviewComponent.config);
userListModule.directive('ngAsyncBind', ($compile) => {
    'ngInject';

    return {
        compile: (templateElement) => {
            $compile.$$addBindingClass(templateElement);
            return (scope, element, attr) => {

                let getter;
                let setter;
                let splits = attr.ngAsyncBind.split('.');
                let value;

                $compile.$$addBindingInfo(element, attr.ngBind);
                element = element[0];

                if (scope.$$observableMap == null) {
                    scope.$$observableMap = {};
                }

                getter = scope.$ctrl.__lookupGetter__('user');
                setter = scope.$ctrl.__lookupSetter__('user');
                scope.$$observableMap['$ctrl.user'] = new Observable(observer => {

                    Object.defineProperty(scope.$ctrl, 'user', {
                        get: () => {
                            if (getter) {
                                return getter();
                            }
                            else {
                                return scope.$ctrl['_' + 'user'];
                            }
                        },
                        set: (newValue) => {
                            if (setter) {
                                setter(newValue);
                            }
                            else {
                                scope.$ctrl['_' + 'user'] = newValue;
                            }
                            observer.next(newValue);
                        }
                    });

                });

                scope.$$observableMap[splits.slice(0, 2).join('.')].subscribe((newValue) => {

                    splits.slice(2).forEach((split) => {
                        newValue = newValue[split];
                    });

                    element.textContent = newValue ? newValue.toString() : '';
                });
            };
        },
        restrict: 'AC'
    };
});
