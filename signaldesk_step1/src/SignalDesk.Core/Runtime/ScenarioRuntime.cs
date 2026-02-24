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
