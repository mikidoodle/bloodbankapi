## Blood Bank API!
This is the backend for the [JIPMER Blood Bank Project](https://github.com/mikidoodle/bloodbank).

Make sure you've set up the [app](https://github.com/mikidoodle/bloodbank) before you set up the backend.

## Get Started
To begin, clone this repo and run `npm i` or `yarn install` or `bun install` or whatever.
Then, rename `.env.example` to `.env`.

This API uses a couple of services:
- Expo Notifications
- Twilio SDK
- Neon serverless Postgres DB

Here's how you set up each of them:
 ### Expo Notifications
 Log into [Expo.dev](https://expo.dev) and click 'Access tokens' on the sidebar. Click 'Create token' in the 'Personal access tokens' section and copy it into your `.env` file into the `EXPO_ACCESS_TOKEN` field.

 ### Twilio SDK
 Create a [Twilio](https://twilio.dev) account and copy the Account SID and Token into the corresponding fields in your `.env`.

 ### Neon
 This is to store all donor data. Create a [Neon](https://neon.tech) account and create a new database. From the 'Connection Details' section, check 'Pooled connection' and copy the `Connection string` URL into the `DATABASE_URL` field in your `.env`.
 Open the SQL Editor page from the sidebar and run the following command:
 ```sql
 CREATE TABLE users (
    installed BOOLEAN,
    log TEXT[],
    otp INTEGER,
    affiliated BOOLEAN,
    affiliatedata JSONB,
    dob TIMESTAMPTZ,
    distance NUMERIC,
    birthdayhero BOOLEAN,
    id SERIAL PRIMARY KEY,
    lastdonated TIMESTAMPTZ,
    sms BOOLEAN,
    totaldonated NUMERIC,
    weight NUMERIC,
    height NUMERIC,
    created_on TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN,
    name TEXT,
    phone TEXT,
    bloodtype TEXT,
    uuid TEXT,
    medications TEXT,
    conditions TEXT,
    notification TEXT,
    sex VARCHAR
);
```