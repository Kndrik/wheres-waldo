import avatarImage from '../images/icons/avatar.png';
import benderImage from '../images/icons/bender.png';
import samusImage from '../images/icons/samus.png';
import Target from './Target';

const TargetsPanel = (props) => {
    return (
        <div className="targetsPanel">
            <Target name="Bender" image={benderImage} found={props.targetsData.Bender}/>
            <Target name="Avatar" image={avatarImage} found={props.targetsData.Avatar}/>
            <Target name="Samus" image={samusImage} found={props.targetsData.Samus}/>
        </div>
    );
};

export default TargetsPanel;