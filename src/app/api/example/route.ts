import { NextRequest, NextResponse } from "next/server"
import { getJWTInfo } from "src/lib/nextauth"

const handler = async (request: NextRequest) => {
    const jwtInfo = await getJWTInfo()
    if (jwtInfo) {
        return NextResponse.json(jwtInfo, {
            status: 200,
        })
    } else {
        return new Response("Unauthorised access", {
            status: 401,
        })
    }
}

export { handler as GET}
