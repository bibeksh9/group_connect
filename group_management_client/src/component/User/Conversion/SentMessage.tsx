import { AiFillLike } from 'react-icons/ai';
import { Message } from '../../../store/models/Models';


export default function SentMessage(props: any) {
    const message: Message = props.message;
    return (<div className="mbox" >
        <div className="space"></div>
        <p style={{ alignSelf: 'center' }}>{message.likes.length}<AiFillLike size={30} color={'blue'} />  </p>
        <div className="tbox" key={message.id}>

            <p><b>Me</b></p>
            <p>{message.text}</p>
        </div>
    </div>);


}