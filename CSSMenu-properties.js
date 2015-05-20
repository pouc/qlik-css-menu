define( ["jquery", "underscore", "qlik", "client.models/sheet"], function ($, _, qlik, SheetModel) {
  'use strict';
  
  var panelDefinition = {
    type: "items",
    component: "accordion",
    items: {
      cats: {
        type: "array",
        label: "Categories",
        addTranslation: "Common.Create",
        component: "CSSMenu-Cats",
        ref: "cats",
        catDef: {
          id: {
            ref: "id",
            label: "Id",
            type: "string",
            show: false
          },
          order: {
            ref: "order",
            label: "Order",
            type: "integer",
            show: false,
            defaultValue: -1
          },
          showCat: {
            type: "boolean",
            component: "switch",
            translation: "Show category?",
            ref: "showCat",
            defaultValue: true,
            trueOption: {
              value: true,
              translation: "properties.on"
            },
            falseOption: {
              value: false,
              translation: "properties.off"
            },
            show: true
          },
          catName: {
            ref: "catName",
            label: "Category name",
            type: "string",
            expression: "optional",
            show: function(a) {
              return a.showCat;
            }
          },
          flatten: {
            type: "boolean",
            component: "switch",
            translation: "Flatten?",
            ref: "flatten",
            defaultValue: true,
            trueOption: {
              value: true,
              translation: "properties.on"
            },
            falseOption: {
              value: false,
              translation: "properties.off"
            },
            show: function(a) {
              return a.showCat;
            }
          }
        },
        items: {
          
        }
      },
      sheets: {
        type: "array",
        label: "Sheets",
        addTranslation: "Common.Create",
        component: "CSSMenu-Sheets",
        ref: "sheets",
        sheetDef: {
          catId: {
            ref: "catId",
            label: "Category id",
            type: "string",
            show: false,
            defaultValue: "unassigned"
          },
          order: {
            ref: "order",
            label: "Order",
            type: "integer",
            show: false,
            defaultValue: -1
          },
          showSheet: {
            type: "boolean",
            component: "switch",
            translation: "Show sheet?",
            ref: "showSheet",
            defaultValue: true,
            trueOption: {
              value: true,
              translation: "properties.on"
            },
            falseOption: {
              value: false,
              translation: "properties.off"
            },
            show: true
          },
          overrideSheet: {
            type: "boolean",
            component: "switch",
            translation: "Override sheet name?",
            ref: "overrideSheet",
            defaultValue: false,
            trueOption: {
              value: true,
              translation: "properties.on"
            },
            falseOption: {
              value: false,
              translation: "properties.off"
            },
            show: function(a) {
              return a.showSheet;
            }
          },
          overrideSheetName: {
            ref: "overrideSheetName",
            label: "Override sheet name",
            type: "string",
            expression: "optional",
            show: function(a) {
              return a.showSheet && a.overrideSheet;
            }
          }
        },
        items: {
          
        }
      },
      settings: {
        uses: "settings",
        items: {
          layout: {
            type: "items",
            label: "Layout",
            items: {
              style: {
                type: "string",
                component: "dropdown",
                ref: "style",
                label: "Style"
              },
              textColor: {
                ref: "textColor",
                label: "Text Color",
                type: "string",
                expression: "optional",
                show: !0,
                defaultValue: "#555",
                component: "CSSMenu-Colors"
              },
              backgroundColor1: {
                ref: "backgroundColor1",
                label: "Background First Color",
                type: "string",
                expression: "optional",
                show: !0,
                defaultValue: "#FFF",
                component: "CSSMenu-Colors"
              },
              backgroundColor2: {
                ref: "backgroundColor2",
                label: "Background Second Color",
                type: "string",
                expression: "optional",
                show: !0,
                defaultValue: "#555",
                component: "CSSMenu-Colors"
              },
              activeBackgroundColor: {
                ref: "activeBackgroundColor",
                label: "Active Background Color",
                type: "string",
                expression: "optional",
                show: !0,
                defaultValue: "#888",
                component: "CSSMenu-Colors"
              },
              borderColor: {
                ref: "borderColor",
                label: "Border Color",
                type: "string",
                expression: "optional",
                show: !0,
                defaultValue: "#555",
                component: "CSSMenu-Colors"
              },
              direction: {
                ref: "direction",
                label: "Direction",
                type: "string",
                component: "dropdown",
                defaultValue: "horizontal",
                options: [{
                  value: "horizontal",
                  label: "Horizontal"
                }, {
                  value: "vertical",
                  label: "Vertical"
                }]
              },
              align: {
                ref: "align",
                label: "Horizontal alignment",
                type: "string",
                component: "dropdown",
                defaultValue: "left",
                options: [{
                  value: "left",
                  label: "Left"
                }, {
                  value: "center",
                  label: "Center"
                }, {
                  value: "right",
                  label: "Right"
                }, {
                  value: "space",
                  label: "Space"
                }]
              },
              vertAlign: {
                ref: "vertAlign",
                label: "Vertical alignment",
                type: "string",
                component: "dropdown",
                defaultValue: "top",
                options: [{
                  value: "top",
                  label: "Top"
                }, {
                  value: "center",
                  label: "Center"
                }, {
                  value: "bottom",
                  label: "Bottom"
                }, {
                  value: "space",
                  label: "Space"
                }]
              }
            }
          },
          actionsBefore: {
            type: "items",
            label: "Actions",
            items: {
              isActionsBefore: {
                type: "boolean",
                component: "switch",
                label: "Actions before navigating",
                ref: "isActionsBefore",
                defaultValue: !1,
                options: [{
                  value: !0,
                  label: "Enabled"
                }, {
                  value: !1,
                  label: "Disabled"
                }]
              },
              actions: {
                type: "string",
                component: "dropdown",
                label: "First Action",
                ref: "actionBefore1",
                defaultValue: "none",
                show: function(data) {
                  return data.isActionsBefore
                },
                options: [{
                  value: "none",
                  label: "None"
                }, {
                  value: "clearAll",
                  label: "Clear All Selections"
                }, {
                  value: "unlockAll",
                  label: "Unlock All Selections"
                }, {
                  value: "clearField",
                  label: "Clear Selection in Field"
                }, {
                  value: "selectField",
                  label: "Select in Field"
                }]
              },
              bookmarks: void(0),
              field1: {
                type: "string",
                ref: "field1",
                label: "Field",
                show: function(data) {
                  return ["selectField", "clearField"].indexOf(data.actionBefore1) > -1;
                }
              },
              value1: {
                type: "string",
                ref: "value1",
                label: "Value",
                show: function(data) {
                  return ["selectField"].indexOf(data.actionBefore1) > -1
                }
              },
              bookmark1: {
                type: "string",
                ref: "bookmark1",
                label: "Bookmark Id",
                show: function(data) {
                  return ["applyBookmark"].indexOf(data.actionBefore1) > -1
                }
              }
            }
          }
        }
      }
    }
  };
  
  return panelDefinition
});