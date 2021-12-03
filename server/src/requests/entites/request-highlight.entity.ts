import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Request } from './index';
import { HighlightStatus, highlightStatuses, HighlightType, highlightTypes } from 'src/utils/highlight';

@Entity()
export class RequestHighlight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Request, ({ highlights }) => highlights, { cascade: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  request: Request;

  @Column({ enum: highlightTypes })
  type: HighlightType;

  @Column()
  details: string;

  @Column({ enum: highlightStatuses, nullable: true })
  status: HighlightStatus;

  @Column({ nullable: true })
  reviewedAt: Date;
}
