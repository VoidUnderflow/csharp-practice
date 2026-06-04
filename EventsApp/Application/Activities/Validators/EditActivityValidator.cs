using System;
using Application.Activities.Commands;
using Application.Activities.Validators;
using FluentValidation;

namespace Application.Activities.DTOs.Validators;

public class EditActivityValidator : BaseActivityValidator<EditActivity.Command, EditActivityDto>
{
    public EditActivityValidator() : base(x => x.ActivityDto)
    {
        RuleFor(x => x.ActivityDto.Id).NotEmpty().WithMessage("Id is required");
    }
}