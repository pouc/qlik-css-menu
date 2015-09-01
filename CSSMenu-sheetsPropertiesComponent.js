define(
  ["jquery", "touche", "client.property-panel/components/components",
   "objects.error-handling/error-translation", "translator", "objects.add-popovers/add-dimension-popover", "objects.add-popovers/add-measure-popover",
   "general.services/show-service/show-service", "general.utils/support", "client.property-panel/popovers/type-popover",
   "general.components/context-menu/context-menu-service", "text!client.property-panel/components/common/data.ng.html",
   "general.sortable/sortable-item-lists", "extensions.qliktech/pivot-table/pivot-sorting-util", "general.sortable/sortable-list", "client.models/sheet"
  ],
  function($, touche, components, d, translator, f, g, showService, support, typePopover, context, commonPropertiesTemplate, sortableItemLists, n, o, SheetModel) {
    
    var o = {
      template: commonPropertiesTemplate,
      controller: ["$scope", "$element", "$timeout", "qvContextMenu", function($scope, o, p, qvContextMenu) {
        
        var catList = {};
        
        function move() {
          
          $.each(catList, function(k, v) {
            var order = 0;
            v.get().forEach(function(a) {
              a.data.order = order++;
              a.data.catId = k;
            })
          })
          
          $scope.$emit("saveProperties")
          
        }
        
        $scope.$watch('data.cats', function(newValue, oldValue){
          refreshCats()
        }, true);
        
        function refreshCats() {
          
          $scope.sortableItemLists.lists.length = 0
          
          catList = {}
          $scope.data.cats.sort(function(item1, item2) {
            
            return ((item1.order < item2.order) ? -1 : ((item1.order > item2.order) ? 1 : 0));
            
          }).forEach(function(v, k) {
            
            var newCat = $scope.sortableItemLists.createList(2, {
              title: v.catName,
              tid: v.id
            });
            
            catList[v.id] = newCat;
            
          });
          
          $scope.$emit("saveProperties")
          initSheets();
        }
        
        function initSheets() {
          
          SheetModel.getList().then(function(list) {
            
            return list.getLayout();
            
          }).then(function(layout) {
            
            $.each(layout, function(index, item) {
              
              var existingSheets = $.grep($scope.data.sheets, function(value, index) {
                return value.id == item.qInfo.qId
              });
              
              if(existingSheets.length === 0) {
                
                $scope.data.sheets.push({
                  id: item.qInfo.qId,
                  catId: "unassigned",
                  title: item.qMeta.title,
                  showSheet: true,
                  overrideSheet: false,
                  overrideSheetName: item.qMeta.title,
                  order: $scope.data.sheets.length
                });
                
                $scope.$emit("saveProperties")
                
              } else {
                
                if(existingSheets[0].title != item.qMeta.title) {
                  existingSheets[0].title = item.qMeta.title;
                  $scope.$emit("saveProperties");
                }
                
              }
              
              var deleteIndexes = [];
              $.each($scope.data.sheets, function(index, item) {
                
                var existingSheets = $.grep(layout, function(value, index) {
                  return item.id == value.qInfo.qId
                });
                
                if(existingSheets.length === 0) {
                  
                  deleteIndexes.push(index)

                }
              });
              
              if(deleteIndexes.length > 0) {
                for (var i = deleteIndexes.length - 1; i >= 0; i--) {
                  $scope.data.sheets.splice(deleteIndexes[i], 1);
                }
                
                $scope.$emit("saveProperties")
              }
              
            });
            
          }).then(function() {
            
            refreshSheets()

          });
          
        }
        
        
        function refreshSheets() {
          
          $scope.sortableItemLists.reset();
          
          $scope.data.sheets.sort(function(item1, item2) {
            
            return ((item1.order < item2.order) ? -1 : ((item1.order > item2.order) ? 1 : 0));
            
          }).forEach(function(v, k) {
            
            if(!catList.hasOwnProperty(v.catId)){
              v.catId = "unassigned";
              $scope.$emit("saveProperties");
            }

            var newSheet = catList[v.catId].createItem({
              component: components.getComponent("items"),
              definition: {
				type: "sheet",
				items: $scope.definition.sheetDef
			  },
              data: v,
              args: $scope.args,
              id: v.id,
              sortable: true,
              index: v.order,
              templateSrc: "pp-sorting-item.ng.html",
              title: function() {
                return (
                  v.showSheet ?
                  (v.overrideSheet ? v.overrideSheetName + ' (overriden)' : v.title) :
                  (v.overrideSheet ? v.overrideSheetName + ' (overriden)' : v.title) + ' (hidden)'
                );
              },
              typeFlag: 2
            })
            
            catList[v.catId].addItem(newSheet);
            
          });

        }

        var addClikedDialog;
        function hideAddClicked() {
          addClikedDialog && (addClikedDialog.destroy(), addClikedDialog = null);
        }
        
        $scope.addClicked = function(b) {
          var c = $(b.currentTarget);
          
          addClikedDialog = showService.show(typePopover, {
            items:
            [
              {
                translation: "Refresh Sheets...",
                tid: "sheets",
                select: function() {
                  hideAddClicked();
                  initSheets();
                },
                disabled: function() { return false; }
              }
            ],
            closeTypeFoldout: function (targetRef) {
              hideAddClicked()
            },
            alignTo: c
          });
          
        }
        
        $scope.getAddLabel = function() {
          return "Actions"
        }
        
        $scope.hasMultipleAddOptions = function() {
          return !0
        }
        
        $scope.expandClicked = function(a, b) {
          b.expanded = !b.expanded;
          a.stopPropagation();
        }
        
        var contextMenu;
        $scope.openContextMenu = function(a, b) {
          var c = qvContextMenu.menu();
          
          c.addItem({
            translation: "Common.Delete",
            tid: "delete",
            select: function() {
              $scope.removeItem(b)
            }
          });
          
          contextMenu = qvContextMenu.show(c, {
            position: {
              x: a.pageX,
              y: a.pageY
            },
            docking: "Top"
          });
        };
        
        $scope.$on("$destroy", function() {
          hideAddClicked();
          contextMenu && contextMenu.destroy();
        });
        
        $scope.sortableItemLists = sortableItemLists.create({
          options: {
            direction: "vertical",
            listKey: "list",
            listSelector: ".pp-expandable-list",
            itemKey: "item",
            itemSelector: ".qv-pp-sortable",
            itemDragSelector: ".qv-pp-sortable-handle",
            gesture: {
              name: "swipe",
              options: {
                radiusThreshold: support.treatAsDesktop() ? 4 : 0,
                preventDefault: !1
              }
            }
          },
          
          addPlaceholder: function() {
            var a = this._super.apply(this, arguments);
            a.templateSrc = "pp-data-item.ng.html";
            a.classList.push("qv-pp-sortable");
          },
          
          onBegin: function() {
            this._super.apply(this, arguments)
          },
          
          onMove: function() {
            this._super.apply(this, arguments);
            move();
          },
          
          onMoveToList: function() {
            this._super.apply(this, arguments);
            move();
          }
        })

        refreshCats();
        
        /*
        $scope.$watch('data', function(newValue, oldValue){
          $scope.$emit("saveProperties");
        }, true);
        */
        
        
        //refreshSheets();
        
        
        /*
        
        
        
        
        $scope.removeItem = function(a) {
          "measure" === a.type ? $scope.args.handler.removeMeasure(a.index).then(function() {
            $scope.$emit("saveProperties")
          }) : $scope.args.handler.removeDimension(a.index).then(function() {
            $scope.$emit("saveProperties")
          })
        }
        
        $scope.$watchCollection("data.qHyperCubeDef.qDimensions", B)
        $scope.$watchCollection("data.qHyperCubeDef.qMeasures", B)
        $scope.$watchCollection("data.qHyperCubeDef.qInterColumnSortOrder", B)
        $scope.$watch("data.qHyperCubeDef.qNoOfLeftDims", B)
        $scope.$on("$destroy",
              function() {
                y(), v(), J && J.destroy()
              }
             )
             
        */
      }]
    };
    return components.addComponent("CSSMenu-Sheets", o), o
  }
)