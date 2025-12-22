import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'PCCONSUM',
})
export class ConfigurationEntity {
  @PrimaryColumn({ name: 'ID', type: 'number', generated: true })
  id: number;

  @Column({ name: 'PROXNUMLANC', type: 'number', nullable: true })
  nextIssueRelease: number;
}
