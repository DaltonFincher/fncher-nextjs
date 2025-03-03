import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Set your credentials
const USERNAME = 'DaltonFincher';
const PASSWORD = '6006098938Dalton$';

export function middleware(req: NextRequest) {
    const authHeader = req.headers.get('authorization');

    // If no auth header provided, trigger the basic auth prompt
    if (!authHeader) {
        return new NextResponse('Unauthorized', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Secure Area"',
            },
        });
    }

    // Decode the base64-encoded credentials
    const base64Credentials = authHeader.split(' ')[1];
    const [providedUsername, providedPassword] = Buffer.from(base64Credentials, 'base64').toString().split(':');

    // Check credentials
    if (providedUsername !== USERNAME || providedPassword !== PASSWORD) {
        return new NextResponse('Unauthorized', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Secure Area"',
            },
        });
    }

    // Allow access if the credentials are correct
    return NextResponse.next();
}
