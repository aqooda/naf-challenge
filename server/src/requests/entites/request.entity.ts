import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RequestHighlight } from './index';

@Entity()
export class Request {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  requesterEmail: string;

  @Column()
  approverEmail: string;

  @Column()
  subject: string;

  @Column()
  pdfPath: string;

  @OneToMany(() => RequestHighlight, ({ request }) => request, { cascade: ['insert', 'update', 'soft-remove'] })
  highlights: RequestHighlight[];

  @CreateDateColumn()
  requestedAt: Date;

  @Column({ nullable: true })
  reviewedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
