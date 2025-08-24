"use server";
import {addClient, userSubmission} from "@/lib/firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";


    //Validate whether the data is null or undefined

async function validateData(rawData:Array<string>, data:any) {
    
        var i =0;
    for (i=0;i<rawData.length;i++){
        if (data.get(rawData[i]) === null || data.get(rawData[i]) === undefined || data.get(rawData[i]) === ""){
            rawData.push(rawData[i]);
        }
        
    }
}

async function caseManagement(allFieldsFilled:number, data:any) {
    //Handle the different cases of allFieldsFilled
    switch (allFieldsFilled) {
        case 0:
            //No fields are filled
            console.log("No fields are filled");
            return
            break;
        case 1:
            //All fields are filled
            addClient(data);
            break;
        case 2:
            //Some fields are filled
            addClient(data);
            break;
        default:
            console.log("Invalid case");
    }


}

async function caseManager(allFieldsFilled:number, rawData:any,len:number) {
    //Handle the different cases of allFieldsFilled
        //Check if all fields are filled and removes the empty fields from the rawData array
    //This is to ensure that the data is not empty before we send it to the database
    //Case 0:no fields are filled
    //Case 1:all fields are filled
    //Case 2:some fields are filled
    if (rawData.length === 0){
        allFieldsFilled = 0;
    }else if (rawData.length = 10){
        allFieldsFilled = 1;
    }
    else if(rawData.length >0 && rawData.length < len){
        allFieldsFilled = 2;
    }
}

export async function userSubmit(data:any) {
 //Add client input is different because the function paramaters are fundamentally different

    const rawData=["firstName","lastName","bio"];
    const rawLinks=["linkedin","github","portfolio","kickresume","facebook","credly","whatsapp"];
    
    validateData(rawData, data);
    validateData(rawLinks, data);

    var i =0;
    var allFieldsFilled = 0;
    var linksFilled = 0;

    caseManager(allFieldsFilled, rawData,3);
    caseManager(linksFilled, rawLinks,7);

    if(allFieldsFilled === 0 && linksFilled === 0){
            allFieldsFilled = 0;
        return;

    }
    else if(allFieldsFilled === 1 && linksFilled === 1){
        allFieldsFilled = 1;        
    }
    else {
        allFieldsFilled = 2;
    }

    //Map to create an object with the data so we can use the update method
  let processedData:any={Timestamp: Timestamp.now()};
     var i =0;
    for (i=0;i<rawData.length;i++){

          let dynamo=rawData[i];
            processedData[dynamo]=data.get(rawData[i]);   
        
    }
    for (i=0;i<rawLinks.length;i++){
        let linkholder:any={}
        let dynamo=rawLinks[i];
        linkholder[dynamo]=data.get(rawLinks[i]);
        if (i==rawLinks.length-1){
             processedData["Links"]=linkholder;
        }
    }
    
    caseManagement(allFieldsFilled, processedData);
    /*
    Create switch cases to handle the different cases of allFieldsFilled
    create specified functions to handle the different cases
    */




     // await userSubmission(processedData)
}