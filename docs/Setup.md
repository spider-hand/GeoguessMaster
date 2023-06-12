## How to build your own game server

### Prerequisite
- Google account
- [Github](https://github.com/) account
- [Netlify](https://www.netlify.com/) account

### STEP1: Fork this project
Create your [Github](https://github.com/) account if you don't have and fork this project. (Click **Fork** button at the top right corner of this project page.) There should be a copy of this project on your repositories now.

### STEP2. Connect your Nelify account to your Github
You could use any other hosting service but here I use [Netlify](https://www.netlify.com/). Create your Netlify account if you don't have. Then connect your Netlify to your Github. You can do it when signing up or on user settings. (Click the avatar icon at the top right corner and there is **Connected accounts** section there.)

### STEP3. Create realtime database on Firebase
Create your project and register your app on Firebase. You can follow [this instruction](https://firebase.google.com/docs/web/setup#create-firebase-project-and-app). (Just follow Step 1: Create a Firebase project and register your app.) Make sure turning on **Enable Google Analytics for this project** while registering your app.
After registirng your app, follow [this instruction](https://firebase.google.com/docs/database/web/start#create_a_database) to set up your database.

### STEP4. Get Google API key
Go to [Google Cloud Concole](https://console.cloud.google.com/), and create a project. Then go to project top page and select **APIs & Services > Credentials** on the left sidebar. On the Credentials page, click **Create credentials > API key**. The new API key is listed on the **Credentials** page under **API keys**.

### STEP5. Host your website
Click **New site from Git** button on your Netlify top page. Click Github icon and choose your project repository you forked. Build options will look like below. Click **Show advanced** button and **New variable** button will appear. Click **New variable** button and you can set API key and variables you created at STEP 3 and 4. Set variables like below. (Replace the values with yours. The last two key names are `VITE_FIREBASE_MESSAGING_SENDER_ID` and `VITE_FIREBASE_MEASUREMENT_ID`.) Click **Deploy site**. 

That's it! Your site domain will appear on the project page after the project has been deployed. Now you can play games as much as you want!