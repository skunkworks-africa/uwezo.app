
import {
  collection,
  addDoc,
  setDoc,
  Timestamp,
  doc,
  updateDoc,
  getDoc,  
} from "firebase/firestore";
import { db } from "@/lib/firebase";

//This code inserts a new Firestore document representing the new review.
//eslint-disable-line 
export async function addClient(review:any) {



            await addDoc(collection(db,"users"),review)

 
}
export async function dataUpdate(userData:any) { 
   

  const docRef = doc(db, "users" );

// Set the "capital" field of the city 'DC'
  await updateDoc(docRef, userData);

}

export async function updateRestaurantImageReference(
  restaurantId: string,
  publicImageUrl: string
) {
  const restaurantRef = doc(collection(db, "restaurants"), restaurantId);
  if (restaurantRef) {
    await updateDoc(restaurantRef, { photo: publicImageUrl });
  }
}

export async function userSubmission( userData: any) {



            //await setDoc(doc(collection(db,"users"),userData))
            const docRef = await addDoc(collection(db, "users"), userData);
            console.log("Document written with ID: ", docRef.id);
            //return docRef.id; // Return the document ID for further use})

 
}