import {PATHS} from "../utils/constants";
export { default } from "next-auth/middleware";

console.log(Object.values(PATHS))
export const config = { matcher: Object.values(PATHS) }