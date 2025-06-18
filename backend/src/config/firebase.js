const admin = require('firebase-admin');

// Configuration Firebase
const serviceAccount = {
  // Vous devrez remplacer ces valeurs par celles de votre projet Firebase
  "type": "service_account",
  "project_id": "phishtracer-693ae",
  "private_key_id": "0fe93163ad745240c302dabbc6f173a09f0c9fb5",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDTXIbXwf0dNTH+\nolI1Sl7/YmokHzzb0AL29HLq+exN+Vh2RFLicxXAZvwr4w+OKdf2a2jZx0hCbXTy\nsYvhrDHRHGV/WdlrtI0G7KtPRFjHt3mDT8WJX8WcMofMvGFlCh/ybnN/aiZPySEr\nMgyEnT+ZQ+uKbrxlnbbd/jubb3WOdtNFVlI+hnujLZZvqiUHzwMOecE+0eHqjD1W\ny/uMf/HQ4eQjmKt9+6aqUXCyVArmJlu67F6bsVhnqhZGyhmQ/n49FeVIedfPQ5DJ\nb4R+vqo7QlkK7rYZ3TUFEI+IKfnT/h3dQG0OdjvXfRLPbCP2SVSUEBDEbuKvwzjf\nBlXhgPJBAgMBAAECggEADw9Tkc3CENnUmDu9XwvvqSN8Y9rAcbqYbXt1MToxzMwA\nkjuzyqwPz5Pe8asV9YeUelvEnqjRBJ+rMqw1JvUnnwpWjoyKvf6BQm4sViNs7n0L\nmNA/J1bGPCcLD0rYZzRBmrrlOp3IAU0X0o24P9469PsWjjht7tEeIaLu4Rg/4HDE\njDsD12lLBGD+TGlCrkYAqMbShPdkoYtpgY12E9vTRkQEAAWjADSX9f/VIQoj6OtX\n5frZg9LnIkRc8TnRfx+BTFixnHUyjwoV78hGtV2+VIR5odhdLkbg7ohUt30S9b5c\nhWc+8l/EIt60ZEA0pY1BlW0/LF5ltP3bzOnPj88JGQKBgQD4du48p/iXfVdJfcZ5\n1Rz9hB4wDsfHmJHRqYQt5cu0UPEuxh8/HYhaF9D9wPF9EDjT/Wi52WMNqMcU3k+n\n3uUeqFwVj8mMv7Rx2E3/o90cUiPzHMPGQSTxcRP2J7ALJjembW8A3nWlBhKYMLsZ\nrfrav4Cevp79DRSXmT28EJ30eQKBgQDZxYddCFZttxTkIvWAZMI9MoF87byQnd0d\ngkmuQvQEzvUrNCv+COhV9l1+IHgw7BGukHGILF8AXOfVBIXVwbIsrf4WkjF5crYN\njMYTYqpBVHp/mNnAGGuOVxJNTpaX8/Nri99bEAk5HLymd27zVsAvDmaAVPVC3DUy\nMcKub7OqCQKBgQC0uCyISdRyu2QlvCoEq5Gug85BPj7pWnuVeCsAB0inGsiSMODB\nU4W9od0M9K2xPX9YEdV+eDOn178V2q0teN5F8kcoF7GNglKJC7+P1WwaEVS8m4t6\nRB/OzWSrgip1sZKAptA6XZRMN6KGt8se3oC7Ytb2n8ecX0s/COLyS1PYYQKBgQDN\nlwTfGJL3y2MGqdZZ20XhHoBOn+ZoJRDt3eWPhZf3viaJHhz2HBSzqv3CqAawMP3U\nbnswUqtxnUQkv7tV/SInui9pwaTBgkFK837AKGKRgJ6RPY09JBDOdXdK0omrdNx2\nyLsZrj720yFqitCNHHYdNpwgRZSyBVCXTZD8u2nDeQKBgH/XtvH31gu13OsVxSTP\nb+pSRF975+1R9EPJEQMrCFoky8qmv+6Ujp8Q8xBagx1ZEwea7iM/Rdj31R2oOKfo\nl/8bwQohqczYODU1GC30+co9Kt8sMv8dUoLol1iXdag0ShPfII9+H2kik7CokGlW\ncOC+wsnIkxvuckt6TY4NiyQR\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@phishtracer-693ae.iam.gserviceaccount.com",
  "client_id": "105165895850982292001",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40phishtracer-693ae.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

// Initialisation de Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { admin, db }; 