import ipaddress
import os
import socket
from html.parser import HTMLParser
from urllib.parse import urlparse

import requests


CURATED_IMAGES = [
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=900&q=85",
]


class ProductMetadataParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.image = ""
        self._inside_title = False

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag == "title":
            self._inside_title = True
        if tag == "meta":
            property_name = attributes.get("property") or attributes.get("name")
            content = attributes.get("content", "").strip()
            if property_name in {"og:title", "twitter:title"} and content:
                self.title = content
            if property_name in {"og:image", "twitter:image"} and content:
                self.image = content

    def handle_endtag(self, tag):
        if tag == "title":
            self._inside_title = False

    def handle_data(self, data):
        if self._inside_title and not self.title:
            self.title = data.strip()


def generate_moodboard(body):
    vibe = str(body.get("vibe", "cozy")).strip()[:40]
    room_type = str(body.get("room_type", "living room")).strip()[:40]
    access_key = os.environ.get("UNSPLASH_ACCESS_KEY")
    api_url = os.environ.get("UNSPLASH_API_URL", "https://api.unsplash.com").rstrip("/")

    if not access_key:
        return CURATED_IMAGES

    try:
        response = requests.get(
            f"{api_url}/photos/random",
            headers={"Authorization": f"Client-ID {access_key}"},
            params={
                "query": f"{vibe} {room_type} interior design",
                "count": 6,
                "orientation": "squarish",
            },
            timeout=8,
        )
        response.raise_for_status()
        images = [
            image["urls"]["regular"]
            for image in response.json()
            if image.get("urls", {}).get("regular")
        ]
        return images or CURATED_IMAGES
    except (requests.RequestException, ValueError, TypeError):
        return CURATED_IMAGES


def _is_public_url(url):
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        return False

    try:
        addresses = socket.getaddrinfo(parsed.hostname, None)
    except socket.gaierror:
        return False

    for address in addresses:
        ip = ipaddress.ip_address(address[4][0])
        if not ip.is_global:
            return False
    return True


def import_furniture(body):
    url = str(body.get("url", "")).strip()
    if not _is_public_url(url):
        return {"error": "Please provide a public http or https URL."}, 400

    try:
        response = requests.get(
            url,
            headers={"User-Agent": "Domi furniture importer/1.0"},
            timeout=8,
            allow_redirects=True,
        )
        response.raise_for_status()
        if not _is_public_url(response.url):
            return {"error": "The URL redirected to a private address."}, 400
        if "text/html" not in response.headers.get("Content-Type", ""):
            return {"error": "The URL does not point to a product page."}, 400
    except requests.RequestException:
        return {"error": "The product page could not be reached."}, 422

    parser = ProductMetadataParser()
    parser.feed(response.text[:1_000_000])
    hostname = urlparse(response.url).hostname or "Imported furniture"
    name = parser.title.strip() or hostname.replace("www.", "").split(".")[0].title()

    return {
        "name": name[:120],
        "image": parser.image,
        "source": response.url,
    }, 200
