import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

type LoginForm = z.infer<typeof loginSchema>;

export async function POST(req: NextRequest) {
  try {

    const body: LoginForm = await req.json();
    const parsedBody = loginSchema.parse(body);

    const { username, password } = parsedBody;

    // check if user exists in db and password is correct

    const token = jwt.sign({ username }, process.env.secret_key!, { expiresIn: '1h' });

    return NextResponse.json(
      {
        user: { username },
        token,
        message: 'Logged in successfully'
      });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Validation Error',
          errors: error.errors,
        },
        {
          status: 400
        });
    }

    console.error('Unexpected Error:', error);
    return NextResponse.json(
      {
        message: 'Something went wrong'
      },
      {
        status: 500
      });
  }
}
