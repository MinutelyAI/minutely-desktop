# Minutely Desktop

The Electron-based desktop application for Minutely. It provides a native experience for Windows, built using React, Vite, Electron Forge, and Tailwind CSS. It consumes `@minutely/shared` for its UI primitives and API connectivity.

## Setup

Ensure you have installed the dependencies:

```bash
cd minutely-desktop
pnpm install
```

*(Note: Since it depends on `@minutely/shared` via the `file:` protocol, ensure `minutely-shared` is present in the parent directory).*

## How to Run

To start the Electron application in development mode:

```bash
pnpm run start
```

This will launch the desktop application window with live reloading enabled via Vite.

## Type Checking

To verify TypeScript correctness across the desktop app and its shared dependencies:

```bash
pnpm exec tsc --noEmit
```

## How to Package / Build

To package the application for distribution:

```bash
pnpm run package
# or
pnpm run make
```

This will use Electron Forge to generate the distributable files in the `out/` directory.
