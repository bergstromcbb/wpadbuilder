### Folder structure

```
├── package.json
├── eslint.json
├── router.js
├── store.js                                - single store
├── rootReducer.js                          - combined reducers
├── index.html
├── app.jsx
├── node_modules/
├── src/
│   ├── core/                               - shared components
│       ├── ribbon/                         - core feature
│           └── (somefile).jsx
│   ├── campaigns/                          - feature folder
│       ├── components/                     - feature components
│           ├── campaignsRepeat.jsx
│           ├── progressBar.jsx
│           └── ribbon.jsx
│       ├── actions.js                      - feature actions
│       ├── reducer.js                      - feature reducers
│       ├── campaigns.jsx                   - feature index page
│       └── summary.jsx                   	- feature index page
├── css/
│   └── style.css                       	- main css styles
├── img/                                	- images folder
│   ├── image1.png
│   ├── image2.png
│ 	└── image3.png
├── dist/                               	- build/distribution folder
│   └── bundle.js