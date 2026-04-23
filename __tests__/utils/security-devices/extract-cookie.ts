


export function extractCookie(cookiesArray: string[], name: string) {
    const cookie = cookiesArray.find(c => c.startsWith(name + '='));
if(!cookie){
    throw new Error (`${name} not found in cookies`)
}
    return cookie?.split('=')[1]
}