import { useRef, useEffect } from "react";

const ChoicePopUp = (props) => {
    return (
        <div 
            className="choiceContainer"
            style={{position: 'absolute',
                    left: Math.min(window.innerWidth-120, (props.xPos+10)) + 'px',
                    top: Math.min(document.body.scrollHeight - 140, (props.yPos+10)) + 'px'}}>
            <ul className="choiceList">
                {
                    props.choices.map((elem, i) =>
                        <li onClick={() => props.onChoose(elem)} className="choice" key={i}>{elem}</li>
                    )
                }
            </ul>
      </div>
    );
};

export default ChoicePopUp;