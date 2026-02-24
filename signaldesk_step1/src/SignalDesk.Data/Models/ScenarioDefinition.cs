namespace SignalDesk.Data.Models;

public sealed class ScenarioDefinition
{
    public string Id { get; set; } = string.Empty;
    public int Version { get; set; }
    public string Title { get; set; } = string.Empty;
    public string StartNode { get; set; } = string.Empty;
    public List<ScenarioNode> Nodes { get; set; } = new();
    public List<ScenarioEnding>? Endings { get; set; }
}

public sealed class ScenarioNode
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = "message";
    public string? Speaker { get; set; }
    public string? Channel { get; set; }
    public string? Text { get; set; }
    public List<ScenarioChoice>? Choices { get; set; }
    public List<ScenarioEffect>? Effects { get; set; }
    public string? Next { get; set; }
    public string? EndingId { get; set; }
}

public sealed class ScenarioChoice
{
    public string Id { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string? Next { get; set; }
    public ScenarioCheck? Check { get; set; }
    public List<ScenarioCondition>? Conditions { get; set; }
    public List<ScenarioEffect>? Effects { get; set; }
}

public sealed class ScenarioCheck
{
    public string Skill { get; set; } = string.Empty;
    public int Difficulty { get; set; }
    public Dictionary<string, string>? On { get; set; }
}

public sealed class ScenarioCondition
{
    public string Op { get; set; } = string.Empty;
    public string? Key { get; set; }
    public object? Value { get; set; }
    public Dictionary<string, object?>? Args { get; set; }
}

public sealed class ScenarioEffect
{
    public string Op { get; set; } = string.Empty;
    public string? Key { get; set; }
    public object? Value { get; set; }
    public Dictionary<string, object?>? Args { get; set; }
}

public sealed class ScenarioEnding
{
    public string Id { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string? Summary { get; set; }
}
