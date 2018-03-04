# Google Images Direct Links
**Adds direct links to pictures and source pages to Google image search results.**

The other day I noticed that Google Images had changed for me.
Clicking on a picture no longer opens the result page, but slides an (albeit neat looking) panel open, providing me with the links.

I don't want that, so I wrote a userscript that will add a "+" button to every picture. Click that button to go to the image directly, and click the source link info to go to the source page.

**Update 2018-03-05:** Direct links are now plain links, stopping the click event from bubbling up to google's handler.
Click the plus sign for the picture and the source info for the site. Frees up CTRL+Click for standard behavior (open in new Tab), as the links now open in the same tab by default.

**Due to the mysterious ways in which Google works, we don't always get the direct links right away**, but rather a href="#" at first.
This is why it might take a while for the script to "work".
While a link is loading, a faint "..." appears instead of the "+" symbol.

Hope you like it :)
