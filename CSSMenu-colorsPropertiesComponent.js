define(
  ["jquery", "touche", "client.property-panel/components/components", "text!./lib/partials/CSSMenu-colorProperties.ng.html", "client.property-panel/component-utils", "general.utils/string-limits",
   "./colorPick"
  ],
  function($, touche, components, template, componentUtils, stringLimits, cp) {
    
    var o = {
      template: template,
      controller: ["$scope", "$element", "$timeout", function($scope, $element, p) {
        
        var getData = function() {
          return $scope.data
        };
        
        $scope.maxlength = $scope.definition.maxlength ? $scope.definition.maxlength : stringLimits.name
        componentUtils.defineLabel($scope, $scope.definition, getData, $scope.args.handler)
        componentUtils.defineVisible($scope, $scope.args.handler)
        componentUtils.defineReadOnly($scope, $scope.args.handler)
        componentUtils.defineChange($scope, $scope.args.handler)
        componentUtils.defineValue($scope, $scope.definition, getData)
        componentUtils.defineExpression($scope, !1)
        
        setTimeout(function() {
          $element.find(".colorPick").colorpicker({
            showOn: "focus",
            hideButton: true
          });
          
          $element.find(".colorPick").on("change.color", function(event, color){
            $scope.data[$scope.definition.ref] = color;
            $scope.$emit("saveProperties")
          });
        }, 100);
        
        
      }]
      
    };
    return components.addComponent("CSSMenu-Colors", o), o
  }
)