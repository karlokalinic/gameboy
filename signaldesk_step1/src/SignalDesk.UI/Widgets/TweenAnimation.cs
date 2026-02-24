namespace SignalDesk.UI.Widgets;

public static class TweenAnimation
{
    public static float Damp(float current, float target, float lambda, float dt)
    {
        // Exponential smoothing helper for UI animations.
        return current + (target - current) * (1f - MathF.Exp(-lambda * dt));
    }
}
