define(
  ["jquery", "touche", "client.property-panel/components/components",
   "objects.error-handling/error-translation", "translator", "objects.add-popovers/add-dimension-popover", "objects.add-popovers/add-measure-popover",
   "general.services/show-service/show-service", "general.utils/support", "client.property-panel/popovers/type-popover",
   "general.components/context-menu/context-menu-service", "text!client.property-panel/components/common/data.ng.html",
   "general.sortable/sortable-item-lists", "extensions.qliktech/pivot-table/pivot-sorting-util", "general.sortable/sortable-list", "client.models/sheet", "./uuid"
  ],
  function($, touche, components, d, translator, f, g, showService, support, typePopover, context, commonPropertiesTemplate, sortableItemLists, n, o, SheetModel, uuid) {
    
    var o = {
      template: commonPropertiesTemplate,
      controller: ["$scope", "$element", "$timeout", function($scope, o, p) {
        
        var catList;
        
        function move() {
          
          var order = 0;
          catList.get().forEach(function(a) {
            a.data.order = order++;
          })

          $scope.$emit("saveProperties")
          
        }
          
        function refreshCats() {
          
          $scope.sortableItemLists.reset();
          

          $scope.data.cats.sort(function(item1, item2) {
            
            return ((item1.order < item2.order) ? -1 : ((item1.order > item2.order) ? 1 : 0));
            
          }).forEach(function(v, k) {
            
            var newCat;
            if(v.id == "unassigned") {
              
              newCat = catList.createItem({
                component: components.getComponent("items"),
                definition: $scope.definition.catDef,
                data: v,
                args: $scope.args,
                id: v.id,
                sortable: true,
                index: 0,
                type: "category",
                templateSrc: "pp-sorting-item.ng.html",
                title: function() {
                  return v.catName;
                },
                typeFlag: 1
              })
              
            } else {
             
              newCat = catList.createItem({
                component: components.getComponent("items"),
                definition: $scope.definition.catDef,
                data: v,
                args: $scope.args,
                id: v.id,
                sortable: true,
                index: 0,
                type: "category",
                templateSrc: "pp-data-item.ng.html",
                title: function() {
                  return v.catName;
                },
                typeFlag: 1
              })
              
            }
            
            catList.addItem(newCat);

          });
          
        }
        
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
                translation: "Category",
                tid: "category",
                select: function() {
                  
                  hideAddClicked();
                  
                  $scope.data.cats.push({
                    id: uuid.uuid(8, 16),
                    catName: "New category (click to rename)",
                    showCat: true,
                    flatten: false,
                    order: $scope.data.cats.length
                  });
                  
                  refreshCats();
                  
                  $scope.$emit("saveProperties")

                },
                disabled: function() { return false; }
              }
            ],
            closeTypeFoldout: function (targetRef) {
              hideAddClicked();
            },
            alignTo: c
          });
          
        }
        
        $scope.getAddLabel = function() {
          return translator.get($scope.definition.addTranslation)
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
          var c = context.menu();
          
          c.addItem({
            translation: "Common.Delete",
            tid: "delete",
            select: function() {
              $scope.removeItem(b)
            }
          });
          
          contextMenu = context.show(c, {
            position: {
              x: a.pageX,
              y: a.pageY
            },
            docking: "Top"
          });
        };
        
        $scope.removeItem = function(a) {
          var removeIndex;
          $scope.data.cats.forEach(function(value, index) {
            if(value.id == a.id) removeIndex = index;
          });
          
          $scope.data.cats.splice(removeIndex, 1);
          
          move();
          refreshCats();
        }
        
        $scope.$on("$destroy", function() {
          hideAddClicked();
          contextMenu && contextMenu.destroy();
        });
        
        catList = $scope.sortableItemLists.createList(1, {
          title: "Categories",
          tid: "categories2"
        });
        
        var existingUnassignedCat = $.grep($scope.data.cats, function(value, index) {
          return value.id == "unassigned"
        });
        
        if(existingUnassignedCat.length === 0) {
          
          $scope.data.cats.push({
            catName: "Unassigned",
            id: "unassigned",
            showCat: true,
            flatten: true,
            order: $scope.data.cats.length
          });
          
        }
        
        
        
        refreshCats();
        
        
        
        
      }]

    };
    return components.addComponent("CSSMenu-Cats", o), o
  }
)