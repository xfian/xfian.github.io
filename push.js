// eslint-disable-next-line no-undef
const webPush = require('web-push');
 
const vapidKeys = {
   'publicKey': 'BMRJy9tZCYNQjK3srrWx3bteZUikrLQpW2hlcQV0mB09mBeI80s7uNAt2ZrXf-Dm_bqfHnIdIxsVzXqVwg8C-1o',
   'privateKey': 'KQPl8bzMcyVVwHepGC9gGZEY2wksHvk4-uf_Hz2Nv5U'
};
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
);

const pushSubscription = {
   'endpoint': 'https://fcm.googleapis.com/fcm/send/eF-LIECenrE:APA91bFdPvz_RIkujlM4WFlBoZ2HLRclNWwJhC52pb0mBcd_zojwRv4YXhQl2jd6fxRRDIvmlMfr2tpODy0NdXh3VYQPJK_OMYiEiAV4pEKsAOcJ0ofwwY_AHJwZnJqUyIH0AZQZ1PME',
   'keys': {
       'p256dh': 'BNdiCI918fVLznmrsn0PSUswwlIaCZh+UKe5fuNqnEXMux/6RDbY05y2Vda+GLDy7JX+5HkoXnBdpZHvV9lSvKQ=',
       'auth': 'oqaBVPXyqbTIA35E5DPC/Q=='
   }
};

const payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
const options = {
   gcmAPIKey: '593267814474',
   TTL: 60
};

webPush.sendNotification(
   pushSubscription,
   payload,
   options
);