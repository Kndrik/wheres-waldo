import avatarImage from '../images/icons/avatar.png';
import benderImage from '../images/icons/bender.png';
import samusImage from '../images/icons/samus.png';
import Target from './Target';

const TargetsPanel = (props) => {
    return (
        <div className="targetsPanel">
            <Target name="Bender" image={benderImage} found={false}/>
            <Target name="Avatar" image={avatarImage} found={false}/>
            <Target name="Samus" image={samusImage} found={false}/>
        </div>
    );
};

export default TargetsPanel;