import { authOptions } from '@/server/auth';
import nextAuth from 'next-auth';

export default nextAuth(authOptions);