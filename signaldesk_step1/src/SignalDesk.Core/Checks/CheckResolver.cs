using SignalDesk.Core.Models;

namespace SignalDesk.Core.Checks;

public interface ICheckResolver
{
    CheckResult Resolve(GameState state, CheckRequest request);
}

public sealed class CheckResolver : ICheckResolver
{
    private readonly Random _random = new(); // TODO(step4): replace with seeded IRandomService
    private readonly Random _random = new(); // Step 2: replace with seeded IRandomService

    public CheckResult Resolve(GameState state, CheckRequest request)
    {
        var dieA = _random.Next(1, 7);
        var dieB = _random.Next(1, 7);
        var skillValue = state.Player.Skills.TryGetValue(request.SkillId, out var v) ? v : 0;
        var breakdown = BuildBreakdown(state, request);
        var modifier = breakdown.Sum(x => x.Value);
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
            Band = band,
            Breakdown = breakdown
        };
    }

    private static List<CheckModifier> BuildBreakdown(GameState state, CheckRequest request)
    {
        var modifiers = new List<CheckModifier>();

        if (string.Equals(state.Player.SignatureSkill, request.SkillId, StringComparison.OrdinalIgnoreCase))
        {
            modifiers.Add(new CheckModifier { Source = "signature", Value = 1, Reason = "Signature skill alignment" });
        }

        if (state.World.GlobalFlags.TryGetValue("weather", out var weatherObj) && weatherObj is string weather)
        {
            if (weather == "rain" && (request.SkillId == "perception" || request.SkillId == "reaction_speed"))
            {
                modifiers.Add(new CheckModifier { Source = "weather", Value = -1, Reason = "Rain reduces clarity" });
            }
        }

        if (state.Player.Flags.TryGetValue("clothing_tags", out var tagsObj) && tagsObj is string tags)
        {
            if (tags.Contains("intimidating", StringComparison.OrdinalIgnoreCase) && request.SkillId == "authority")
            {
                modifiers.Add(new CheckModifier { Source = "clothing", Value = 1, Reason = "Intimidating appearance" });
            }
        }

        ApplyRelationshipModifiers(state, request, modifiers);
        ApplyRuleModifiers(state, request, modifiers);

        return modifiers;
    }

    private static void ApplyRelationshipModifiers(GameState state, CheckRequest request, List<CheckModifier> modifiers)
    {
        if (string.IsNullOrWhiteSpace(request.TargetId))
        {
            return;
        }

        if (state.Relationships.TryGetValue(request.TargetId, out var direct))
        {
            if (direct.Value >= 25)
            {
                modifiers.Add(new CheckModifier { Source = "relationship", Value = 1, Reason = $"Trust with {request.TargetId}" });
            }
            else if (direct.Value <= -25)
            {
                modifiers.Add(new CheckModifier { Source = "relationship", Value = -1, Reason = $"Hostility with {request.TargetId}" });
            }
        }

        var friendLinks = state.SocialGraph.Links.Where(l => l.FromId == request.TargetId);
        foreach (var link in friendLinks)
        {
            if (link.RelationType is RelationType.Friend or RelationType.Ally)
            {
                if (state.Relationships.TryGetValue(link.ToId, out var related) && related.Value >= 30)
                {
                    modifiers.Add(new CheckModifier
                    {
                        Source = "social_graph",
                        Value = 1,
                        Reason = $"Indirect goodwill via {link.ToId}"
                    });
                    break;
                }
            }
        }
    }

    private static void ApplyRuleModifiers(GameState state, CheckRequest request, List<CheckModifier> modifiers)
    {
        foreach (var rule in request.Rules)
        {
            if (rule.Type == "player_clothing_tag" &&
                state.Player.Flags.TryGetValue("clothing_tags", out var tagsObj) &&
                tagsObj is string tags &&
                !string.IsNullOrWhiteSpace(rule.Tag) &&
                tags.Contains(rule.Tag, StringComparison.OrdinalIgnoreCase))
            {
                modifiers.Add(new CheckModifier { Source = "rule:clothing", Value = rule.Bonus, Reason = rule.Reason });
            }

            if (rule.Type == "weather_tag" &&
                state.World.GlobalFlags.TryGetValue("weather", out var weatherObj) &&
                weatherObj is string weather &&
                !string.IsNullOrWhiteSpace(rule.Tag) &&
                string.Equals(weather, rule.Tag, StringComparison.OrdinalIgnoreCase))
            {
                modifiers.Add(new CheckModifier { Source = "rule:weather", Value = rule.Bonus, Reason = rule.Reason });
            }
        }
    }
            Band = band
        };
    }
}
