import { usersCollectionRef } from "../firebase";
import { query, orderBy, limit, getDocs, doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";

const Leaderboard = (props) => {
    const [scores, setScores] = useState([]);
    const [snapshot, loading, error] = useDocument(doc(db, "users", auth.currentUser.uid));

    useEffect(() => {
        const q = query(usersCollectionRef, orderBy("score", "asc"), limit(5));
        const querySnapshot = getDocs(q);
        let array = [];
        querySnapshot.then(result =>
            result.forEach((doc) => {
                array.push(doc.data());
            })
        );
        setScores(array);
    }, [snapshot]);

    return (
        <div className="leaderboard">
            <div>Best scores:</div>
            <ul>
                {
                    scores.length > 0 ?
                    scores.map((elem, i) => {
                        return (
                            <li className="leaderScore" key={i}><span>{i+1}- {elem.name}</span><span>{elem.score} s</span></li>
                        )
                    })
                    :
                    <li className="leaderScore">Loading...</li>
                }
            </ul>
        </div>
    );
};

export default Leaderboard;