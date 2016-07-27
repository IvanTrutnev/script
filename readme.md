# Kurulev script

KS is SPA application that provides:
  - Entering math function
  - Calculating math functions with entered values
  - Drawing chart for this function
  - Sharing formula with other users
  - Viewing shared formulas
  - Like/dislike functionality
  - Edit mode in viewing shared formula
  - Login/logout via google, twiiter, facebook

KS also was builded using [PWA] concept. As service worker was used script generated via [sw-precache]. Thereby it core functionality available in offline.

# [Life demo]

Used frameworks, modules and tools:
  - [Angular.js] - MVVC framework.
  - [Math.js] - formula parsing, calculating
  - [MathJax] - viewing formula
  - [Angular Material] - UI elements in material style
  - [Material Design Data Table] - table UI component
  - [Angular Chart] - chart UI component
  - [Firebase] - hosting, real-time database, login provider
  - [Angular fire] - angular module provided firebase functionality
  - [Gulp] - build system
  - [sw-precache] - caching service worker generator


### Version

0.2

[//]: #
   [Life demo]: <https://kurulev-script.firebaseapp.com/>
   [Angular.js]: <https://angularjs.org/>
   [Math.js]: <http://mathjs.org/>
   [MathJax]: <https://www.mathjax.org/>
   [Angular Material]: <https://material.angularjs.org/latest/>
   [Material Design Data Table]: <https://github.com/daniel-nagy/md-data-table>
   [Angular Chart]: <https://jtblin.github.io/angular-chart.js/>
   [Firebase]: <https://firebase.google.com/>
   [Gulp]: <http://gulpjs.com/>
   [PWA]: <https://developers.google.com/web/progressive-web-apps/>
   [sw-precache]: <https://github.com/GoogleChrome/sw-precache>
   [Firebase]: <https://firebase.google.com/>
   [Angular fire]: <https://github.com/firebase/angularfire>