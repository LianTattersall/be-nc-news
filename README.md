# Northcoders News API

Hosted API link: https://be-nc-news-mh3z.onrender.com

This repository contains code for seeding a news database and a server to interact with the database. Clients can fetch articles comments and users as well as post new comments edit articles and delete comments.

To connect to the relavant databases locally, create two files in the root directory. One called ".env.test" and one called ".env.development". Within .env.test add a line setting the database to the test database using "PGDATABASE=<test-db-name>". Do the same for the .env.development and set the database to the developmment database using "PGDATABASE=<development-db-name>"

To clone this repository run the command "git clone https://github.com/LianTattersall/be-nc-news.git" in your terminal (in the location you want the repo to be in)

Once you have cloned the repository and you are in the root of the repo, run "npm install" to install the dependencies you will need to run the code.

Next, create the local databases by runnung the command "npm run setup-dbs". You will need postgres installed to be  able to do this.

Finally, to seed the development database run "npm run seed" in the terminal.

If instead you want to run the tests, run the command "npm test". The test data already gets seeded between tests.

Node version: v21.7.3
postgres version: v8.7.3