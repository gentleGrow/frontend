"use client";

import Image from "next/image";

export default function Home() {
   
    const REST_API_KEY = process.env.REST_API_KEY;
    const REDIRECT_URI = process.env.REDIRECT_URI;
    // const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    const KAKAO_AUTH_URL = 'http://127.0.0.1:8000/api/auth/kakao';

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                    window.location.href = KAKAO_AUTH_URL;
                }}
            >
                Button
            </button>
        </main>
    );
}
