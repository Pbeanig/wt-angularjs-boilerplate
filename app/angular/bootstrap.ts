
import './common'

import 'rxjs/add/operator/pluck';

import * as angular from 'angular';
import {appModule} from './app/app.module';

angular.element(document).ready(function() {
    angular.bootstrap(document, [appModule.name]);
});
