import os
import unittest
from unittest.mock import patch

from app import create_app
from endpoints.moodboard import ProductMetadataParser


class DomiApiTest(unittest.TestCase):
    def setUp(self):
        self.client = create_app().test_client()

    def test_health_check(self):
        response = self.client.get("/test")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["message"], "Domi API is ready")

    def test_moodboard_uses_curated_fallback_without_api_key(self):
        with patch.dict(os.environ, {"UNSPLASH_ACCESS_KEY": ""}):
            response = self.client.post(
                "/moodboard",
                json={"vibe": "cozy", "room_type": "office"},
            )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json), 6)

    def test_import_rejects_private_url(self):
        response = self.client.post(
            "/furniture/import",
            json={"url": "http://127.0.0.1/product"},
        )

        self.assertEqual(response.status_code, 400)

    def test_product_metadata_parser_reads_open_graph_fields(self):
        parser = ProductMetadataParser()
        parser.feed(
            '<title>Oak Desk</title>'
            '<meta property="og:image" content="https://example.com/desk.jpg">'
        )

        self.assertEqual(parser.title, "Oak Desk")
        self.assertEqual(parser.image, "https://example.com/desk.jpg")


if __name__ == "__main__":
    unittest.main()
