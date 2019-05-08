
 
export interface NewChatMemberOptions {
    newMemberUid: string;
    messages: { message: string, timestamp:string }
}

export interface CurrentUserCloud{
    fullName: string;
    userId: string;
    email: string;
    chats: object;
    photoUrl?: string,
    
}



export interface CurrentChatMemberDialogData{
    fullName: string;
    userId: string;
    photoUrl?: string,
    
}

export interface RealTimeDbUserData{
    fullName: string;
    photoUrl?: string,
}

//----------Message---------
export interface MessageData {
    message: string,
    timestamp:string,
    sender: string,
}

export interface MessageDataRTimeDb {
    message: MessageData
}