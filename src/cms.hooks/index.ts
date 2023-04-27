//VERSION:0.22.0
import { beforeAddingObject,demoFunc } from "./functions"
import type { HookFuncs } from "./types"

/** Export all functions that will run */
const hookFuncs:HookFuncs = {
    /** Run custom function before inserting / creating */
    beforeAdding : {
        route:demoFunc,
        object:beforeAddingObject,
        user:demoFunc,
    },
    beforeUpdating : {
        route:demoFunc,
        object:demoFunc,
        user:demoFunc,
        asset:demoFunc,
        setting:demoFunc
    },
    beforeDeleting : {
        route:demoFunc,
        object:demoFunc,
        user:demoFunc,
        asset:demoFunc,
    }
}
export default hookFuncs