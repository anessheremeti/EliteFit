using Microsoft.AspNetCore.Authorization;

namespace EliteFit.Api.Authorization
{
    /// <summary>
    /// Shorthand for [Authorize(Policy = "permission")].
    /// Usage: [HasPermission(Permissions.Recipes.Create)]
    /// </summary>
    public sealed class HasPermissionAttribute(string permission)
        : AuthorizeAttribute(permission);
}
