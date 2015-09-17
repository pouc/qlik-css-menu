define(
  ["jquery", "underscore", "qlik", "./livequery", "text!./lib/css/themes.json", "./CSSMenu-properties", "./CSSMenu-initialproperties",
   "text!./lib/partials/CSSMenu.ng.html", "client.utils/routing", "client.utils/state", "client.models/sheet", "./CSSMenu-sheetsPropertiesComponent",
   "./CSSMenu-catsPropertiesComponent", "./CSSMenu-colorsPropertiesComponent", "text!./lib/css/colorPick.css", "./textfill"
  ],
  function($, _, qlik, lq, themes, props, initProps, ngTemplate, Routing, State, SheetModel, spComp, cpComp, ccpComp, cpcss, textFill)
  {
    'use strict';

    $('.sheet-title-container').livequery(function(){ 
      $(this) 
      .hide();
    }, function() { 
      
    });
    
    var style = props.items.settings.items.layout.items.style;
    $.each($.parseJSON(themes), function( k, v ) {
      if(!style.defaultValue) style.defaultValue = k;
      if(!style.options) style.options = [];
      style.options.push({value: k, label: v});
    });
    
    $("<style>").html(cpcss).appendTo("head");
    
    return {
      initialProperties: initProps,
      definition: props,
      snapshot:
      {
        canTakeSnapshot: !0
      },
      
      template: ngTemplate,
      
      controller : ["$scope", "$element", function($scope, $element) {
        
        
        
        
        function setCss($scope) {
          
          
          return $.get("/extensions/CSSMenu/lib/css/CSSMenu-" + $scope.layout.style + "-" + $scope.layout.direction + ".css").done(function (cssContent, status) {
            
            if (status == "success") {
              
              $scope.newCss =  cssContent
              .replace(/{{(?!}})(.+)}}/g, function (match, p1, offset, string) {
                return eval(match.replace(/((^layout\.)|(\W)(layout\.))/g, function(match, p1, p2, p3, p4, offset, string) {
                  return (p2 ? '$scope.' + p2 : p3 + '$scope.' + p4);
                }));
              })
              
            }
            
            if($('style#cssmenu').length)
            {
              $('style#cssmenu').html($scope.newCss);
            } else {
              var newStyle = $("<style>");
              newStyle.attr("id", "cssmenu");
              newStyle.html($scope.newCss).appendTo("head");
            }
          });
          
        };
        
        
        setCss($scope).then(function() {

          
        });
        
        
        
        
        
        
        $scope.$watch('layout.cats', function(newValue, oldValue){
          setCss($scope);
          $scope.flattenedSheets = flatten();
        }, true);
        
        $scope.curSheetId = State.getModel().id;
        
        function flatten() {
          var flattened = [];
          
          var order = 0;
          $scope.layout.cats.sort(function(item1, item2) {
            return ((item1.order < item2.order) ? -1 : ((item1.order > item2.order) ? 1 : 0));
          }).forEach(function(catValue, catIndex) {
            
            if(catValue.showCat) {
              
              var pushObject;
              if(catValue.flatten) {
                pushObject = flattened
              } else {
                pushObject = [];
              }
              
              var selected = false;
              $scope.layout.sheets.sort(function(item1, item2) {
                return ((item1.order < item2.order) ? -1 : ((item1.order > item2.order) ? 1 : 0));
              }).forEach(function(sheetValue, sheetIndex) {
                
                if(sheetValue.catId == catValue.id && sheetValue.showSheet) {
                  
                  var selectedSheet = (State.getModel().id == sheetValue.id);
                  pushObject.push({
                    selected: selectedSheet,
                    hasSub: false,
                    order: order++,
                    title: sheetValue.overrideSheet? sheetValue.overrideSheetName : sheetValue.title,
                    id: sheetValue.id
                  });
                  
                  if(selectedSheet) selected = true;
                  
                }
              })
              
              if(!catValue.flatten) {
                flattened.push({
                  selected: selected,
                  hasSub: true,
                  order: order++,
                  title: catValue.catName,
                  sub: pushObject
                })
              }
            }
          })

          return flattened;
        }
        
        $scope.myOrder = function(sheet) {
          return $.grep($scope.layout.cats, function(value, index) {
            return value.id == sheet.catId;
          })[0].order * 1000 + sheet.order;
        };
        
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
          if(State.isInAnalysisMode()) {
            $scope.doAction();
            Routing.goToSheet(sheetId, Object.keys(State.States)[State.state])
          }
        };
        
      }]
      
    };
    
  }
);