## How to run this project on local

### Prerequisite
- [Git](https://git-scm.com/)
- [NodeJS](https://nodejs.org/), version 14.x
- [Google Maps API](https://developers.google.com/maps/documentation/javascript/get-api-key#get-the-api-key)
- [Firebase](https://firebase.google.com/docs/web/setup#create-firebase-project-and-app) and [Realtime Database](https://firebase.google.com/docs/database/web/start#create_a_database)

### STEP1. Clone this repository
```
git clone https://github.com/spider-hand/Geoguess-Master.git
```

### STEP2. Get Google Maps API key
See the instruction in the link above.

### STEP3. Register your app on Firebase and create Realtime Database
See the instructions in the link above.

### STEP4. Set up environment variables
Create files named `.env.development.local` in this project to put environment variables. 
The files should look like this. (Replace the values with yours you created at STEP 2 and 3.)

`.env.development.local`
```
NODE_ENV=development
BASE_URL=http://localhost:8080/
VUE_APP_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
VUE_APP_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VUE_APP_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
VUE_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
VUE_APP_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
VUE_APP_FIREBASE_MEASUREMENT_ID=YOUR_FIREBASE_MEASUREMENT_ID
```

`.env.production.local`
```
NODE_ENV=production
...
```

Now you can run this project on local.

### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```
