using Raylib_cs;
using SignalDesk.App.Infrastructure;
using SignalDesk.Core.Models;
using SignalDesk.Core.Runtime;
using SignalDesk.Data.Services;
using SignalDesk.UI.Windows;

namespace SignalDesk.App.Scenes;

public sealed class DesktopScene : GameSceneBase
{
    private readonly string _archetype;
    private readonly GameState _gameState = new();
    private readonly IScenarioRepository _scenarioRepository = new ScenarioRepository();
    private readonly IScenarioRuntime _scenarioRuntime = new ScenarioRuntime();
    private readonly WindowManager _windowManager = new();

    private MessagesPanel? _messagesPanel;
    private ChoicesPanel? _choicesPanel;
    private StatsPanel? _statsPanel;
    private DebugPanel? _debugPanel;
    private TaskbarPanel? _taskbarPanel;

    private string _scenarioPath = string.Empty;

    public DesktopScene(GameHost host, string archetype) : base(host)
    {
        _archetype = archetype;
    }

    public override string Id => "desktop";

    public override void Enter()
    {
        _gameState.Player.Archetype = _archetype;
        _gameState.Player.SignatureSkill = "logic";

        BuildWindows();
        LoadScenario();
        RefreshPanels("Desktop initialized");
    }

    public override void Update(float dt)
    {
        _windowManager.Update(dt);
    public override void Update(float dt)
    {
    }

    public override void Draw()
    {
        DrawDesktopBackdrop();
        _windowManager.Draw();

        if (UiElements.Button(new Rectangle(20, 20, 170, 38), "Back to Menu"))
        {
            Host.SceneManager.Replace(new MainMenuScene(Host));
        }
    }

    private void BuildWindows()
    {
        _messagesPanel = new MessagesPanel(new Rectangle(36, 70, 950, 510));
        _choicesPanel = new ChoicesPanel(new Rectangle(1000, 70, 560, 310));
        _statsPanel = new StatsPanel(new Rectangle(1000, 390, 560, 190));
        _debugPanel = new DebugPanel(new Rectangle(36, 590, 980, 260));
        _taskbarPanel = new TaskbarPanel(new Rectangle(1026, 590, 534, 260));

        _choicesPanel.OnChoiceSelected = OnChoiceSelected;
        _taskbarPanel.OnWindowToggle = id => _windowManager.ToggleMinimize(id);

        _windowManager.Add(_messagesPanel);
        _windowManager.Add(_choicesPanel);
        _windowManager.Add(_statsPanel);
        _windowManager.Add(_debugPanel);
        _windowManager.Add(_taskbarPanel);

        _taskbarPanel.DockWindows = _windowManager.Windows;
    }

    private void LoadScenario()
    {
        var scenariosPath = Path.Combine(Host.DataPath, "scenarios");
        Directory.CreateDirectory(scenariosPath);

        _scenarioPath = Path.Combine(scenariosPath, "scenario_delta_warehouse_v1.json");
        if (!File.Exists(_scenarioPath))
        {
            var fallbackPath = Path.Combine(Host.RootPath, "examples", "scenario_delta_warehouse_v1.json");
            if (File.Exists(fallbackPath))
            {
                File.Copy(fallbackPath, _scenarioPath, overwrite: true);
            }
        }

        var scenario = _scenarioRepository.LoadFromFile(_scenarioPath);
        _scenarioRuntime.Start(_gameState, scenario);
    }

    private void OnChoiceSelected(string choiceId)
    {
        var result = _scenarioRuntime.SelectChoice(_gameState, choiceId);
        var message = result.Ok ? $"Choice applied: {choiceId}" : $"Choice blocked: {result.ErrorMessage}";
        RefreshPanels(message);
    }

    private void RefreshPanels(string statusMessage)
    {
        var view = _scenarioRuntime.GetView(_gameState);

        if (_messagesPanel is not null)
        {
            _messagesPanel.TranscriptLines = _gameState.Session.Transcript
                .Select(t => $"[{t.Source}] {t.Text}")
                .ToList();
        }

        if (_choicesPanel is not null)
        {
            _choicesPanel.Choices = view.Choices.Select(c => new ChoiceItem(c.Id, c.Label)).ToList();
        }

        if (_statsPanel is not null)
        {
            _statsPanel.Archetype = _gameState.Player.Archetype;
            _statsPanel.SignatureSkill = _gameState.Player.SignatureSkill;
            _statsPanel.KnownSkills = _gameState.Player.Skills.Count;
        }

        if (_debugPanel is not null)
        {
            _debugPanel.ScenarioId = _gameState.Session.ScenarioId;
            _debugPanel.NodeId = view.NodeId;
            _debugPanel.ScenarioPath = _scenarioPath;
            _debugPanel.LastMessage = statusMessage;
        }
    }

    private static void DrawDesktopBackdrop()
    {
        Raylib.DrawRectangle(0, 0, Raylib.GetScreenWidth(), Raylib.GetScreenHeight(), new Color(15, 22, 31, 255));
        Raylib.DrawRectangle(0, 48, Raylib.GetScreenWidth(), 2, new Color(57, 76, 101, 255));
        Raylib.DrawText("SignalDesk Runtime Desktop", 208, 24, 18, Color.LightGray);
    }
        Raylib.DrawRectangle(40, 60, 1520, 800, new Color(25, 32, 44, 255));
        Raylib.DrawRectangleLines(40, 60, 1520, 800, new Color(90, 110, 132, 255));

        Raylib.DrawText("Desktop Runtime (Phase B)", 62, 82, 36, Color.RayWhite);
        Raylib.DrawText($"Archetype: {_archetype}", 64, 130, 24, Color.LightGray);
        Raylib.DrawText("Next phases wire scenario runtime, draggable panels, checks, and saves.", 64, 168, 22, Color.Gray);

        if (UiElements.Button(new Rectangle(64, 760, 210, 46), "Back to Menu"))
        {
            Host.SceneManager.Replace(new MainMenuScene(Host));
        }
    }
}
