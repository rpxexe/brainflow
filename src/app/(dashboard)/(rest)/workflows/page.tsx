import { requireAuth } from "@/lib/auth-utils"

const Page=async ()=>{
    await requireAuth();
    return <p>WorkFLows</p>
}
export default Page