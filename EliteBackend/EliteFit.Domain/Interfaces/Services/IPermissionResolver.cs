namespace EliteFit.Domain.Interfaces.Services
{
    public interface IPermissionResolver
    {
        Task<HashSet<string>> GetPermissionsForRoleAsync(string roleName, CancellationToken ct = default);
    }
}
