## Setup database
Install MySQL (can follow this instruction https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-20-04)

set sql_mode = STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
(https://stackoverflow.com/questions/34115174/error-related-to-only-full-group-by-when-executing-a-query-in-mysql/38179956#38179956)

By default, server will access to database "shop" you need to create database first,
I have prepare script to create table that project needed and insert data sample, you can see them in database folder.

## Build Setup

``` bash
# install dependencies
npm install

# prepare env
create ".env" file inside "server" folder. copy content from ".env.example", replace with your database information and paste to .env file you had created.

# serve with hot reload at localhost:5000
npm start
```

# Link online
