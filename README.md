# Vanilla Web Development Template

A Linux-based template environment for vanilla web development (HTML, CSS and JS). Linting is handled by `vnu-jar`, `stylelint` and `eslint`. Unit testing is handled by `vitest`. The template relies on custom Bash scripts and it is orchestrated via `make`.

## Dependencies

The template requires the following tools to work:

- `make`, `node`, `npm`, `python3`, `tar`, `zip` and `exiftool`

## Setup

Run `make install` to execute my `checkdeps` script and `npm ci`.

- The `.npmrc` is configured with `ignore-scripts`, `audit` and `save-exact` set to `true` to ensure a secure and transparent installation process.

- I recommend reading through `package.json` before running `make install` to see what you are installing.

Run `make help` to see a list of all available targets and their explanations.

## Template Generation

Run `make **/*.{html,css,js,sh}` to create a corresponding template file utilizing my `mkhtml`, `mkcss`, `mkjs` and `mksh` scripts.

- The configuration files lie inside `bin/config`. They allow you to fine tune the template generation to your specific needs.

- `mksh` generates template Shell scripts with my `bin/lib/minion.lib.sh` Shell library already included. Meaning you can start scripting with lots of my utility functions already included. 

    - You may need to correct the path in `MINION_PATH` inside your template Shell script.

## Linting

Run `make lint` to lint your HTML code inside `src/html`, your CSS code inside `src/css` and your JS code inside `src/js`.

- Run `make lint-{html,css,js}` to access the linters individually.

## Unit Testing

Run `make test-js` to execute your unit tests inside `src/js/test`.

## Server & Website

Run `make start-server` to host your website locally via python.

- You can change the port that is used by changing the `SERVER_PORT` variable in `Makefile`.

Run `make open-site` to open your website with your default browser.

Run `make stop-server` to terminate the local server.

## Build

Run `make strip-src` to execute my `stripdir` script that strips all the EXIF data from every supported file inside `src`.

Run `make build-site` to execute my `bundler` script that takes your production code from `src` and packages it into different archive formats within `build`.

- You can configure the generated archive formats in `bin/config/bundler.conf` to your specific needs.

- You can also add and remove files from the archive generation in `bin/config/bundler.conf`.

Run `make clean` to remove the `build` folder and its content.

## CI/CD

`.gitlab-ci.yml` lints, tests and builds your code with every push to the GitLab repository.

## Full Target List

```
=============== Targets ================

------------- Setup & Help -------------

make install      | Checking for dependencies and setting up NPM
make help         | Listing all targets

------------ File Creation -------------

make **/*.html    | Creating a HTML template file with the given name
make **/*.css     | Creating a CSS template file with the given name
make **/*.js      | Creating a JS template file with the given name
make **/*.sh      | Creating a SHELL template file with the given name

------------- Code Linting -------------

make lint         | Linting all HTML, CSS and JS files in "src"
make lint-html    | Linting all HTML files in "src/html"
make lint-css     | Linting all CSS files in "src/css"
make lint-js      | Linting all JS files in "src/js"

---------- Javascript Testing ----------

make test-js      | Testing all JS files in "src/js/test"

------------ Server & Site -------------

make start-server | Starting the local server on port "8080"
make stop-server  | Stopping the local server
make open-site    | Opening the site hosted on the local server

---------------- Build -----------------

make strip-src    | Removing the EXIF data from every file in "src"
make build-site   | Building the site without dev dependencies into "build"
make clean        | Clearing "build"
```

_(excerpt from `make help`)_

## Changing the Project Structure

If you want to rename a directory, you need to update the paths inside `bin/config`, `config`, `Makefile` and `.gitignore`.

I advise against changing the project layout as it is hardcoded in `Makefile`. You would have to rewrite the rules.
