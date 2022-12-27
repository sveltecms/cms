import db from "$Database"
import Fetch from "./fetch.server"

export default new class {
    /** Fetch data from database */
    Fetch = new Fetch(db)
}