using SignalDesk.Core.Models;

namespace SignalDesk.Core.Checks;

public interface ICheckResolver
{
    CheckResult Resolve(GameState state, CheckRequest request);
}

public sealed class CheckResolver : ICheckResolver
{
    private readonly Random _random = new(); // Step 2: replace with seeded IRandomService

    public CheckResult Resolve(GameState state, CheckRequest request)
    {
        var dieA = _random.Next(1, 7);
        var dieB = _random.Next(1, 7);
        var skillValue = state.Player.Skills.TryGetValue(request.SkillId, out var v) ? v : 0;
        var modifier = 0; // TODO: transcript analyzer / inventory / thought cabinet / relationships / district state
        var total = dieA + dieB + skillValue + modifier;
        var delta = total - request.Difficulty;

        var band = delta switch
        {
            <= -4 => CheckBand.CriticalFailure,
            <= -1 => CheckBand.Failure,
            0 or 1 => CheckBand.PartialSuccess,
            <= 4 => CheckBand.Success,
            _ => CheckBand.StrongSuccess
        };

        return new CheckResult
        {
            DieA = dieA,
            DieB = dieB,
            SkillValue = skillValue,
            Modifier = modifier,
            Total = total,
            Band = band
        };
    }
}
