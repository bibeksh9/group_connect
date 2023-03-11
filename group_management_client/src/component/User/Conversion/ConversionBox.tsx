
import UserStore from '../../../store/UserStore';
import AppStore from '../../../store/AppStore';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './style.css';
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import SentMessage from './SentMessage';
import ReceivedMessage from './ReceivedMessage';
import { AiOutlineUserAdd, AiFillDelete, AiOutlineSend, AiFillApi } from 'react-icons/ai';
import OverlayModal from './OverlayModal';
export function ConversionBox() {
    const params = useParams();
    const location = useLocation()
    const textRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const userStore = UserStore();
    const appStore = AppStore();
    const [showAddModel, setShowAddModel] = useState(false);
    const [showMessageModel, setMessageModel] = useState(false);
    const [message, setMessage] = useState('');
    useEffect(() => {
        if (params.id !== undefined) {

            userStore.updateSelectedGroup(params.id);
        }
    }, [location])
    const sentMessage = () => {
        userStore.sentMessage(textRef.current?.value!, appStore?.userData?.id!);
        if (textRef.current)
            textRef.current.value = "";
    }
    const addMember = async (email: string) => {
        const res = await userStore.addMember(email);
        if (res) {
            setShowAddModel(false);
            setMessage(`${email} added to this group successfully`);
            setMessageModel(true);
            if (emailRef.current)
                emailRef.current.value = "";

        }
        else {
            setMessage(`${email} is already a member of this group`);
            setMessageModel(true);
        }
    }

    const removeMember = async (user: string) => {
        const res = await userStore.removeMemberFromGroup(user);
    }
    const deleteGroup = async () => {
        if (confirm(`Are You sure to delete ${userStore.selectedGroup?.name} group?`) == true) {
            const res = await userStore.deleteGroup();
            if (res) {
                navigate('/home')
            }
        }

    }
    const searchUser = async () => {
        const email = emailRef.current?.value!;
        await userStore.searchMember(email);
    }



    const show = () => {
        setShowAddModel(true);
    }


    return (<div id="messagecontainer">
        <div id="header">
            <div id='title'> {userStore.selectedGroup?.name}</div>
            <OverlayModal show={showMessageModel} handleClose={() => {
                setMessageModel(false);
            }}>
                <h2>{message}</h2>
            </OverlayModal>
            <OverlayModal show={showAddModel} handleClose={() => {

                setShowAddModel(false);
                userStore.searchedMembers = [];

            }}>
                <div id="modalBody">
                    <div id="messageInput">
                        <input ref={emailRef} type="text" placeholder="Enter Member's Email" required />
                        <button type="button" onClick={searchUser}>Search</button>
                    </div>
                    <div id="members">
                        {

                            userStore.searchedMembers ? userStore.searchedMembers!.map(user => {
                                return <div id="member"><p>{user.name}</p><AiOutlineUserAdd onClick={() => {
                                    addMember(user.email);
                                }} size={20} /></div>
                            }) : <></>}
                        {
                            userStore.selectedGroup !== undefined ? userStore.selectedGroup!.users!.filter(user => user.id !== appStore.userData?.id).map(user => {
                                return <div id="member"><p>{user.name}</p><AiFillDelete onClick={() => {
                                    removeMember(user.id);
                                }} size={20} /></div>
                            }) : <></>


                        }
                    </div>
                </div>
            </OverlayModal>
            <div id='buttons'>
                <AiOutlineUserAdd onClick={show} size={50} />
                <AiFillDelete onClick={deleteGroup} size={50} />
            </div>
        </div>
        <div id="messages">
            {userStore.selectedGroup !== undefined ?
                userStore.selectedGroup.messages.map((m) => {
                    return m.user.id === appStore.userData?.id ? <SentMessage message={m} /> : <ReceivedMessage message={m} />;
                })
                : <><h2>No Messages</h2></>}
        </div>
        <div id="messageInput"><input ref={textRef} type="text" placeholder="Enter Message" required />
            <AiOutlineSend onClick={sentMessage} size={55} />
        </div>
    </div>
    );
}