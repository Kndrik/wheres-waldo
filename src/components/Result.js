import Leaderboard from "./Leaderboard";
import { auth, db } from "../firebase";
import { query, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const Result = (props) => {
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [bestScore, setBestScore] = useState(0);

    useEffect(() => {
        const userDocRef = doc(db, "users", auth.currentUser.uid);

        const getUserData = async () => {
            const result = (await getDoc(userDocRef)).data();
            setShowForm(!result.name);
            setBestScore(result.score);
        }

        getUserData();
    }, []);

    const submitForm = (event) => {
        event.preventDefault();
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        updateDoc(userDocRef, { name: name });
        setShowForm(false);
    }
    
    const form = showForm ?
        (<form onSubmit={submitForm}>
            <label for="name">Your name:</label>
            <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
        </form>) :
        null;

    return (
        <div className="resultContainer">
            <div className="resultParent">
                <div className="resultPanel">
                    <h1>Time: {props.score} seconds</h1>
                    <div>Your best: {bestScore} seconds</div>
                    {form}
                    <Leaderboard />
                </div>
            </div>
        </div>
    );
};

export default Result;