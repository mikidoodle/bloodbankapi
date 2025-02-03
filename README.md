## Blood Bank API
> ⚠️ As of Feb 1, 2025, this code is **no longer compatible** with the current app and will be archived as I add support for multiple blood banks and make the move from Next.js API functions (which tbh was a dumb decision) to NestJS. Here's the updated repo: [openbloodfdn/core](https://github.com/openbloodfdn/core)
----

This is the backend for the [JIPMER Blood Bank Project](https://github.com/mikidoodle/bloodbank).

Make sure you've set up the [app](https://github.com/mikidoodle/bloodbank) before you set up the backend.
If you run into any issues, feel free to email me at [mihir@pidgon.com](mailto:mihir@pidgon.com).

## Get Started

To begin, clone this repo and run `npm i` or `yarn install` or `bun install` or whatever.
Then, rename `.env.example` to `.env`.

Generate two random 8-16 character passwords using your favourite password generator and save it into the `HQ_TOKEN` and `HQ_SECRET` fields. You will use the password saved in `HQ_SECRET` to log in to the Blood Center side of the app.

This API uses a couple of services:

- Expo Notifications
- Twilio SDK
- Neon
- Google Maps Geocoding API
  Here's how you set up each of them:

### Expo Notifications

Log into [Expo.dev](https://expo.dev) and click 'Access tokens' on the sidebar. Click 'Create token' in the 'Personal access tokens' section and copy it into your `.env` file into the `EXPO_ACCESS_TOKEN` field.

### Twilio SDK

Create a [Twilio](https://twilio.dev) account and copy the Account SID and Token into the corresponding fields in your `.env`.

### Google Maps Geocoding API

The Geocoding API is used to locate donor addresses on the map to calculate distance from the blood bank.
Follow the [Getting Started](https://developers.google.com/maps/documentation/javascript/geocoding#GetStarted) guide and copy the API key into the `GEOCODE_API_KEY` field in your `.env` file.

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
