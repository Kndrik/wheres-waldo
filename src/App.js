import { doc, setDoc, query,
         where, getDocs,
         updateDoc, getDoc } from "firebase/firestore";

import imageTwo from "./images/image_two.jpeg";

import React, { useEffect, useRef, useState } from "react";

import { useDocument } from "react-firebase-hooks/firestore";

import ChoicePopUp from "./components/ChoicePopUp.js";
import TargetsPanel from "./components/TargetsPanel";
import Clock from "./components/Clock";

import "./App.css";

import { db, signInAnonymously, auth,
        usersCollectionRef, charactersCollectionRef } from "./firebase";

function App() {
  const imgRef = useRef(null);
  const imageX = useRef(null);
  const imageY = useRef(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  const [showPopUp, setShowPopUp] = useState(false);
  const [snapshot, loading, error] = useDocument(
    auth.currentUser ? doc(db, "users", auth.currentUser.uid) : null
  );
  
  const[allFound, setAllFound] = useState(false);

  const [time, setTime] = useState(0);

  useEffect(() => {
      const timer = setInterval(() => setTime(time + 1), 1000);
      return () => clearInterval(timer);
  }, [time]);

  useEffect(() => {
    signInAnonymously(auth)
      .then(() => {
        const uid = auth.currentUser.uid;
      
        const userCharactersRef = doc(db, "users", uid);
        getDoc(userCharactersRef).then((doc) => {
          if (doc.exists) {
            updateDoc(userCharactersRef, {
              Bender: false,
              Avatar: false,
              Samus: false
            });
          } else {
            setDoc(userCharactersRef, {
              Bender: false,
              Avatar: false,
              Samus: false
            });
          }
        })
      })
      .catch((error) => {
        console.error("There was an error signing in", error);
      });
  }, []);

  const handleClick = (event) => {
    const image = imgRef.current;
    const rect = image.getBoundingClientRect();
    
    // Calculate the scaling factor of the image, based on its actual dimensions
    // and its minimum dimensions.
    const widthRatio = image.naturalWidth / image.clientWidth;
    const heightRatio = image.naturalHeight / image.clientHeight;
    const scale = Math.max(widthRatio, heightRatio);
    
    // Calculate the offset of the image, taking into account its scaling factor.
    const offsetX = (image.clientWidth - image.naturalWidth / scale) / 2;
    const offsetY = (image.clientHeight - image.naturalHeight / scale) / 2;
    
    // Calculate the coordinates of the click relative to the image.
    const x = (event.clientX - rect.left - offsetX) * scale;
    const y = (event.clientY - rect.top - offsetY) * scale;
    
    // Now x and y are the coordinates of the click relative to the image.
    // You can use these values to check if the user clicked on a character.
    imageX.current = x;
    imageY.current = y;

    mouseX.current = event.pageX;
    mouseY.current = event.pageY;

    setShowPopUp(!showPopUp);
  }

  const handleChoice = async (choice) => {
    setShowPopUp(!showPopUp);
    const characterDocument = await getCharacterDocument(choice);

    // Get the distance from the click and the character's position
    const dist = getDistance(
      {x: imageX.current, y: imageY.current},
      {x: characterDocument.data().x, y: characterDocument.data().y}
    );

    if (dist < 150) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDocData = (await getDoc(userDocRef)).data();
      const data = {
        Bender: choice.toString() === "Bender" ? true : userDocData.Bender,
        Samus: choice.toString() === "Samus" ? true : userDocData.Samus,
        Avatar: choice.toString() === "Avatar" ? true : userDocData.Avatar
      };
      await updateDoc(userDocRef, data);
    }
  }

  const getCharacterDocument = async (character) => {
    const q = query(charactersCollectionRef, where("name", "==", character.toString()));
    let document;
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      document = doc;
    });
    return document;
  }

  const getDistance = (pointOne, pointTwo) => {
    let a = pointOne.x - pointTwo.x;
    let b = pointOne.y - pointTwo.y;

    return Math.sqrt(a*a + b*b);
  };

  const foundAllCharacters = () => {
    const data = snapshot.data();
    for(const key in data) {
      if (data[key] === false) {
        return false;
      }
    }
    return true;
  }

  const assignTimeToUser = async () => {
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const userData = (await getDoc(userDocRef)).data();
    if (userData.score && time > userData.score) return;
    await updateDoc(userDocRef, {
      score: time
    });
  }

  if (!loading && !error && snapshot && snapshot.data && !allFound) {
    if (foundAllCharacters()) {
      setAllFound(true);
      assignTimeToUser();
    }
  }


  const userData = loading || error || !snapshot || !snapshot.data ? 
    {Bender: false, Samus: false, Avatar: false} :
    snapshot.data();

  const choices = ["Bender", "Samus", "Avatar"].filter(
    choice => userData[choice] != true
  );

  const choiceBox = showPopUp ? 
                    <ChoicePopUp 
                      onChoose={handleChoice} 
                      choices={choices} 
                      userData={userData}
                      xPos={mouseX.current} 
                      yPos={mouseY.current}
                    /> 
                    : null;

  const clock = allFound ?
    null :
    <Clock value={time} />;

  return (
    <div className="App">
      {choiceBox}
      <img 
        ref={imgRef} 
        id="my-image" 
        onClick={handleClick} 
        className="background" 
        src={imageTwo} 
        alt="background"
      />
      <div className="panelContainer">
        <TargetsPanel targetsData={userData} />
        {clock}
      </div>
    </div>
  );
}

export default App;
