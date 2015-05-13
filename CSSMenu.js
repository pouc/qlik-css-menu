define(
  ["jquery", "underscore", "qlik", "./livequery", "./CSSMenu-properties", "./CSSMenu-initialproperties", "text!./lib/css/CSSMenu.css",
   "text!./lib/partials/CSSMenu.ng.html", "client.utils/routing", "client.utils/state", "client.models/sheet"
  ],
  function($, _, qlik, lq, props, initProps, cssContent, ngTemplate, Routing, State, SheetModel)
  {
    'use strict';
    
    $('.sheet-title-container').livequery(function(){ 
      $(this) 
      .hide();
    }, function() { 
      
    }); 

    return {
      initialProperties: initProps,
      definition: props,
      snapshot:
      {
        canTakeSnapshot: !0
      },
      
      template: ngTemplate,
      
      controller : ["$scope", function($scope)
                    {
                      function getSheets($scope)
                      {
                        SheetModel
                        .getList()
                        .then(function(list)
                              {
                                list
                                .getLayout()
                                .then(function(layout)
                                      {
                                        $scope.sheets = layout
                                      })
                              })
                      };
                      
                      
                      function setCss($scope) {
                        var newCss =  cssContent
                        .replace(/{{borderColor}}/g, $scope.layout.borderColor)
                        .replace(/{{backgroundColor1}}/g, $scope.layout.backgroundColor1)
                        .replace(/{{backgroundColor2}}/g, $scope.layout.backgroundColor2)
                        .replace(/{{textColor}}/g, $scope.layout.textColor)
                        .replace(/{{activeBackgroundColor}}/g, $scope.layout.activeBackgroundColor)
                        .replace(/{{align}}/g, $scope.layout.align);
                        
                        
                        
                        if($('style#cssmenu').length)
                        {
                          $('style#cssmenu').html(newCss);
                        } else {
                          var newStyle = $("<style>");
                          newStyle.attr("id", "cssmenu");
                          newStyle.html(newCss).appendTo("head");
                        }
                      };
                      
                      setCss($scope);
                      
                      $scope.$watch('layout', function(newValue, oldValue){
                        setCss($scope);
                      }, true);
                      
                      $scope.curSheetId = State.getModel().id;
                      
                      $scope.textColor = { color: $scope.layout.textColor };
                      
                      $scope.sheets;
                      getSheets($scope);
                      
                      $scope.doAction = function()
                      {
                        if ($scope.layout.isActionsBefore)
                        {
                          var app = qlik.currApp();
                          switch ($scope.layout.actionBefore1)
                          {
                            case "clearAll":
                              app.clearAll();
                              break;
                            case "unlockAll":
                              app.unlockAll();
                              break;
                            case "clearField":
                              _.isEmpty($scope.layout.field1) || app.field($scope.layout.field1).clear();
                              break;
                            case "selectField":
                              _.isEmpty($scope.layout.field1) || _.isEmpty($scope.layout.value1) || app.field($scope.layout.field1).selectMatch($scope.layout.value1, !1);
                              break;
                            case "applyBookmark":
                              _.isEmpty($scope.layout.bookmark1) || app.bookmark.apply($scope.layout.bookmark1)
                          }
                        }
                      };
                      
                      $scope.gotoSheet = function(sheetId)
                      {
                        $scope.doAction();
                        Routing.goToSheet(sheetId, Object.keys(State.States)[State.state])
                      };
                      
                      
                    }]
      
    };
  }
);