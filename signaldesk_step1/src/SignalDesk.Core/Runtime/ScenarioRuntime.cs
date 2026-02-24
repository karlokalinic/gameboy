using SignalDesk.Core.Checks;
using SignalDesk.Core.Models;
using SignalDesk.Data.Models;

namespace SignalDesk.Core.Runtime;

public interface IScenarioRuntime
{
    void Start(GameState state, ScenarioDefinition scenario);
    RuntimeView GetView(GameState state);
    RuntimeResolutionResult SelectChoice(GameState state, string choiceId);
}

public sealed class ScenarioRuntime : IScenarioRuntime
{
    private readonly ICheckResolver _checkResolver;
    private ScenarioDefinition? _scenario;

    public ScenarioRuntime() : this(new CheckResolver())
    {
    }

    public ScenarioRuntime(ICheckResolver checkResolver)
    {
        _checkResolver = checkResolver;
    }

    private ScenarioDefinition? _scenario;

    public void Start(GameState state, ScenarioDefinition scenario)
    {
        _scenario = scenario;
        state.Session.ScenarioId = scenario.Id;
        state.Session.CurrentNodeId = scenario.StartNode;
        state.Session.ScenarioEnded = false;

        AddTranscript(state, "system", $"Scenario loaded: {scenario.Title} ({scenario.Id})");
        AddNodeTranscript(state, scenario.StartNode);
        var startNode = scenario.Nodes.First(n => n.Id == scenario.StartNode);
        if (!string.IsNullOrWhiteSpace(startNode.Text))
        {
            state.Session.Transcript.Add(new TranscriptEntry
            {
                Source = startNode.Speaker ?? "system",
                Channel = startNode.Channel ?? "inbox",
                Text = startNode.Text
            });
        }
    }

    public RuntimeView GetView(GameState state)
    {
        if (_scenario is null)
        {
            return RuntimeView.Empty;
        }

        if (_scenario is null) return RuntimeView.Empty;
        var node = _scenario.Nodes.First(n => n.Id == state.Session.CurrentNodeId);
        return RuntimeView.FromNode(node);
    }

    public RuntimeResolutionResult SelectChoice(GameState state, string choiceId)
    {
        // TODO(step3b): execute condition/effect pipelines around choices and nodes.
        // TODO(step3): implement full condition/effect/check resolution pipeline.
        if (_scenario is null)
        {
            return RuntimeResolutionResult.Error("Scenario not started");
        }

        var node = _scenario.Nodes.First(n => n.Id == state.Session.CurrentNodeId);
        var choice = node.Choices?.FirstOrDefault(c => c.Id == choiceId);
        if (choice is null)
        {
            return RuntimeResolutionResult.Error($"Choice '{choiceId}' not found");
        }

        AddTranscript(state, "player", $"Choice selected: {choice.Label}");

        string? nextNode = choice.Next;

        if (choice.Check is not null)
        {
            var checkRequest = new CheckRequest
            {
                SkillId = choice.Check.Skill,
                Difficulty = choice.Check.Difficulty,
                Context = $"choice:{choice.Id}",
                TargetId = node.Speaker,
                Rules = choice.Check.Modifiers ?? Array.Empty<ScenarioModifierRule>()
            };

            var result = _checkResolver.Resolve(state, checkRequest);
            LogCheck(state, checkRequest, result);
            var key = ToOutcomeKey(result.Band);

            if (choice.Check.On is null || !choice.Check.On.TryGetValue(key, out nextNode))
            {
                return RuntimeResolutionResult.Error($"No check branch configured for '{key}'");
            }
        }

        if (string.IsNullOrWhiteSpace(nextNode))
        {
            return RuntimeResolutionResult.Error("Choice has no next target");
        }

        state.Session.CurrentNodeId = nextNode;
        if (choice.Check is not null)
        {
            AddTranscript(state, "system", $"(CHECK TODO) '{choice.Check.Skill}' vs DC {choice.Check.Difficulty}.");
            return RuntimeResolutionResult.Error("Check resolution not implemented yet in this phase.");
        }

        if (string.IsNullOrWhiteSpace(choice.Next))
        {
            return RuntimeResolutionResult.Error("Choice has no 'next' target in Step 2 runtime");
        }

        state.Session.CurrentNodeId = choice.Next!;
        AddNodeTranscript(state, state.Session.CurrentNodeId);

        return RuntimeResolutionResult.Success();
    }

    private static string ToOutcomeKey(CheckBand band) => band switch
    {
        CheckBand.CriticalFailure => "critical_fail",
        CheckBand.Failure => "fail",
        CheckBand.PartialSuccess => "partial",
        CheckBand.Success => "success",
        CheckBand.StrongSuccess => "strong_success",
        _ => "fail"
    };

    private static void LogCheck(GameState state, CheckRequest request, CheckResult result)
    {
        state.Session.RollHistory.Add(new RollLogEntry
        {
            Skill = request.SkillId,
            Difficulty = request.Difficulty,
            DieA = result.DieA,
            DieB = result.DieB,
            SkillValue = result.SkillValue,
            Modifier = result.Modifier,
            Total = result.Total,
            Band = result.Band.ToString(),
            Context = request.Context
        });

        AddTranscript(state, "system", $"Check {request.SkillId} [{result.Band}] total={result.Total} vs DC {request.Difficulty}");
        foreach (var mod in result.Breakdown)
        {
            AddTranscript(state, "system", $"  {mod.Value:+#;-#;0} {mod.Source} - {mod.Reason}");
        }
    }

    private void AddNodeTranscript(GameState state, string nodeId)
    {
        if (_scenario is null)
        {
            return;
        }

        var node = _scenario.Nodes.First(n => n.Id == nodeId);
        AddTranscript(state, "system", $"Node entered: {node.Id}");

        if (!string.IsNullOrWhiteSpace(node.Text))
        {
            state.Session.Transcript.Add(new TranscriptEntry
            {
                Source = node.Speaker ?? "system",
                Channel = node.Channel ?? "inbox",
                Text = node.Text
            });
        }
    }

    private static void AddTranscript(GameState state, string source, string text)
    {
        state.Session.Transcript.Add(new TranscriptEntry
        {
            Source = source,
            Channel = "system",
            Text = text
        });
        // Step 2 intentionally simple: no checks/conditions/effects yet.
        // Step 3+: implement full condition/effect/check pipeline.
        if (_scenario is null) return RuntimeResolutionResult.Error("Scenario not started");
        var node = _scenario.Nodes.First(n => n.Id == state.Session.CurrentNodeId);
        var choice = node.Choices?.FirstOrDefault(c => c.Id == choiceId);
        if (choice is null) return RuntimeResolutionResult.Error($"Choice '{choiceId}' not found");

        if (string.IsNullOrWhiteSpace(choice.Next))
            return RuntimeResolutionResult.Error("Choice has no 'next' target in Step 2 runtime");

        state.Session.CurrentNodeId = choice.Next!;
        var next = _scenario.Nodes.First(n => n.Id == state.Session.CurrentNodeId);
        if (!string.IsNullOrWhiteSpace(next.Text))
        {
            state.Session.Transcript.Add(new TranscriptEntry
            {
                Source = next.Speaker ?? "system",
                Channel = next.Channel ?? "inbox",
                Text = next.Text
            });
        }

        return RuntimeResolutionResult.Success();
    }
}

public sealed class RuntimeView
{
    public static RuntimeView Empty { get; } = new();
    public string NodeId { get; init; } = string.Empty;
    public string NodeType { get; init; } = string.Empty;
    public string? Text { get; init; }
    public IReadOnlyList<RuntimeChoiceView> Choices { get; init; } = Array.Empty<RuntimeChoiceView>();

    public static RuntimeView FromNode(ScenarioNode node)
        => new()
        {
            NodeId = node.Id,
            NodeType = node.Type,
            Text = node.Text,
            Choices = (node.Choices ?? new List<ScenarioChoice>())
                .Select(c => new RuntimeChoiceView(c.Id, c.Check is null ? c.Label : $"{c.Label} [CHECK]"))
                .Select(c => new RuntimeChoiceView(c.Id, c.Check is null ? c.Label : $"{c.Label} (CHECK TODO)"))
                .Select(c => new RuntimeChoiceView(c.Id, c.Label))
                .ToList()
        };
}

public sealed record RuntimeChoiceView(string Id, string Label);

public sealed class RuntimeResolutionResult
{
    public bool Ok { get; init; }
    public string? ErrorMessage { get; init; }
    public static RuntimeResolutionResult Success() => new() { Ok = true };
    public static RuntimeResolutionResult Error(string message) => new() { Ok = false, ErrorMessage = message };
}
