import { promises as fs } from "fs";

export default async function getBirdsFromJsonFile(userId: string) {
    // const rawBirdData = await fs.readFile(process.cwd() + "/src/app/data/bird_data.json", "utf8");
    // let longJsonBirdData = '';
    try {
        const rawBirdData = await fetch('/bird_data.json');
        const longJsonBirdData = await rawBirdData.json();
        // const longJsonBirdData = JSON.parse(rawBirdData);
        const jsonBirdData = longJsonBirdData.map((item: { scientificName: any; primaryCommonName: any; nations: any; }) => {
            return {
                userId: userId,
                scientificName: item.scientificName,
                primaryCommonName: item.primaryCommonName,
                nations: item.nations
            };
        });
        return(jsonBirdData);
    } catch (error) {
        console.error('error fetching data:', error);
    }
}