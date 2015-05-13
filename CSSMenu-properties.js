define( ["jquery", "underscore", "qlik"], function ($, _, qlik) {
  'use strict';
  
  var bookmarks = void 0,
    style = (qlik.currApp(), {
      type: "string",
      component: "dropdown",
      ref: "style",
      label: "Style",
      defaultValue: "default",
      options: [{
        value: "default",
        label: "Default"
      }]
    }),
    align = {
    ref: "align",
    label: "Alignment",
    type: "string",
    component: "dropdown",
    defaultValue: "left",
    options: [{
      value: "left",
      label: "Left"
    }, {
      value: "right",
      label: "Right"
    }]
  },
    isActionsBefore = {
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
    actionBefore = {
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
    field1Enabler = ["selectField", "clearField"],
    field1 = {
    type: "string",
    ref: "field1",
    label: "Field",
    show: function(data) {
      return field1Enabler.indexOf(data.actionBefore1) > -1
    }
  },
    bookmark1Enabler = ["applyBookmark"],
    bookmark1 = {
    type: "string",
    ref: "bookmark1",
    label: "Bookmark Id",
    show: function(data) {
      return bookmark1Enabler.indexOf(data.actionBefore1) > -1
    }
  },
    value1Enabler = ["selectField"],
    value1 = {
    type: "string",
    ref: "value1",
    label: "Value",
    show: function(data) {
      return value1Enabler.indexOf(data.actionBefore1) > -1
    }
  },
    settings = {
    uses: "settings",
    items: {
      layout: {
        type: "items",
        label: "Layout",
        items: {
          style: style,
          textColor: {
            ref: "textColor",
            label: "Text Color",
            type: "string",
            expression: "optional",
            show: !0,
            defaultValue: "#ffffff"
          },
          backgroundColor1: {
            ref: "backgroundColor1",
            label: "Background First Color",
            type: "string",
            expression: "optional",
            show: !0,
            defaultValue: "#36b0b6"
          },
          backgroundColor2: {
            ref: "backgroundColor2",
            label: "Background Second Color",
            type: "string",
            expression: "optional",
            show: !0,
            defaultValue: "#2a8a8f"
          },
          activeBackgroundColor: {
            ref: "activeBackgroundColor",
            label: "Active Background Color",
            type: "string",
            expression: "optional",
            show: !0,
            defaultValue: "#1e6468"
          },
          borderColor: {
            ref: "borderColor",
            label: "Border Color",
            type: "string",
            expression: "optional",
            show: !0,
            defaultValue: "#133e40"
          },
          align: align
        }
      },
      actionsBefore: {
        type: "items",
        label: "Actions",
        items: {
          isActionsBefore: isActionsBefore,
          actions: actionBefore,
          bookmarks: bookmarks,
          field1: field1,
          value1: value1,
          bookmark1: bookmark1
        }
      }
    }
  },
    panelDefinition = {
    type: "items",
    component: "accordion",
    items: {
      settings: settings
    }
  };
  return panelDefinition
});