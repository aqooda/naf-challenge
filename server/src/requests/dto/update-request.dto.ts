import { Type } from 'class-transformer';
import { IsIn, IsUUID, ValidateNested } from 'class-validator';
import { HighlightStatus, highlightStatuses } from 'src/utils/highlight';

class Highlight {
  @IsUUID()
  id: string;

  @IsIn(highlightStatuses)
  status: HighlightStatus;
}

export class UpdateRequestDto {
  @ValidateNested({ each: true })
  @Type(() => Highlight)
  highlights: Highlight[];
}
