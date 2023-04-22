import db from "cms/lib/db.server"
import type { CharactersData } from "cms/types/dynamically"
import type { CharactersProjection } from "cms/types/dynamically/projection"
import type { RequestEvent } from './$types';

type ResultData = Pick<CharactersData, "email"> & { image:Pick<CharactersData['image'], 'src'|"title"|"_id" > }

export async function load(event:RequestEvent){
    const charactersCol = db.collection("characters")
    const filter = {}
    const projection:CharactersProjection = { email:true,image:{ src:true,title:true } }
    const charactersCursor = charactersCol.find(filter,{projection}).map((data:any)=>{ return{ ...data,_id:data['_id'].toString() } })
    charactersCursor.limit(5)
    const characters:ResultData[] = await charactersCursor.toArray() 
    return { characters }
}