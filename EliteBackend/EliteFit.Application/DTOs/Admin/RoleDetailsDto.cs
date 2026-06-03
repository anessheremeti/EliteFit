namespace EliteFit.Application.DTOs.Admin
{
    public class RoleDetailsDto
    {
        public int                 Id          { get; set; }
        public string              Name        { get; set; } = string.Empty;
        public string?             Description { get; set; }
        public List<PermissionDto> Permissions { get; set; } = new();
    }
}
