import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors';

const serviceAccount = {
  "type": "service_account",
  "project_id": "epic-e-sport",
  "private_key_id": "1297311efacda2eeeff93fb6abae5342f7c85339",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCxul+syg3BEnmf\nlJNCJJWFkkvGXyor93Y6kD8zF6JKzDxR9B+9opp+uyqXl50uFUiSxMNYk716Ki5j\nc/5hNeWEhmi8OT+BWExabduKNHGFwZGHI447aHMe1mRPszzlObO8L7BurYHsiYxA\nwaHVAzCgnWmoWfP6OCJoI/wGqef5MyU5TPDruP+3yJSjfFpZ51iWb9ORFXJ48IPS\n2F7GSyNcn1kOPYVIJGtKX2uK7ZIeN5lxs80IyH1lp2iQDCY6OljZwRFxjobWY6+5\nC4ko5tG2y3e5gzGUwrOpknUvxwjGW9KvxcvMCbwasHo6vbMUMn0vPOBT9vM/6oJ9\ne/2Q5wyxAgMBAAECggEAHB3gBPXyNxk1JIncwhoHjZoXYsqrYUlE6v7nAK48fpjQ\n8iYs31NaHbJ+inzx4Nh9Irr+LIUy9KC3tgQjuj1MkiqxZxWndk8BxUyb7sFdNEvr\nOfXmCn/7tmU0eWdhuuHmDV9+CgRpCYK5LYV0lL5scvx0Oq4AaxV2XANVW7iFembY\npHwOj8MaP4sFm+6HdKFZj8D54lGFX/FzbB34mXH3hHFeQ+kyIsOcjTk0nRxs84s+\nJjBxlQev1l+f63t6m65o3uDXj4uJJWS5IOiVNqRtVAhfe1+tX0Uqo8RcG1SNwlcj\nV/DA63TtlbKTg516hIS6C70/02PwJqS9bDeF5wZaAQKBgQD6C49VjF2cKRO6zBHN\nxPlit1WQvKj0C/twHcKFi7iXExMeW693tLlJXqAFdbRusuBERn1vJQo2+jKF/7Cv\nvBA/w/To12GrCopA5Kf1zaZJwa7RPbJ7jK5uvDHWnOTzljyd4n8Hyi1B0MdVss9o\n4akDeyC7k4litWw1yiLh3dbvQwKBgQC19evBAa+vWA7MPNhK7GpzFCz8bW0YEYeP\n0RmuxinVNyfRFe0dFUB7lEv+0NoTOPdKd354nmDrmntyF5T90nwojzyXmuOOvH6a\n8ABDkre93z4kz5bQ6/eUglckHL5NgvbFBatJobeDggFouUn9gZFpfpiykCM0oBna\ngQ2ZXW1S+wKBgG/62VgwooObCdDwL1D908nX3SQSuX+CFjrhuQnhxusxibBg0zZC\n42/uRq/rRMEGrtUk1GwAJJD2f8Xu+ovZJ1XHRlk4i+7zq3LgdC/qx3vkl4vxm4sl\nN8Ez2wYIAajtMXxrwQQWESqWe47vo1+PIAgFDmWy7yYbpbh5LCIHHYjNAoGAXvDg\nwMTzeQb2OaSpqnYumLr3OgKSgJNs6yJMR0AIRcLQmKzbGmijS5e2C0/H6W24wfcV\nWzQwF95z+LTLPaDcvYD3OZdMkoZRfOArExbznjNkRmq2I25rsOZNN39z4BesUGLD\n29hwW0KzH4RGUeqQB75RSCIi7Gt48eSSRupTh48CgYEAtUV+IF9jvgZ2IXEZJk0z\nuiAGLFtq0T08yGkNuipZE0ADzM1gsz2IofLvbN98gbeAfRHF/muA5Kz3wYGPl21S\nzO4/j92palw+DNugpiQcdDicmhDphbfo5Ffrxy0utYfyZCJFERUu1rQMFunHIiT0\nySSIfZUmomN/PHGbJTyjoyQ=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@epic-e-sport.iam.gserviceaccount.com",
  "client_id": "105289591999658971800",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40epic-e-sport.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Server is live!' });
});

// FCM notification endpoint
app.post('/send-notification', async (req, res) => {
  const { fcmToken, title, body } = req.body;
  if (!fcmToken || !title || !body) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    await admin.messaging().send({
      token: fcmToken,
      notification: { title, body }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
