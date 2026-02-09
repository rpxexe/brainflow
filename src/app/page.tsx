import prisma from "@/lib/db"

const page =async () => {
  const users=await prisma.user.findMany();
  return (
    <div>{JSON.stringify(users)}</div>
  )
}

export default page