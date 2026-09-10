'use server';

export async function getEnvironment() {
    return {
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        NEXT_PUBLIC_UTIL_URL: process.env.NEXT_PUBLIC_UTIL_URL,
        NEXT_PUBLIC_SOIL_VOCAB_URL: process.env.NEXT_PUBLIC_SOIL_VOCAB_URL,
        NEXT_PUBLIC_SHOW_MENU: process.env.NEXT_PUBLIC_SHOW_MENU,
        NEXT_PUBLIC_MAP_KEY: process.env.NEXT_PUBLIC_MAP_KEY
    };
}
