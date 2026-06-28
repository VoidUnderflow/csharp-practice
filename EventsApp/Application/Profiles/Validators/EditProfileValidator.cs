using Application.Profiles.Commands;
using FluentValidation;

namespace Application.Profiles.Validators;

public class EditProfileValidator : AbstractValidator<EditProfile.Command>
{
    public EditProfileValidator()
    {
        RuleFor(x => x.DisplayName)
            .NotEmpty().WithMessage("Display name is required")
            .MaximumLength(100).WithMessage("Display name must not exceed 100 characters");
    }
}
