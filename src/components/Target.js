const Target = (props) => {
    return (
        <div className="targetContainer">
            <div className={"targetImageContainer " + (props.found ? "found" : "")}>
                <img className="targetImage" src={props.image} alt="target image" />
            </div>
            <div className="targetName">{props.name}</div>
        </div>
    );
};

export default Target;