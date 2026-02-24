namespace SignalDesk.Data.Services;

public sealed class SchemaValidationIssue
{
    public string Severity { get; set; } = "warning"; // info/warning/error
    public string Message { get; set; } = string.Empty;
    public string? Path { get; set; }
}

public interface ISchemaValidationService
{
    IReadOnlyList<SchemaValidationIssue> ValidateScenarioJson(string json);
}

public sealed class SchemaValidationService : ISchemaValidationService
{
    public IReadOnlyList<SchemaValidationIssue> ValidateScenarioJson(string json)
    {
        // Step 2: wire actual JSON schema lib if desired.
        // Step 1 skeleton intentionally returns placeholder issue list.
        return Array.Empty<SchemaValidationIssue>();
    }
}
