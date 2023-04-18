import { initializeApp } from "firebase/app";
import imageOne from "./images/image_one.jpeg";
import imageTwo from "./images/image_two.jpeg";
import React, { useRef, useState } from "react";
import ChoicePopUp from "./components/ChoicePopUp.js";
import "./App.css";

const firebaseConfig = {
  apiKey: "AIzaSyDmCpmpDrCxuC9lMmi5YWBq5eJHTu1ICOo",
  authDomain: "wheres-waldo-9b73f.firebaseapp.com",
  projectId: "wheres-waldo-9b73f",
  storageBucket: "wheres-waldo-9b73f.appspot.com",
  messagingSenderId: "171732216523",
  appId: "1:171732216523:web:d18339782b446cec06c94e"
};

const app = initializeApp(firebaseConfig);

function App() {
  const imgRef = useRef(null);
  const imageX = useRef(null);
  const imageY = useRef(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const [showPopUp, setShowPopUp] = useState(false);

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

  const handleChoice = (choice) => {
    console.log(choice);
    setShowPopUp(!showPopUp);
  }

  return (
    <div className="App">
      {
        showPopUp ?
        <ChoicePopUp onChoose={handleChoice} choices={["Bender", "Samus", "Avatar"]} xPos={mouseX.current} yPos={mouseY.current}/>
        :
        null
      }
      <img ref={imgRef} id="my-image" onClick={handleClick} className="background" src={imageTwo} alt="background" />
    </div>
  );
}

export default App;
