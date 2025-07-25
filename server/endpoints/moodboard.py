import os
import requests

access_key = os.environ.get("UNSPLASH_ACCESS_KEY")
unsplash_url = os.environ.get("UNSPLASH_API_URL")

def test():
    return {"message": "Hello from /test"}

def generate_moodboard(body):
    vibe = body['vibe']
    room_type = body['room_type']

    url = unsplash_url + "/photos/random"

    headers = {
        "Authorization": f"Client-ID {access_key}"
    }

    params = {
        "query": f"{vibe} {room_type} interior design",
        "count": 9,
        "orientation": "squarish"
    }

    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        data = response.json()
        return [img["urls"]["regular"] for img in data]
    else:
        print(f"Unsplash API error: {response.status_code}")
        return []
