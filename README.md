# Viam Codelabs

## What are Viam Codelabs?
Viam Codelabs are interactive tutorials and self-serve demos written in markdown syntax. Codelabs provide a unique step-by-step reading experience and automatically saves tutorial progress for readers. These tutorials are published at [codelabs.viam.com](https://codelabs.viam.com/)

You can submit your own Codelabs to be published on Viam's website by submitting a pull request to this repo. This repository contains all the tools and documentation you’ll need for building, writing, and submitting your own Codelab!


## What's special about the Codelabs format?

* Powerful and flexible authoring flow in Markdown text
* Ability to produce interactive web or markdown tutorials without writing any code
* Easy interactive previewing
* Support for multiple target environments or events (conferences, kiosk, web, offline, etc.)
* Support for anonymous use - ideal for public computers at developer events
* Looks great, with a responsive web implementation
* Remembers where the student left off when returning to a codelab
* Mobile-friendly user experience

## Getting Started

### Prerequisites

  1. [Install mise-en-place (mise)](https://mise.jdx.dev/getting-started.html#quickstart)
     - Not sure if you have it installed? Run `mise` or `mise -v` at the command line and hit enter. If you encounter a "command not found" error, you likely do not have it installed.
  2. Install Node (required to run the site locally) using mise automatically by entering the `site/` directory from the terminal: `cd site/`
     - If you'd like to explicitly install Node using mise: `mise install node@latest`
     - If you have [Homebrew](https://brew.sh/) installed and don't want to use mise, run: `brew install node`
  3. Install gulp-cli `npm i -g gulp-cli`
  4. Install Go using mise automatically by entering the site directory from the terminal: `cd site/`
     - If you have [Homebrew](https://brew.sh/) installed, run: `brew install golang`
     - Follow the [Golang docs](https://golang.org/doc/install) if you don't want to use mise or Homebrew
     - Install claat `go install github.com/googlecodelabs/tools/claat@latest`
     - Ensure go and claat is in your `PATH` by running `which go` and `which claat`. If nothing is returned, see [claat path setup](#common-errors)
  5. **Optional**: install the live-reload plugin for Chrome: [LiveReload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)

### Run locally

  1. Fork this repository to your personal GitHub account (top right of webpage, `fork` button)
  2. In your terminal, clone your new fork `git clone git@github.com:<YOUR-USERNAME>/viamcodelabs.git viamcodelabs`
  3. Navigate to the site directory `cd viamcodelabs/site`
  4. Install node dependencies `npm install`
  5. Run the site `npm run serve`
  6. Open a browser to http://localhost:8000/

Congratulations! You now have the Viam Codelabs landing page running.

### Common Errors

#### 1. Claat related errors
   - Make sure Go is properly in your `PATH`. Add the following lines to your profile (`~/.profile`, or `~/.zshrc`):
````bash
#adding Golang to path
export PATH=$PATH:/usr/local/go/bin
export PATH=$PATH:$HOME/go/bin
````
  ***Note:** After adding Go to your `PATH`, be sure to apply your new profile: `source ~/.profile` or `source ~/.zshrc`*

#### 2. You get a `EACCES` error when installing `gulp-cli`
   - This means that your npm location needs to be updated. Follow the steps here: [Resolve EACCESS permissions](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally#manually-change-npms-default-directory)

#### 3. You get `Error: Cannot find module 'postcss'` when running `npm run serve` 
   - The module may not have been installed for some reason so run `npm install --save-dev postcss gulp-postcss` and then rerun `npm run serve` 

## Write Your First Codelab

All commands and instructions are in the context of the `site` directory:

  1. If the server is running, terminate it with `ctrl C` and navigate to the `viamguides` source directory `cd viamguides/src`
     - In this directory, you will see all existing guides and their markdown files.
  2. Generate a new guide from the guide template `npm run template <GUIDE-NAME>` 
      - Don't use spaces in the name of your guide, instead use hyphens, they are better for SEO.
  3. Navigate to the newly generated guide (`cd viamguides/src/<GUIDE-NAME>`) and edit your guide in a text editor, like [VS Code](https://code.visualstudio.com/).
      - To open the current directory in VS Code running the following command in the terminal: `code .`
  4. From the terminal, run the website server again: `npm run serve`
  5. As you edit and save changes, your changes will automatically load in the browser.

#### Tips

- Review the [sample.md](site/viamguides/src/sample/sample.md) file to learn more about how to structure your Codelab for the claat tool. 
- You can see the supported Codelabs categories [here](site/app/styles/_overrides.scss). If you want to suggest a new category please create a GitHub issue.
- Check out [how to use VS Code to write markdown files](https://code.visualstudio.com/docs/languages/markdown)

## How do I get my Viam Codelabs on [codelabs.viam.com](https://codelabs.viam.com)?

1. Fork this repository
1. Clone it to your local system
1. Make your updates on your locally cloned repo
1. Run the site locally again via `npm run serve` and make sure your Codelab guide shows up as you expect it. Pay close attention to the layout and format. If you are unsure, use this [Codelab](https://codelabs.viam.com/guide/postman-grpc-apis/index.html#0) as a template to follow.
1. Push the updates back to your repo
1. Open this repository on GitHub.com
1. Click the Pull Request button to open a new pull request
1. Viam will review and approve the submission

To learn more about how to submit a pull request on GitHub in general, check out GitHub's [official documentation](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork).
