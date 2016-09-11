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

class AsyncBinder {

    asyncExpressionRegex = /^\s*async:\s*/;

    constructor(private $provide) {
    }

    overrideParse() {
        this.$provide.decorator('$parse', ($delegate) => this._overrideParse({$parse: $delegate}));
    }

    $get() {
        return null;
    }

    private _overrideParse({$parse}) {

        return (expression, interceptorFn, expensiveChecks) => {

            let isAsync = false;

            if (typeof expression === 'string') {
                isAsync = expression.match(this.asyncExpressionRegex) != null;
                expression = expression.replace(this.asyncExpressionRegex, '');
            }

            if (isAsync) {
                return this._overrideWatch({
                    $parse: $parse,
                    expression: expression,
                    expensiveChecks: expensiveChecks,
                    interceptor: interceptorFn
                });
            }
            else {
                return $parse(expression, interceptorFn, expensiveChecks);
            }

        };
    }

    private _overrideWatch({$parse, expression, expensiveChecks, interceptor}) {

        let parsedExpression = $parse(expression, interceptor, expensiveChecks);

        parsedExpression.$$watchDelegate = (scope, listener, objectEquality, parsedExpression) => {

            let listenerWrapper;
            let oldValue;
            let unwatch;

            /* @hack: avoid infinite loop. */
            parsedExpression.$$watchDelegate = undefined;

            listenerWrapper = (observable, oldObservableValue, scope) => {

                let subscription;

                /* Keep watching until defined. */
                if (observable === undefined) {
                    return;
                }

                if (observable !== null) {
                    subscription = observable.subscribe((newValue) => {

                        /* No change. */
                        if (newValue === oldValue) {
                            return;
                        }

                        /* This is the hacky collection change interceptor. */
                        if (interceptor != null) {
                            interceptor(newValue);
                        }

                        listener(newValue, oldValue, scope);
                        oldValue = newValue;

                    });

                    scope.$on("$destroy", () => subscription.unsubscribe())
                }

                /* Stop watching even if observable is null and we didn't subscribe.
                 * Trying to keep the same behaviour as one time binding because observables can be null if not used. */
                unwatch();

            };

            unwatch = scope.$watch(expression, listenerWrapper, objectEquality);

            return unwatch;

        };

        parsedExpression.$$watchDelegate.$stateful = true;

        return parsedExpression;

    }



    private _overrideWatchDelegate({watchDelegate}) {

        return (expression, listener, ...args) => {

            let listenerWrapper;
            let unwatch;

            listenerWrapper = (newValue, oldValue, ...args) => {
                listener(newValue, oldValue, ...args);
            };

            unwatch = watchDelegate(expression, listenerWrapper, ...args);

            return unwatch;

        };

    }

}

userListModule.provider('asyncBinder', AsyncBinder);

userListModule.config((asyncBinderProvider) => {

    asyncBinderProvider.overrideParse();

});
