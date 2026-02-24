using Raylib_cs;
using SignalDesk.App.Scenes;

namespace SignalDesk.App.Infrastructure;

public sealed class GameHost
{
    public const int WindowWidth = 1600;
    public const int WindowHeight = 900;

    public SceneManager SceneManager { get; } = new();

    public string RootPath { get; private set; } = string.Empty;
    public string AssetsPath { get; private set; } = string.Empty;
    public string DataPath { get; private set; } = string.Empty;
    public string SavesPath { get; private set; } = string.Empty;
    public string LogsPath { get; private set; } = string.Empty;
    public string ScenarioDataPath { get; private set; } = string.Empty;
    public string RuntimeLogPath { get; private set; } = string.Empty;

    public void Initialize()
    {
        RootPath = ResolveRootPath();
        AssetsPath = Path.Combine(RootPath, "assets");
        DataPath = Path.Combine(RootPath, "data");
        SavesPath = Path.Combine(RootPath, "saves");
        LogsPath = Path.Combine(RootPath, "logs");
        ScenarioDataPath = Path.Combine(DataPath, "scenarios");

        Directory.CreateDirectory(AssetsPath);
        Directory.CreateDirectory(DataPath);
        Directory.CreateDirectory(SavesPath);
        Directory.CreateDirectory(LogsPath);
        Directory.CreateDirectory(ScenarioDataPath);

        RuntimeLogPath = Path.Combine(LogsPath, "runtime.log");
        LogInfo($"Root resolved: {RootPath}");

        Raylib.SetConfigFlags(ConfigFlags.ResizableWindow | ConfigFlags.VSyncHint);
        Raylib.InitWindow(WindowWidth, WindowHeight, "SignalDesk - Step 2 Runtime Bootstrap");
        Raylib.SetTargetFPS(60);

        SceneManager.Replace(new BootScene(this));
        LogInfo("Scene transition: boot");
    }

    public void Run()
    {
        try
        {
            while (!Raylib.WindowShouldClose())
            {
                var dt = Raylib.GetFrameTime();
                SceneManager.Update(dt);

                Raylib.BeginDrawing();
                Raylib.ClearBackground(new Color(18, 20, 27, 255));
                SceneManager.Draw();
                DrawGlobalOverlay();
                Raylib.EndDrawing();
            }
        }
        catch (Exception ex)
        {
            LogError("Unhandled exception in main loop", ex);
            throw;
        }
        finally
        {
            SceneManager.Clear();
            Raylib.CloseWindow();
        }
    }

    public void LogInfo(string message) => WriteLog("INFO", message);

    public void LogError(string message, Exception ex) => WriteLog("ERROR", $"{message}: {ex}");

    private void WriteLog(string level, string message)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(RuntimeLogPath))
            {
                return;
            }

            var line = $"{DateTimeOffset.UtcNow:O} [{level}] {message}{Environment.NewLine}";
            File.AppendAllText(RuntimeLogPath, line);
        }
        catch
        {
            // logging must never crash runtime
        }
    }

    private static string ResolveRootPath()
    {
        var current = new DirectoryInfo(Directory.GetCurrentDirectory());
        while (current is not null)
        {
            var docs = Path.Combine(current.FullName, "docs");
            var src = Path.Combine(current.FullName, "src");
            if (Directory.Exists(docs) && Directory.Exists(src))
            {
                return current.FullName;
            }

            current = current.Parent;
        }

        return Directory.GetCurrentDirectory();
    }

    private void DrawGlobalOverlay()
    {
        var label = $"FPS: {Raylib.GetFPS()} | Scene: {SceneManager.Current?.Id ?? "None"}";
        Raylib.DrawText(label, 12, 12, 18, Color.LightGray);
    }
}
