import React, { Component } from 'react'
import { UserContext } from '../../Context/Auth/UserContextProvider';
import { getMessageListenerVideoChat, getMessageVideoChat, sendMessageVideoChat } from '../../Firebase/publicChatManager';
import { ReceivedMsg, SentMsg } from "../Messages";
import arrowSvg from "../../Assets/svg/arrow.svg"


class PublicChat extends Component {
    state = {
        messages: [],
        listenerCounter: 0,
        scrollProgress: false,
        allowScrolling: false,
        pageSize: 500,
        pageNumber: 0,
        initialScrollDone: false,
        shouldAutoScroll: true,
        firstTime: true,
        typedMessage: ''
    }

    inputRef = React.createRef(null)

    constructor(props) {
        super(props);
        this.messageDiv = React.createRef();
    }

    handleScroll = () => {
        if (this.messageDiv.current.scrollHeight - this.messageDiv.current.scrollTop > (2 * this.messageDiv.current.clientHeight)) {
            this.setState({ shouldAutoScroll: false })
            // console.log("shouldAutoScroll false")
        } else {
            this.setState({ shouldAutoScroll: true })
            // console.log("shouldAutoScroll true")
        }

        if (this.messageDiv.current && this.messageDiv.current.offsetTop > this.messageDiv.current.scrollTop) {
            if (this.state.allowScrolling && this.state.scrollProgress == false) {
                // console.log("scroll")
                this.setState({ scrollProgress: true })
                this.loadMessages();
            }
        }
    }

    componentWillUnmount() {
        this.messageDiv.current.removeEventListener("scroll", this.handleScroll);
    }


    componentDidMount() {
        this.inputRef.current.focus()

        this.loadMessages();
        getMessageListenerVideoChat(this.props.room.roomId, (err, message) => {//first argument is for checking error and second one contain message
            if (message != null) {
                let messages = this.state.messages;
                messages.push(message);
                this.setState({ messages: messages });
                this.setState({ listenerCounter: this.state.listenerCounter + 1 })
                this.scroll();

                if (this.props.showNotification) {
                    if (message.userId != this.props.user.email) {
                        this.props.showNotification(true);
                    } else {
                        this.props.showNotification(false);
                    }
                }

            }

            this.scroll();
        })
    }

    loadMessages = () => {
        getMessageVideoChat(this.props.room.roomId, this.state.pageNumber, this.state.pageSize, this.state.listenerCounter).then(messages => {
            const previousMessages = this.state.messages;

            // if (previousMessages.length >= 0 && messages.length >= 0 && previousMessages[previousMessages.length - 1].id == messages[0].id) {
            //     messages.shift();
            // }
            if (previousMessages.length >= 0 && messages.length >= 0 && messages[messages.length - 1].id == previousMessages[0].id) {
                messages.pop();
            }

            const newMessages = [...messages, ...previousMessages]

            // console.log(newMessages)


            this.setState({ messages: newMessages });
            // console.log(this.state.pageNumber)

            if (messages.length >= this.state.pageSize) {
                // console.log("messages.length " + messages.length)
                this.setState({ pageNumber: this.state.pageNumber + 1 })
                this.setState({ allowScrolling: true })
            }
            else {
                this.setState({ allowScrolling: false })
                this.setState({ pageNumber: this.state.pageNumber - 1 })
            }

            this.setState({ scrollProgress: false });
            this.scroll();
        }).catch((err) => {
            this.setState({ scrollProgress: false });
            // console.log(err);
        })
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.activeSideMenu) {
            this.scroll();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.state.initialScrollDone) {
            this.scroll();
            this.setState({ initialScrollDone: true });
        }
    }


    uuid4 = () => {
        let array = new Uint8Array(16)
        crypto.getRandomValues(array)

        // manipulate 9th byte
        array[8] &= 0b00111111 // clear first two bits
        array[8] |= 0b10000000 // set first two bits to 10

        // manipulate 7th byte
        array[6] &= 0b00001111 // clear first four bits
        array[6] |= 0b01000000 // set first four bits to 0100

        const pattern = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
        let idx = 0

        return pattern.replace(
            /XX/g,
            () => array[idx++].toString(16).padStart(2, "0"), // padStart ensures leading zero, if needed
        )
    }


    scroll = () => {
        // console.log("scroll")
        setTimeout(() => {
            if ((this.messageDiv && this.messageDiv.current) && this.state.shouldAutoScroll) {
                const scrollHeight = this.messageDiv.current.scrollHeight;
                const height = this.messageDiv.current.clientHeight;
                const maxScrollTop = scrollHeight - height;
                this.messageDiv.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
                // if(this.props.showNotification)
                // {
                //     this.props.showNotification(false);
                // }
            }
        }, 500);
    }

    onSendMessageClick = (event) => {
        if (event) {
            event.preventDefault();
        }

        let messageData = {
            id: this.uuid4(),
            'room': this.props.room.roomId,
            'userId': this.context.user.uid,
            'userName': this.context.user.displayName,
            'message': this.state.typedMessage
        };

        sendMessageVideoChat(messageData).then(value => {
            this.scroll();
            this.setState({
                typedMessage: ''
            })
        }).catch(err => console.log(err))

    }

    render() {
        return (
            <div className="sidebar__body">
                <div className="chat-section">

                    {
                        this.props.showHeader ? this.props.children : null
                        // <div className="chat-header" onClick={this.props.onbackClick}>
                        //     <img src={arrowSvg} alt="arrowSvg" />
                        //     <div className="user-profile">
                        //         <span className="user-profile__title">
                        //             {this.props.roomName}
                        //         </span>
                        //     </div>
                        // </div>
                    }


                    <div ref={this.messageDiv} className="chat-section__body">
                        {
                            this.state.messages.map((value, index) => {
                                if (value.userId === this.context.user.uid) {
                                    return < SentMsg time={value.createdAt} userId={value.userId} key={value.userId + "--" + index} name={value.userName} message={value.message} />
                                } else {
                                    return <ReceivedMsg time={value.createdAt} userId={value.userId} key={value.userId + "--" + index} name={value.userName} message={value.message} />
                                }
                            })
                        }
                    </div>
                    <div className="chat-section__footer">
                        <div className="chat-section__form">
                            <form onSubmit={this.onSendMessageClick}>
                                <input
                                    type="text" className="chat-section__input" placeholder="Write here"
                                    value={this.state.typedMessage}
                                    onChange={e => this.setState({
                                        typedMessage: e.target.value
                                    })}
                                    ref={this.inputRef}
                                ></input>
                                <button type="submit" className="chat-section__btn "
                                    disabled={this.state.typedMessage.length === 0}
                                ><i className="icon-send"></i></button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

PublicChat.contextType = UserContext
export default PublicChat