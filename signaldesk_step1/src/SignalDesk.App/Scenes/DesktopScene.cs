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
        Host.LogInfo("Scene transition: desktop");

        _gameState.Player.Archetype = _archetype;
        _gameState.Player.SignatureSkill = "logic";
        _gameState.Player.Skills["authority"] = 3;
        _gameState.Player.Skills["logic"] = 4;
        _gameState.Player.Skills["suggestion"] = 2;
        _gameState.Player.Flags["clothing_tags"] = "formal,intimidating";
        _gameState.World.GlobalFlags["weather"] = "rain";
        _gameState.Relationships["mila_runner"] = new RelationshipState { Value = 18 };
        _gameState.Relationships["handler_iris"] = new RelationshipState { Value = 35 };
        _gameState.SocialGraph.Links.Add(new SocialLink
        {
            FromId = "mila_runner",
            ToId = "handler_iris",
            RelationType = RelationType.Friend,
            Weight = 0.8f
        });

        BuildWindows();

        try
        {
            LoadScenario();
            RefreshPanels("Desktop initialized");
        }
        catch (Exception ex)
        {
            Host.LogError("Scenario load failed", ex);
            _gameState.Session.Transcript.Add(new TranscriptEntry
            {
                Source = "system",
                Channel = "system",
                Text = $"Scenario load error: {ex.Message}"
            });
            RefreshPanels("Scenario load failed");
        }
    }

    public override void Update(float dt)
    {
        _windowManager.Update(dt);
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
        var scenariosPath = Host.ScenarioDataPath;
        Directory.CreateDirectory(scenariosPath);

        _scenarioPath = Path.Combine(scenariosPath, "scenario_delta_warehouse_v1.json");

        if (!File.Exists(_scenarioPath))
        {
            var fallbackPath = ResolveExampleScenarioPath();
            if (fallbackPath is null)
            {
                throw new FileNotFoundException("Could not locate example scenario file.", _scenarioPath);
            }

            File.Copy(fallbackPath, _scenarioPath, overwrite: true);
            Host.LogInfo($"Scenario copied from example source: {fallbackPath}");
        }

        var scenario = _scenarioRepository.LoadFromFile(_scenarioPath);
        Host.LogInfo($"Scenario loaded: {_scenarioPath}");
        _scenarioRuntime.Start(_gameState, scenario);
    }

    private string? ResolveExampleScenarioPath()
    {
        var candidates = new[]
        {
            Path.Combine(Host.RootPath, "examples", "scenario_delta_warehouse_v1.json"),
            Path.Combine(Host.RootPath, "signaldesk_step1", "examples", "scenario_delta_warehouse_v1.json"),
            Path.Combine(Directory.GetCurrentDirectory(), "..", "examples", "scenario_delta_warehouse_v1.json"),
            Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "examples", "scenario_delta_warehouse_v1.json")
        };

        return candidates
            .Select(Path.GetFullPath)
            .FirstOrDefault(File.Exists);
    }

    private void OnChoiceSelected(string choiceId)
    {
        var result = _scenarioRuntime.SelectChoice(_gameState, choiceId);
        var message = result.Ok ? $"Choice applied: {choiceId}" : $"Choice blocked: {result.ErrorMessage}";
        Host.LogInfo(message);
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
            if (_gameState.Session.RollHistory.Count > 0)
            {
                var lastRoll = _gameState.Session.RollHistory[^1];
                _debugPanel.LastMessage = $"{statusMessage} | Roll {lastRoll.Skill}={lastRoll.Total} ({lastRoll.Band})";
            }
            else
            {
                _debugPanel.LastMessage = statusMessage;
            }
        }
    }

    private static void DrawDesktopBackdrop()
    {
        Raylib.DrawRectangle(0, 0, Raylib.GetScreenWidth(), Raylib.GetScreenHeight(), new Color(15, 22, 31, 255));
        Raylib.DrawRectangle(0, 48, Raylib.GetScreenWidth(), 2, new Color(57, 76, 101, 255));
        Raylib.DrawText("SignalDesk Runtime Desktop", 208, 24, 18, Color.LightGray);
    }
}
