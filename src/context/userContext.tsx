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
    primaryCommonName: string,
    scientificName: string,
    regions: string[],
    spotted: boolean
}

// // use scientific name as key
// export type BirdDictionary = {
//     [key: string]: Bird;
// }

const UserContext = createContext<
    {
        user: User | null;
        userBirds: Bird[]; // BirdDictionary;
    }
    | undefined
>(undefined);


export function UserContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userBirds, setUserBirds] = useState<Bird[]>([]);

    // function saveUserSettings(newDetails: UserSettings) {
    //     console.log(user);
    //     console.log(userSettings);

    //     // the user should never be null at this point because of conditional rendering
    //     // but we add a null check to make typescript happy
    //     if (user != null) {
    //         console.log('setting user settings');
    //         // the id for UserSettings object is uid of User object
    //         setUserSettings({
    //             id: user.uid,
    //             occupation: newDetails.occupation,
    //             organization: newDetails.organization,
    //             linkedin: newDetails.linkedin,
    //             github: newDetails.github
    //         });
    //     } else {
    //         console.log('no user to log settings for')
    //     }
    // }

    // // this will trigger when userSettings are updated, attempts to write the updated user settings to the database
    // useEffect(() => {
    //     console.log('userContext.useEffect upon userSettings change')
    //     if (userSettings != null) {
    //         console.log(`userContext.useEffect ACTUALLY writing user settings`);
    //         writeUserSettings(userSettings);
    //     }
    // }, [userSettings]);

    async function getBirdsForUser() {
        setUserBirds(await getBirdsFromJsonFile());
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => setUser(user));
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (user) {
            console.log(`USER CHANGED: ${JSON.stringify(user)}`)
            if (!userBirds) {
                getBirdsForUser();
            }
            // findUser(user);
            // if (!userBirds) {
            //     getBirdsForUser();
            // }
            // console.log(`user settings after find user: ${JSON.stringify(userSettings)}`);
        }
    }, [user])

    // async function findUser(user: User | null) {
    //     console.log(`userContext.findUser`);
    //     if (user != null) {
    //         setUserBirds(await findUserBirds(user.uid));
    //     } else {
    //         setUserBirds([]);
    //     }
    // }

    return (
        <UserContext.Provider value={{ user, userBirds }}> {/*, userSettings, saveUserSettings*/}
            {children}
        </UserContext.Provider>
    );
}

async function findUserBirds(uid: string) {
    console.log(`userContext.findUserBirds`)
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            userBirds: data.userBirds
        };
    } else {
        return null;
    }
}

// function writeUserSettings(userSettings: UserSettings) {
//     console.log(`userContext.writeUserSettings`);
//     setDoc(doc(db, 'users', userSettings.id), {
//         occupation: userSettings?.occupation,
//         organization: userSettings?.organization,
//         linkedin: userSettings.linkedin,
//         github: userSettings.github
//     });
// }

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