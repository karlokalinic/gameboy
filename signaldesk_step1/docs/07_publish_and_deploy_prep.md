# Publish & Deploy Prep (early, because future-you will forget)

## Local dev prerequisites (Windows)
- .NET 8 SDK
- Visual Studio 2022 ili VS Code + C# extension
- raylib-cs native dependencies (prema package setupu)

## Early publish target (after Phase 2/3)
Command (example):

```bash
 dotnet publish src/SignalDesk.App/SignalDesk.App.csproj -c Release -r win-x64 --self-contained true
```

## Folder deployment shape (planned)
- `SignalDesk.exe`
- `assets/`
- `data/`
- `saves/` (auto-created on first run)
- `logs/` (auto-created on first run)

## Packaging later
- zip portable build (first)
- installer (Inno Setup / NSIS) later

## Must-have before external test build
- graceful missing-file errors
- default scenario fallback
- crash log file
- settings reset option
- save slot corruption handling (skip broken save, don't crash app on menu)
