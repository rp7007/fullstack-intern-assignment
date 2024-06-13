import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader) {
    return NextResponse.json(
      {
        error: 'No authorization header'
      },
      {
        status: 401
      }
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    const user = jwt.verify(token, process.env.secret_key!);

    return NextResponse.json({ user: user });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Invalid token'
      },
      {
        status: 401
      }
    );
  }
}
