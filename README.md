# Netlify Migration Starter

## Pre-requisites
- Node v14
- Yarn
- Netlify dev
- [httrack](http://www.httrack.com/page/2/en/index.html)

## Getting Started
1. Make sure you have the following tools downloaded ☝️
1. Create the necessary group in **AAAEM > Site Bakery** Gitlab.
1. Create a fork of this repository.
    1. Destination of the fork should be the new group created.
    1. Name of the fork should be name of the project with **-static** appended.
        1. Example: AAAEM > Site Bakery > Dont Mesh Around (new group) > dontmesharound-static (forked repo)
1. [Migrate the site](#Migrating-the-site)

## Migrating the site
1. Clone down the forked repository
1. Install dependencies `yarn`
1. Pull the site down using **httrack** ```
httrack "https://www.{domainURL}/" -O "" "+*.{domainURL}/*" -v```
    1. Example: `httrack "https://www.dontmesharound.com/" -O "" "+*.dontmesharound.com/*" -v`
    - This process can take a few minutes.
    - All sites files shoule be placed in `src` folder.
1. Once that is complete, in Terminal navigate to `src` directory
1. Run `yarn start` (Starts a server with browser-sync.)
1. Compare the local site with the live site
    - Verify content matches
    - Verify all pages
    - Verify interactions work as expected
    - Verify integrations work as expected (forms, etc...)
    - Fix any broken functionality due to migration.
