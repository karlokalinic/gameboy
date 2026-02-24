using SignalDesk.Data.Models;

namespace SignalDesk.Core.Checks;

public enum CheckBand
{
    CriticalFailure,
    Failure,
    PartialSuccess,
    Success,
    StrongSuccess
}

public sealed class CheckRequest
{
    public required string SkillId { get; init; }
    public required int Difficulty { get; init; }
    public string Context { get; init; } = string.Empty;
    public string? TargetId { get; init; }
    public IReadOnlyList<ScenarioModifierRule> Rules { get; init; } = Array.Empty<ScenarioModifierRule>();
}

public sealed class CheckModifier
{
    public required string Source { get; init; }
    public required int Value { get; init; }
    public required string Reason { get; init; }
}

public sealed class CheckResult
{
    public required int DieA { get; init; }
    public required int DieB { get; init; }
    public required int SkillValue { get; init; }
    public required int Modifier { get; init; }
    public required int Total { get; init; }
    public required CheckBand Band { get; init; }
    public IReadOnlyList<CheckModifier> Breakdown { get; init; } = Array.Empty<CheckModifier>();
}
