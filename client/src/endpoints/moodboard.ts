const API_BASE_URL = import.meta.env.VITE_APP_SERVER;

export async function test() {
    const url = API_BASE_URL + "/test"

    const headers = new Headers()
    headers.append("Content-Type", "application/json")

    return fetch(url, {
        method: "GET",
        headers: headers
    })
}

export async function generateMoodboard(vibe: string, roomType: string) {
    const url = API_BASE_URL + "/moodboard"

    const headers = new Headers()
    headers.append("Content-Type", "application/json")

    const body = JSON.stringify({
        vibe: vibe,
        room_type: roomType
    })

    return fetch(url, {
        method: "POST",
        headers: headers,
        body: body
    })
}