    "use client";
import { useRouter } from 'next/navigation';
    import React, { useState } from 'react';
import { signIn } from "next-auth/react";
    const LoginForm: React.FC = () => {
     
      const [email, setEmail] = useState<string>('');
      const [password, setPassword] = useState<string>('');


  const router = useRouter();

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.log(result.error);
    } else {
      router.push("/");
    }
  };

      return (
      
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-sm mx-auto mt-10">
          <h2 className="text-2xl font-bold mb-6 text-center">Login Page</h2>
       
    <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input placeholder='Enter your email'
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>


          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Login
          </button>
        </form>
      );
    };

    export default LoginForm;