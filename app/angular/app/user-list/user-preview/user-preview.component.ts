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

    _markedForCheck = false;
    _watchersMap = {};

    constructor(private $scope, private $timeout) {
    }

    markForCheck() {

        if (this._markedForCheck) {
            return;
        }

        this._markedForCheck = true;

        this._restoreWatchers({scope: this.$scope});

        this.$timeout(() => {
            this._saveWatchers({scope: this.$scope});
            this._markedForCheck = false;
        });

    }

    $onChanges() {
        this.markForCheck();
    }

    _saveWatchers({scope}) {

        this._watchersMap[scope.$id] = scope.$$watchers;
        scope.$$watchers = [];
        scope.$$watchersCount = 0;

        this._applyToChildren({
            action: (scope) => this._saveWatchers({scope: scope}),
            scope: scope
        });

    }

    _restoreWatchers({scope}) {

        let watchers = this._watchersMap[scope.$id] || [];
        scope.$$watchers = Array.from(new Set([...watchers, ...scope.$$watchers]));
        scope.$$watchersCount = scope.$$watchers.length;
        this._watchersMap[scope.$id] = [];

        this._applyToChildren({
            action: (scope) => this._restoreWatchers({scope: scope}),
            scope: scope
        });

    }
    
    _applyToChildren({action, scope}) {

        scope = scope.$$childHead;

        while (scope != null) {

            if (!scope.hasOwnProperty('$ctrl')) {
                action(scope);
            }

            scope = scope.$$nextSibling;

        }

    }

}
