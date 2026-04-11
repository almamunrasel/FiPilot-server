const admin=require('firebase-admin');

let firebaseApp;

const initFirebase=()=>{

  if(firebaseApp) return firebaseApp;
  const serviceAccount={
    type:"service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    // Vercel stores the private key with literal \n — this fixes it
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),

  };
  firebaseApp=admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),

  })
  console.log("firebase admin initialized")
  return firebaseApp;
}
initFirebase();
module.exports=admin;