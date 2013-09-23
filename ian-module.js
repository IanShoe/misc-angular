var ianModule = angular.module('IanModule', []);

/* Directives */
ianModule.
directive('dynamicBtn', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var expression = attrs.dynamicBtn;
            var match = expression.match(/^\s*(.+)\s+with\s+(.*)\s*$/),toggle, name;
            toggle = match[1];
            name = match[2];
            scope.$watch(toggle, function(newValue, oldValue){
                if(scope.$eval(toggle) == null){
                    element[0].innerText = 'Submit ' + name;
                    element[0].textContent = 'Submit ' + name;
                }
                else{
                    element[0].innerText = 'Update ' + name;
                    element[0].textContent = 'Update ' + name;
                }
            }, true)
        }
    }
}).
directive('tableSort', function(){
    return function (scope, element, attrs) {
        var expression = attrs.tableSort;
        var match = expression.match(/^\s*(.+)\s+with\s+(.*)\s*$/),table, data;
        table = scope.$eval(match[1]);
        data = match[2];
        scope.$watch(data, function(newValue, oldValue){
            if(scope.$last === true) {
                element.ready(function() {
                    $("#"+table).tablesorter();
                    // $("#"+table).trigger("update");
                })
            }
        })
    }
}).
directive('duplicate', ['Utils', function(Utils) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            scope.$watch(attrs.ngModel, function(newValue, oldValue){
                if(newValue === undefined){
                    return;
                }
                var expression = attrs.duplicate;
                var match = expression.match(/^\s*(.+)\s+by\s+(.*)\s+on\s+(.*)\s*$/),list, property, toggle;
                list = scope.$eval(match[1]);
                property = match[2];
                toggle = scope.$eval(match[3]);
                var found = Utils.find(newValue, list, property);

                if(!found || found.item === toggle){
                    ctrl.$setValidity('duplicate', true);
                }
                else{
                    ctrl.$setValidity('duplicate', false);
                }
            }, true)
        }
    }
}]).
directive('passidate', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            scope.$watch(attrs.passidate, function(newValue, oldValue){
                if(scope.$eval(attrs.ngModel) == newValue){
                    ctrl.$setValidity('passidate', true);
                }
                else{
                    ctrl.$setValidity('passidate', false);
                }
            }, true);
            scope.$watch(attrs.ngModel, function(newValue, oldValue){
                if(scope.$eval(attrs.passidate) == newValue){
                    ctrl.$setValidity('passidate', true);
                }
                else{
                    ctrl.$setValidity('passidate', false);
                }
            }, true)
        }
    }
});

/* Providers */
ianModule.
provider('Utils', function(){
    this.$get = function(){
        return {
            setProperty: function(instance, instanceList, instanceProperty) {
                if(instance) {
                    instance = this.find(instance, instanceList, instanceProperty)
                }
                else {
                    instance = instanceList[0];
                }
                return instance;
            },
            advancedFind: function(instance, list, properties) {
                var found = {};
                for (var i = 0; i < list.length; i++) {
                    var finding = true;
                    for(var j= 0; j < list.length; j++){
                        if (list[i][properties[j]] === instance[properties[j]] || list[i][properties[j]] === instance) {
                            continue;
                        }
                        else{
                            finding = false;
                            break;
                        }
                    }
                    if(finding){
                        found.index = i;
                        found.item = list[i];
                        return found;
                    }
                }
                return false;
            }
        }
    }
});