import { Type } from 'class-transformer';
import { IsEmail, IsIn, IsString, ValidateNested } from 'class-validator';
import { HighlightType, highlightTypes } from 'src/utils/highlight';

class Highlight {
  @IsIn(highlightTypes)
  type: HighlightType;

  @IsString()
  content: string;

  @IsString()
  position: string;
}

export class CreateRequestDto {
  @IsEmail()
  requesterEmail: string;

  @IsEmail()
  approverEmail: string;

  @IsString()
  subject: string;

  @IsString()
  pdf: string;

  @ValidateNested({ each: true })
  @Type(() => Highlight)
  highlights: Highlight[];
}
