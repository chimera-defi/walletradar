# Self-hosted fonts

Latin-subset variable woff2 files, loaded by `next/font/local` in `../layout.tsx` so the build never contacts Google Fonts. They are the exact files `next/font/google` previously downloaded for the same families (IBM Plex Sans 400-700, Space Grotesk 500-700, latin subset), so rendering is unchanged.

- IBM Plex Sans: Copyright IBM Corp., SIL OFL 1.1 (`OFL-IBM-Plex-Sans.txt`)
- Space Grotesk: Copyright The Space Grotesk Project Authors, SIL OFL 1.1 (`OFL-Space-Grotesk.txt`)

License texts are copied from the `@fontsource/ibm-plex-sans` and `@fontsource/space-grotesk` 5.3.0 packages (not project dependencies).
