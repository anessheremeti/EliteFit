namespace EliteFit.Application.DTOs.Admin
{
    public class UserAdminDto
    {
        public int              Id       { get; set; }
        public string           FullName { get; set; } = string.Empty;
        public string           Email    { get; set; } = string.Empty;
        public List<UserRoleDto> Roles   { get; set; } = new();
        public bool             IsActive { get; set; }
    }
}
