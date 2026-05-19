using EliteFit.Application.Features.Commands.Auth;
using FluentValidation;

namespace EliteFit.Application.Validators
{
    public class ResetPasswordValidator : AbstractValidator<ResetPasswordCommand>
    {
        public ResetPasswordValidator()
        {
            RuleFor(x => x.Request.Token)
                .NotEmpty().WithMessage("Reset token is required.");

            RuleFor(x => x.Request.NewPassword)
                .NotEmpty().WithMessage("New password is required.")
                .MinimumLength(8).WithMessage("Password must be at least 8 characters.")
                .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
                .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter.")
                .Matches("[0-9]").WithMessage("Password must contain at least one digit.");

            RuleFor(x => x.Request.ConfirmPassword)
                .Equal(x => x.Request.NewPassword).WithMessage("Passwords do not match.");
        }
    }
}
