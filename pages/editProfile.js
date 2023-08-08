import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from "../../pages/firebase_folder/firebase-config";
import { useEffect, useRef, useState } from "react"
import { useSession } from 'next-auth/react';

export default function EditProfile() {
    const { data: session, status } = useSession();
    const nameRef = useRef(null);
    const imageRef = useRef(null);
    const [changed, changeState] = useState(false);
    const [name, changeName] = useState("");
    const [image, changeImage] = useState(null);

    async function handleUpdate() {
        const formData = new FormData();
        let nameField = nameRef.current.value;
        let imageData = imageRef.current.files[0];
        if (imageData === null && nameField === null) {
            return;
        } else {
            if (name == nameField) {
                nameField = name;
            }
            if (imageData === null) {
                imageData = image;
            }
            await fetch('/api/changePfp', {
                method: 'POST',
                body: formData
            })
            nameRef.current.value = '';
            imageRef.current.value = null;
        
            // Reset the state variables
            changeState(!changed);
        }

    }

    useEffect(() => {
        async function fetchData() {
            const userEmail = session["user"]["email"];
            const messageRef = collection(db, "users");
            const makeQuery = query(messageRef, where("user", "==", userEmail));
            const snapshot = await getDocs(makeQuery);
            let dataVal = null;
            snapshot.forEach((doc) => {
              dataVal = doc.data();
            });
            changeName(dataVal.name);
            changeImage(dataVal.image);
        }
        fetchData();
    }, [changed])

    return (
        <div>
            <div>
                <div>
                    Change name
                </div>
                <input ref={nameRef}/>
            </div>
            <div>
                <div>
                    Update profile picture
                </div>
                <input ref={imageRef} type="file"/>
            </div>
            <button onClick={() => handleUpdate()}>Update changes</button>
        </div>
    )
}