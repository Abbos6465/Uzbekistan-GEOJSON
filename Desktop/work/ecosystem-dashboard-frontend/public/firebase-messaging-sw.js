importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-messaging.js')


const config = {
    apiKey: "AIzaSyBuhLRqY00ab8CqVGuFOqTj8tmTIc7KPlo",
    authDomain: "testy-6e622.firebaseapp.com",
    projectId: "testy-6e622",
    storageBucket: "testy-6e622.appspot.com",
    messagingSenderId: "415640811508",
    appId: "1:415640811508:web:761b268ecaf78376e52ba1",
    measurementId: "G-FBNWZXMQXX"
};

firebase.initializeApp(config)

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message testku bu ahir', payload);
  
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body
    };
  
    self.registration.showNotification(notificationTitle,
      notificationOptions);
  });
  