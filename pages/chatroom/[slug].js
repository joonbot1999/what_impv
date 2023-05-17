import { useRouter } from "next/router"
import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import { collection, getDocs, doc, getFirestore, query, where, onSnapshot, onSnapshotsInSync } from 'firebase/firestore';
import { db } from "../../pages/firebase_folder/firebase-config";
import { useEffect, useRef, useState } from "react";

export default function room( {data} ) {
    const inputRef = useRef();
    const router = useRouter();
    const [messages, loadMessages] = useState([]);
    const {data: session, status } = useSession();

    function sendMessage() {
        let newMessage = inputRef.current.value;
        if (newMessage == "") {
            //return;
        } else {
            let userEmail = session["user"]["email"];
            const sending = async () => {
                await fetch('/api/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({slug: router.query.slug, newMessage, userEmail})
            })
            }
            sending();
            inputRef.current.value = "";
        }
    }

    useEffect(() => {
        async function fetchMessages() {
            const messageRef = collection(db, "rooms");
            const makeQuery = query(messageRef, where("roomID", "==", router.query.slug));
            const unsubscribe = onSnapshot(makeQuery, (snapshot) => {
                let dataVal = null;
                snapshot.forEach((doc) => {
                  dataVal = doc.data();
                });
                loadMessages(dataVal.messages);
              });
            
              return () => unsubscribe();
        }
        fetchMessages();
    }, [router.query.slug])

    return (
        <>
        <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <div>room {" " + router.query.slug}
        </div>
        {messages.map((message) => {
            return(
                <>
                    <div>{message.content}</div>
                    <div>{message.user}</div>
                </>
            )
        })}
        <div>
            <input 
                ref={inputRef}
                placeholder="Type your message here">
            </input>
            <button 
                onClick={()=>{
                sendMessage()
            }}>send</button>
        </div>
        </div>
        </>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context);
    console.log(session)

    if (session == null) {
        return {
            redirect: {
                destination: "/",
                permanent: true
            }
        }
    } else {
        return {  
            props: session 
        }
    }   
}