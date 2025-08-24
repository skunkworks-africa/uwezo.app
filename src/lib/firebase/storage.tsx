import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { storage } from "@/lib/firebase";
//import { updateRestaurantImageReference } from "@/src/lib/firebase/firestore";
import { updateRestaurantImageReference } from "./firestore";

// Replace the two functions below
export async function updateRestaurantImage(restaurantId:string, image:string) {}

async function uploadImage(restaurantId:string, image:string) {}
// Replace the two functions above