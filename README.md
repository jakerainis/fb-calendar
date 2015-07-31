# Genuine init - Genuine's Front End Starting Point

An all-compassing department-maintained starting point for front end projects to help developers get up and running quickly.

## Dependencies
* [Node JS](http://nodejs.org/)
* [Ruby](https://www.ruby-lang.org/en/)
* [Bundler (Ruby Gem)](http://bundler.io/)
* [Gulp](http://gulpjs.com/)

## Installation
Once you have installed the above dependencies:

1. Clone this repository into your development folder
2. Copy all files except for the .git directory into a new project folder
3. `cd` into the root of the new project folder and run `npm install && bundle install` from the command line

## Running
From the root of the project, two commands can be issued from terminal:

1. `gulp`: Builds project with sourcemaps from the `app` folder into the `build` folder, spawns a Node server, opens a new browser with the website at http://localhost:3000, and listens for subsequent changes. When you edit and save a new file, Gulp will recompile accordingly and refresh your browser window with the latest changes.
2. `gulp build`: Builds project from the `app` folder into the `build` and uglifies JS. This should generally be run before committing/pushing your code to the repo.

## Project Architecture
#### Folder Structure
* `app/`: _All_ work should be done in the `app` folder. This is where all of your website's code lives.
* `build/`: When Gulp runs, it takes all of the files from `app` and compiles them into `build`. If you work out of the `build` folder, your work will be overwritten.
* `gulp/`: This contains all of the Gulp tasks that the project relies on. There is also a config.js file that most of the tasks reference to make file paths more manageable.
* `node_modules/`: The folder where node_modules are installed when you run `npm install`.
* `.jshintrc`: The configuration file that dictates syntactical rules for JS linting. These should be followed closely.
* `Gemfile`: The package file that contains the project's gem dependencies. These are installed when you run `bundle install`.
* `gulpfile`: This references all of the tasks in `gulp/tasks/`. The tasks are broken apart for organizational purposes and referenced from this root file when you run `gulp`.
* `package.json`: The package file that contains the project's gem dependencies. These are installed when you run `npm install`.

#### Atomic Organization
To encourage organization, scalability, and code-reuse, we generally take an [Atomic Design](http://bradfrost.com/blog/post/atomic-web-design/) approach when structuring our HTML and SASS. Our SASS partials and HTML includes are broken apart in folders denoted by Atomic-style building blocks (atoms/pieces, molecules/components, organisms/regions, etc.).

## Usage
#### Writing HTML
Your HTML lives in the `app` folder, and can contain references to reusable includes (which live in `app/includes/`). For example:

    //= include includes/1_core/head.html

This allows you to write a piece of code once and reuse it in multiple places. When Gulp runs, it takes these includes and compiles the full HTML into the `build` folder.

_Note: The paths in which these includes are referenced are relative to the HTML file you are authoring. If you include an include from another includer include, that path will need to be prefixed with `../` accordingly._

#### Writing SASS
##### SASS Structure
Your styles live in the `app/styles/sass` folder. This folder is organized atomically:
* `0_utility/`: This contains font declarations, helper declarations, mixin declarations, variable declarations, and  [Normalize](http://necolas.github.io/normalize.css/)
* `1_core/`: All bare (classless) HTML is styled in the `html-elements` folder. Icons are specified in the `_icons.scss` partial and the site's grid system is specified in the `_layout.scss` partial.
* `2_pieces/`: This is where your "Atoms" live.
* `3_components/`: This is where your "Molecules" live.
* `4_regions/`: This is where your "Organisms" live.
* `5_pages/`: This is where your "Layouts" live.
* `screen.scss`: This contains globbing patterns that `@include` the partials in the above folders.

##### Updating Icomoon Set
Init comes with a generic font set of icons that includes common things like arrows and social chiclets. To add more, upload the `selection.js` in `app/fonts/icomoon`. From here, you can add and remove icons, then re-export. When you re-export, make sure you save the updated `selection.json`.


#### Writing JS
##### JS Structure
Init comes with a JS module loading system. This is how the JS folder is structured:
* `libs/`: This is where your vendor libraries/plugins live. Alternatively, you can use [Bower](http://bower.io/) if you really prefer.
* `modules/`: This is where your JS modules live.
* `modules/index.js`: This is the "module registry". It is essentially an object that contains a key/value for each module in the project.
* `app.js`: This is your application bootstrap. All JS kicks off from here.

##### Create A New Module Using The JS Module Loader

Create a new folder in `app/scripts/modules/`. Name the module in camelCase (for example, `app/scripts/modules/sampleModule/`), then create a new JS file in that folder with the same name + .main.js (for example, `app/scripts/modules/sampleModule/sampleModule.main.js`). This naming convention must be followed for the folder and the main file. All modules should be written in the CommonJS fashion:

```js
'use strict';
var $ = require('jquery'); //import jQuery
var somethingElse = require('./something-else.js'); //import something else

//Module constructor
function SampleModule($el) {

   //Your code goes here.

}

//Export the constructor for instantiation
module.exports = SampleModule;
```

Now add that modules to the module registry's module.exports object (in `app/scripts/modules/index.js`):

```js
module.exports = {
  sampleModule: require('./sampleModule/sampleModule.main')
};
```

Then reference the new module from somewhere in the HTML with the `data-module` attribute:

```html
<section class="outer-wrapper" data-module="sampleModule">
  <div class="inner-wrapper">
    <h1>Homepage Template</h1>
  </div>
</section>
```

That's it! Now, when the page loads, `app/scripts/app.js` runs the code below. This code loops through all of the `data-module` attributes on the page and instantiates a `new` version of that module via the reference in the module registry:

```js
$('[data-module]').each(function(i, v) {
  var name = $(v).data('module');
  var module = new moduleRegistry[name]($(v));
});
```

_Note: The module loader passes a jQuery object of the element that contains `data-module`. This allows for easy scoping if you need to load more than one instance of the module on a page._

##### Using Third-Party Libraries/Plugins
Some plugins can not be added via NPM. To add a non-NPM file to your project, manually save it to the libs folder (or alternatively, you can use Bower). Then, in `package.json`, include a path to the new file in the `"browser"` section. If it is a jQuery plugin, you might also need to add it to the `"browserify-shim"` section. This tells Browserify that it depends on jQuery to run.

Now, include it in your module as you would a regular npm module:

```js
var newPlugin = require('newPlugin');
```


#### Using Sourcemaps
Init leverages JS and SASS sourcemapping for easy debugging. The sourcemaps are already automatically built — all you need to do is set them up in your browser.

1. Run `gulp` to get your server running.
2. In Chrome Inspector, go into settings and make sure sourcemaps are enabled for both JS _and_ CSS.
3. Open the "Sources" tab in the inspector, and in the side pane on the left, right-click and select "Add Folder to Workspace". Select the root folder of the project, from your file system.
4. At the top of the browser, Chrome will prompt you for access. Click the "Allow" button.
5. In the left side pane of the Sources tab, you should now see your project folder. Expand it and and drill down to any one of your SASS partials. Click it once. In the middle pane, an alert should come up asking if you want to map the workspace resource. Click the "more" link to expand the dialog, then click "Establish the mapping now...".
6. A list of files should come up. Select the one that matches the file you just clicked on (generally the first one).
7. Inspector will want to restart.
8. That's it! Your local files should be tied to the sourcemaps the site loads. Now, when you inspect an element, look at the CSS pane and it should have a link to the exact partial for each rule declaration.

## Common issues

#### When I run `gulp`, the command line errors out. WTF?
Make sure you've installed _ALL_ dependencies specified above. Also, make sure you have up-to-date versions of Ruby and Node.

#### Why is Gulp not picking up on changes that I made to a file?
When you edit a Gulp task, a config file, or add any new file to the `app` folder, you must stop and restart Gulp.
