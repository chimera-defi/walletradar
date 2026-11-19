#!/usr/bin/env python3
"""Regression tests for image_link checks in validate_merchant_feed.py."""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from validate_merchant_feed import image_error  # noqa: E402

SITE = "https://walletradar.org"


class ImageLinkTest(unittest.TestCase):
    def test_existing_public_file_passes(self):
        self.assertIsNone(image_error(f"{SITE}/og-hardware-wallets-table.png"))

    def test_missing_file_fails(self):
        self.assertIsNotNone(image_error(f"{SITE}/og/wallets/hardware.png"))

    def test_paths_outside_public_fail(self):
        for path in ("/../../package.json", "//etc/passwd", "/%2e%2e/%2e%2e/package.json", "/"):
            with self.subTest(path=path):
                self.assertIsNotNone(image_error(SITE + path))

    def test_other_hosts_fail(self):
        self.assertIsNotNone(image_error("http://walletradar.org/og-image.png"))
        self.assertIsNotNone(image_error("https://evil.example/og-image.png"))


if __name__ == "__main__":
    unittest.main()
