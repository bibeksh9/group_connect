export interface User {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Group {
    id: string;
    name: string;
    messages: Message[],
    users: User[],
}
export interface Like {
    id: string;
    userId: string;
    messageId: string
    user: User
}
export interface Message {
    id: string,
    sender_id: string,
    text: string,
    user: User,
    likes: Like[]
}

