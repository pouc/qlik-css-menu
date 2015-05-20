# CSSMenu
CSSMenu Object Extension for Qlik Sense

This extension for Qlik Sense displays a menu to help navigating between sheets.

Just drag and drop the extension on a page and resize it. You can then create a master item and display it on every sheet of the application.

# Categories properties

You can create categories to regroup sheets together. Expand the newly created category to change its name. Then go to the Sheets properties to drag & drop sheets to the newly created category.

You can also hide a category (this will also hide all the sheets that it contains).

Finally you can flatten a category. This will hide the category and display all the sheets at the main level. This will enable you to sort/hide several sheets together by acting on the flatenned category.

To delete a category, right click on it and delete it. All the sheets that it contains will go to the "Unassigned" category.

# Sheets properties

You can't create sheets because this extension is mapped to the sheets of the application.

If a sheet is added, you need to go to the sheet properties to add it to the menu. This addition is done automatically when you open the sheet properties. If it is not added, click on the "Actions" button in the sheet properties to refresh the list of sheets.

You can hide a single sheet and rename it.

# Layout properties

In the layout you can select a theme (for now there is only a default theme but contributors are welcome to add more).

You can also select colors using the picker and change alignement options.

# Actions properties

If you want you can set an action to be executed before navigating to a sheet.

# Credits

This extension is inspired by the swr-sheetnavigation extension of Stefan Walther
