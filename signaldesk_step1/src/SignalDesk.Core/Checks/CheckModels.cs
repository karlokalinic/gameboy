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
}

public sealed class CheckResult
{
    public required int DieA { get; init; }
    public required int DieB { get; init; }
    public required int SkillValue { get; init; }
    public required int Modifier { get; init; }
    public required int Total { get; init; }
    public required CheckBand Band { get; init; }
}
