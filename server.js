import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors';

const serviceAccount = {
  "type": "service_account",
  "project_id": "epic-e-sport",
  "private_key_id": "796048968d48b7cfc92a6e0d6e4ba1eb0c780f68",
  "private_key": `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCws+HbFYa3dkAx
/CFEcoz1bHoW1bdIAHma1Eyl5stgFnvibIBTsY2e9VspbGCt8Yd9oZNewBZXoXUO
rsV0upDaPhMXXMWx/3Cn74VcIvfP41vLMkVOM0cNFjsUwSL9fCdZvMAzQWg3jXS+
mo6klTX2Vk2oxK8dW6RQKiKqxDrWHt3ZgxgvwbxmoXBCDaP/8vcxphAOAt7ZY7SV
zqB20U3+gfiNDBD9+FF1PlVVRz8kEyS5l8gytO+6ZKjm1ZFvaqV4Fo8BZwhriyA3
/zEFbpWeWI+lXEpxX+pOWLq00uwGG5aDVCStECZI+exkxGWzLCTvtRvnhtahnY03
03hEeGfZAgMBAAECggEACThBixha8JyjadhBdhxR/YY88o8RIpkfvzPfkfJyXx+d
NCm8ImHLxWUA7i7g9oJ5MtVo5pM4NzdN78evttD7ON/vSBNHn2t4GdMWDsImUvsG
cZo8YoGrbePgjksrg7VkKjr+fk4l3WwskLtowO6mI6XKJImqp2n+L06bg3R8q2pX
fn2Ohvz6P3fSJIwGGZMjzsKzVqzQtXAtKeiAGuNQOaFHaL0vs0DKgHrxM/HNWYbx
7B1cCxuXxX4Ay6kYG8BJxaLwD9NQ7cgZG+/CfSThZJjbwx3aO/cyb5IeJKww1XF4
I3Eckzp5WVUu3WVnwR5CGj7DxxTOO1vP6wfUd0r7FwKBgQDytTk2+vBASAJz8B3r
R9Kp2wM9HY76Bii1WKjR4y61z5dth5WWO4NS4nM9Oy+dGlG5nka99i1fqOreJ/DF
dTHMpV4l4aQTZwQqdIOEF6O/rfzfsr3vZFRmcOeKKvHxXFV+70hfim0Y9Kr5zkqA
EeYlnoZj74SnVjKta3lkW5aBNwKBgQC6YUMaZk20iMYrRSjVFenr8mQ6yTZJ8stn
S2WqY1Dol50+BYfQtXf4TUkdgCuGY2vjom0jziGbJFI0VITpj4KWRiVmHBoxY4dO
GfYyfqpXdOMqZBFIwpjd+2vlRxylWELF8ehbloYcbdW6Dxm40lio2RwAL/a0/aE0
jpHjwzEnbwKBgBnzFFXziIJm8JQyxRAl0rlEaFk9cs76n5mcDBi8wH7B3j/gsjao
0EapXYbbcCDM8pX0/T1MN9e1eL8d6BlEiXmG6MUGFgPZDNH5OSKDYIea86F7O+F/
iaKWSbs1Ej8rDx0OOl+0ritv5WPmEYMV5tR42YeP0VAO4EY4anc3b6ULAoGALDg5
UIEnPIca5VdCSdQqLNXUm/HzVHYrdjV4SIXJw3V9VCLBx23Wqe3ERCCNsxPRnC+E
T3Nvm7xxWIMZCcUHyZmY8/IE8OTZTFlyhSZySc+sufkF9MpetIQbZEmL7VrUdNxh
MaGz7fjNNZixlJ0rddwU/aJjmSt33N1albxQ5DcCgYEAzc+uT6eoDH4kmwWmkIF/
Gt7cf3D0eX+g+e0c4mlv7dWMcsXbbtldohFRKsAWGXwOOVi1TqF3EmHzUCkQGtNo
fBmliD3cdZ3Po9aZxf05WWv+noOzlQwkHckAEuVAdUSGKs6Rk8AbMIawztvR8Kr+
As0ERNfcNpAj4+IrFYlPNWI=
-----END PRIVATE KEY-----`
  ,
  "client_email": "firebase-adminsdk-fbsvc@epic-e-sport.iam.gserviceaccount.com",
  "client_id": "105289591999658971800",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40epic-e-sport.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'Server is live!' });
});

app.post('/send-notification', async (req, res) => {
  const { fcmToken, title, body } = req.body;

  if (!fcmToken || !title || !body) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    await admin.messaging().send({
      token: fcmToken,
      notification: { title, body },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
