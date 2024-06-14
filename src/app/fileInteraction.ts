import { promises as fs } from "fs";

export default async function getBirdsFromJsonFile() {
    const rawBirdData = await fs.readFile(process.cwd() + "/src/app/data/bird_data.json", "utf8");

    const longJsonBirdData = JSON.parse(rawBirdData);
    const jsonBirdData = longJsonBirdData.map((item: { scientificName: any; primaryCommonName: any; nations: any; }) => {
        return {
            scientificName: item.scientificName,
            primaryCommonName: item.primaryCommonName,
            nations: item.nations
        };
      });
    console.log(jsonBirdData[0])
    return(jsonBirdData);
}