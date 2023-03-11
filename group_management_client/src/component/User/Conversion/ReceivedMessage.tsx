import { Message } from '../../../store/models/Models';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import UserStore from '../../../store/UserStore';
import AppStore from '../../../store/AppStore';

export default function ReceivedMessage(props: any) {
    const userStore = UserStore();
    const appStore = AppStore();
    const message: Message = props.message;
    const liked = message.likes.find(l => l.userId == appStore.userData?.id!);

    const updateLike = () => {
        if (liked) {
            userStore.disLikeMessage(liked);
        }
        else {
            userStore.likeMessage(message.id, appStore.userData?.id!);
        }
    }



    return (<div className="mbox" >
        <div className="tbox" style={{ backgroundColor: 'lightgreen' }} key={message.id}>
            <p><b>{message.user.name}</b></p>
            <p>{message.text}</p>
        </div>
        {liked ?
            <p style={{ alignSelf: 'center' }}><AiFillLike onClick={updateLike} size={30} color={'blue'} /> {message.likes.length} </p> :

            <AiOutlineLike style={{ alignSelf: 'center' }} onClick={updateLike} size={30} color={'blue'} />
        }
        <div className="space">
        </div>
    </div>);


}