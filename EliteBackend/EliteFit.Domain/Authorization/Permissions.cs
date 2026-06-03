namespace EliteFit.Domain.Authorization
{
    /// <summary>
    /// Centralized permission constants used by HasPermissionAttribute and authorization policies.
    /// Format: "Resource.Action"
    /// </summary>
    public static class Permissions
    {
        public static class Recipes
        {
            public const string View   = "Recipe.View";
            public const string Create = "Recipe.Create";
            public const string Update = "Recipe.Update";
            public const string Delete = "Recipe.Delete";
        }

        public static class Videos
        {
            public const string View   = "Video.View";
            public const string Create = "Video.Create";
            public const string Update = "Video.Update";
            public const string Delete = "Video.Delete";
        }

        public static class Badges
        {
            public const string View   = "Badge.View";
            public const string Create = "Badge.Create";
            public const string Update = "Badge.Update";
            public const string Delete = "Badge.Delete";
        }

        public static class Users
        {
            public const string View       = "User.View";
            public const string Manage     = "User.Manage";
            public const string Activate   = "User.Activate";
            public const string Deactivate = "User.Deactivate";
        }

        public static class AuditLogs
        {
            public const string View = "AuditLog.View";
        }

        public static class Roles
        {
            public const string View   = "Role.View";
            public const string Create = "Role.Create";
            public const string Update = "Role.Update";
            public const string Delete = "Role.Delete";
        }

        /// <summary>Returns all defined permissions as a flat list.</summary>
        public static IEnumerable<string> All() =>
        [
            Recipes.View, Recipes.Create, Recipes.Update, Recipes.Delete,
            Videos.View,  Videos.Create,  Videos.Update,  Videos.Delete,
            Badges.View,  Badges.Create,  Badges.Update,  Badges.Delete,
            Users.View,   Users.Manage,   Users.Activate, Users.Deactivate,
            AuditLogs.View,
            Roles.View,   Roles.Create,   Roles.Update,   Roles.Delete,
        ];
    }
}
