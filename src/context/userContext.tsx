'use client';
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState
} from 'react';

import { auth } from "../app/firebase";
import {
    signOut,
    signInWithPopup,
    GoogleAuthProvider,
    User
} from "firebase/auth";

import { db } from "../app/firebase";
import { getDoc, setDoc, doc } from "firebase/firestore";
import getBirdsFromJsonFile from '@/app/fileInteraction';


export type Bird = {
    userId: string,
    primaryCommonName: string,
    scientificName: string,
    regions: string[],
    // spotted: boolean
}

// // use scientific name as key
// export type BirdDictionary = {
//     [key: string]: Bird;
// }

const UserContext = createContext<
    {
        user: User | null;
        userBirds: Bird[] | null; // BirdDictionary;
    }
    | undefined
>(undefined);


export function UserContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userBirds, setUserBirds] = useState<Bird[] | null>(null);

    // // this will trigger when userBirds are updated, attempts to write the updated user birds to the database
    useEffect(() => {
        if (userBirds) {
            console.log('userContext.useEffect upon userBirds change')
            console.log(`userBirds.length: ${userBirds.length}`)
            console.log(`userBirds[0]: ${JSON.stringify(userBirds[0])}`)
                
            // writeUserBirds(userBirds);
            
        }
        
    }, [userBirds]);

    async function getBirdsForUser() {
        console.log(`user.uid: ${user!.uid}`);
        const result = await getUserBirdsFromDB(user!.uid);
        console.log(`result after getUserBirdsFromDB: ${JSON.stringify(result)}`)
        if (result) {
            setUserBirds(result.userBirds)
            console.log(`just tried to setUserBirds, userBirds[0]: ${JSON.stringify(userBirds![0])}`)
        } else { // result is null, meaning userBirds are not already in db
            setUserBirds(await getBirdsFromJsonFile(user!.uid));
            if (userBirds) {
                writeUserBirds(userBirds);
            } else {
                console.log(`getBirdsFromJsonFile failed to save userBirds to state variable`)
            }
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => setUser(user));
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (user) {
            console.log(`USER: ${JSON.stringify(user)}`)
            if (!userBirds) {
                console.log(`doesn't think there are userBirds`)
                getBirdsForUser().then(() => console.log(`user birds after it all: ${JSON.stringify(userBirds![0])}`))
            } else {
                console.log(`user birds are here already! ${JSON.stringify(userBirds[0])}`);
            }
        }
    }, [user])

    return (
        <UserContext.Provider value={{ user, userBirds }}> {/*, userSettings, saveUserSettings*/}
            {children}
        </UserContext.Provider>
    );
}

async function getUserBirdsFromDB(uid: string) {
    console.log(`userContext.findUserBirds`)
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log(`docSnap does exist`)
        const data = docSnap.data();
        console.log(`just grabbed this data from the db: ${JSON.stringify(data.userBirds[0])}`)
        return {
            userBirds: data.userBirds
        };
    } else {
        return null;
    }
}

async function writeUserBirds(userBirds: Bird[]) {
    console.log(`userContext.writeUserBirds`);
    await setDoc(doc(db, 'users', userBirds[0].userId), {userBirds})
    // const parentDocRef = doc(db, 'users', userBirds[0].userId);
    // userBirds.forEach((bird) => {
    //     setDoc(doc(parentDocRef, 'userBirds', bird.scientificName), {bird});
    // });
}

export const googleSignIn = () => {
    console.log(`userContext.googleSignIn`);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
}

export const logOut = () => {
    console.log(`userContext.logOut`);
    signOut(auth);
}

export function useUserContext() {
    const context = useContext(UserContext);
    return context?.user;
}

// export function useUserSettingsContext() {
//     const context = useContext(UserContext);
//     return context?.userSettings;
// }

// export function useSaveUserSettingsContext() {
//     const context = useContext(UserContext);
//     return context!.saveUserSettings;
// }